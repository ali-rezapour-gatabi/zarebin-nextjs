'use server';
import { api } from '@/lib/baseUrl';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function createChatAction({ title }: { title: string }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return { success: false, message: 'برای دسترسی به این صفحه لازم است وارد شوید' };
  }
  try {
    const response = await api.post(
      'chat/create-chat-tab',
      { title },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );
    return {
      success: response.data.success,
      data: response.data.slug,
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
