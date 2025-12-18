'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

import { api } from '@/lib/baseUrl';

type UpdateUserResult = {
  success: boolean;
  message: string;
  data?: unknown;
};

export async function updateUserAction(formData: FormData): Promise<UpdateUserResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return { success: false, message: 'برای تغییرات این بخش لازم است وارد شوید' };
  }

  const forwardForm = new FormData();

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const nationalId = formData.get('nationalId');
  const avatar = formData.get('avatar');

  if (typeof firstName === 'string') forwardForm.append('firstName', firstName);
  if (typeof lastName === 'string') forwardForm.append('lastName', lastName);
  if (typeof phone === 'string') forwardForm.append('phone', phone);
  if (typeof email === 'string') forwardForm.append('email', email);
  if (typeof nationalId === 'string') forwardForm.append('nationalId', nationalId);
  if (avatar instanceof File) {
    forwardForm.append('avatar', avatar);
  }

  try {
    const response = await api.patch('/identity/update-user', forwardForm, {
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
