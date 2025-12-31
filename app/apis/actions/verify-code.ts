'use server';

import { cookies } from 'next/headers';
import { api } from '@/lib/baseUrl';

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

type ActionResult = { success: true; message: string; data: SignDataResult } | { success: false; message: string };

export async function SignInWithOtp(input: SignInInput): Promise<ActionResult> {
  try {
    const response = await api.post('/identity/verify-otp/', {
      phone_number: input.phoneNumber,
      first_name: input.firstName,
      last_name: input.lastName,
      code: input.code,
    });

    if (response.data?.success === false) {
      return { success: false, message: response.data?.message ?? 'خطا در ارتباط با سرور' };
    }

    const token = response.data?.token;
    const refreshToken = response.data?.refresh;
    if (!token || !refreshToken) {
      return { success: false, message: 'احراض هویت ناموفق بود' };
    }

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: response.data?.message ?? 'ورود موفق',
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return { success: false, message: error.message ?? 'خطا در ارتباط با سرور' };
  }
}
