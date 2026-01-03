'use server';

import { api } from '@/lib/baseUrl';
import { cookies } from 'next/headers';

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
    const response = await api.post('/users/identity/get/', null, {
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
      message: response.data?.message ?? 'اطلاعات با موفقیت ذخیره شد',
      data: response.data?.result ?? response.data?.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? 'خطای غیرمنتظره‌ای رخ داد',
    };
  }
}
