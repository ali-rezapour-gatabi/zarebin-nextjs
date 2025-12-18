'use server';

import { api } from '@/lib/baseUrl';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function expertUserAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return { success: false, message: 'برای تغییرات این بخش لازم است وارد شوید' };
  }

  try {
    const response = await api.post('/identity/expert-user', formData, {
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
  } catch (error: unknown) {
    console.log(error);
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
