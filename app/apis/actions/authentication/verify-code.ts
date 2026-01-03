'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { serverRequest } from '@/lib/api.server';

type SignInInput = {
  phoneNumber: string;
  code: string;
  firstName?: string;
  lastName?: string;
};

type SignDataResult = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string | null;
  avatar: string | null;
};

type ActionResult = { success: true; message: string; data: SignDataResult | null; access: string } | { success: false; message: string };

export async function SignInWithOtp(input: SignInInput): Promise<ActionResult> {
  try {
    const response = await serverRequest<{ access?: string; refresh?: string; data?: SignDataResult; message?: string; success?: boolean }>({
      method: 'POST',
      url: '/users/identity/verify-otp/',
      data: {
        phone_number: input.phoneNumber,
        first_name: input.firstName,
        last_name: input.lastName,
        code: input.code,
      },
      skipAuth: true,
      skipRefresh: true,
    });

    if (response.data?.success === false) {
      return { success: false, message: response.data?.message ?? 'خطا در ارتباط با سرور' };
    }

    const access = response.data?.access;
    const refreshToken = response.data?.refresh;
    if (!access || !refreshToken) {
      return { success: false, message: 'احراض هویت ناموفق بود' };
    }

    const cookieStore = await cookies();
    cookieStore.set('access', access, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    cookieStore.set('refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: response.data?.message ?? 'ورود موفق',
      data: response.data?.data ?? null,
      access,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message ?? error.message ?? 'خطا در ارتباط با سرور' };
    }
    return { success: false, message: 'خطا در ارتباط با سرور' };
  }
}
