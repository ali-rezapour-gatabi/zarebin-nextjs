'use server';

import axios from 'axios';
import { serverRequest } from '@/lib/api.server';

export async function SendOtp(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverRequest<{ success?: boolean; message?: string }>({
      method: 'POST',
      url: '/users/identity/send-otp/',
      data: {
        phone_number: phone,
      },
      skipAuth: true,
      skipRefresh: true,
    });

    if (response.data?.success === false) {
      return {
        success: false,
        message: 'خطا در ارتباط با سرور',
      };
    }

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message ?? error.message ?? 'Request failed',
      };
    }

    return {
      success: false,
      message: 'خطا در ارتباط با سرور',
    };
  }
}
