'use server';
import { api } from '@/lib/baseUrl';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function expertGetAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return { success: false, message: 'برای دسترسی به این صفحه لازم است وارد شوید' };
  }

  try {
    const response = await api.post('/identity/get-expert', null, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message ?? 'خطایی در بروزرسانی حساب رخ داد',
      };
    }

    return {
      success: true,
      message: response.data?.message ?? 'اطلاعات با موفقیت دریافت شد',
      data: response.data?.result,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message ?? error.message ?? 'خطای غیرمنتظره‌ای رخ داد',
      };
    }

    return {
      success: false,
      message: 'خطای غیرمنتظره‌ای رخ داد',
    };
  }
}
