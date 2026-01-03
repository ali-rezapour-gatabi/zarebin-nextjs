'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { serverRequest } from '@/lib/api.server';

export async function getUserAction(): Promise<{ success: boolean; message: string; data?: unknown }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access');

  if (!token) {
    return {
      success: false,
      message: 'برای مشاهده این بخش لازم است وارد شوید',
    };
  }

  try {
    const response = await serverRequest<{ success?: boolean; message?: string; result?: unknown; data?: unknown }>({
      method: 'POST',
      url: '/users/identity/get/',
      data: null,
    });

    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message ?? 'خطایی در بروزرسانی حساب رخ داد',
      };
    }

    return {
      success: true,
      message: response.data?.message ?? 'اطلاعات با موفقیت ذخیره شد',
      data: response.data?.result ?? response.data?.data,
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
