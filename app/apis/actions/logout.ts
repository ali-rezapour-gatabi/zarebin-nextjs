'use server';

import { api } from '@/lib/baseUrl';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  if (!cookieStore.get('refreshToken')) {
    return {
      success: false,
      message: 'برای خروج از سیستم لازم است اول ورود کنید',
    };
  }

  console.log(cookieStore.get('refreshToken'));
  try {
    const response = await api.post('/identity/logout/', { token: cookieStore.get('refreshToken')?.value });

    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message ?? 'خطایی در خروج از سیستم رخ داد',
      };
    }

    cookieStore.delete('token');
    return {
      success: true,
      message: response.data?.message ?? 'خروج از سیستم موفق',
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: 'خطای غیرمنتظره‌ای رخ داد',
    };
  }
}
