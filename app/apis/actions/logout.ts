'use server';

import { api } from '@/lib/baseUrl';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  if (!cookieStore.get('refresh')) {
    return {
      success: false,
      message: 'برای خروج از سیستم لازم است اول ورود کنید',
    };
  }

  try {
    const response = await api.post('/users/identity/logout/', { token: cookieStore.get('refresh')?.value });

    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message ?? 'خطایی در خروج از سیستم رخ داد',
      };
    }

    cookieStore.delete('refresh');
    cookieStore.delete('access');
    return {
      success: true,
      message: response.data?.message ?? 'خروج از سیستم موفق',
    };
  } catch {
    return {
      success: false,
      message: 'خطای غیرمنتظره‌ای رخ داد',
    };
  }
}
