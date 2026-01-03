'use server';

import { cookies } from 'next/headers';
import { serverRequest } from '@/lib/api.server';

export async function logoutAction() {
  const cookieStore = await cookies();
  if (!cookieStore.get('refresh')) {
    return {
      success: false,
      message: 'برای خروج از سیستم لازم است اول ورود کنید',
    };
  }

  try {
    const response = await serverRequest<{ success?: boolean; message?: string }>({
      method: 'POST',
      url: '/users/identity/logout/',
      data: { token: cookieStore.get('refresh')?.value },
      skipRefresh: true,
    });

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
