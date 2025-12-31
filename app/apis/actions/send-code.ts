'use server';

import axios from 'axios';
import { api } from '@/lib/baseUrl';

export async function SendOtp(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/identity/send-otp/', {
      phone_number: phone,
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
