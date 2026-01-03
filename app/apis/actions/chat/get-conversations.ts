'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { serverRequest } from '@/lib/api.server';

export default async function getConversationsAction(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access');

  if (!token) {
    return { success: false, message: 'برای دسترسی به این صفحه لازم است وارد شوید' };
  }
  try {
    const response = await serverRequest<{ success: boolean; chats?: unknown }>({
      method: 'POST',
      url: 'chat/get-conversations',
      data: { slug },
    });
    return {
      success: response.data.success,
      data: response.data.chats,
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
