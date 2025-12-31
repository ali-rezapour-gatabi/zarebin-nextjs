'use server';
import { api } from '@/lib/baseUrl';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function sendMessageAction({ message, chatTabId }: { message: string; chatTabId: string | null }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return { success: false, message: 'برای دسترسی به این صفحه لازم است وارد شوید' };
  }
  try {
    const response = await api.post(
      'chat/send-message',
      { message, chatTabId },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    return {
      success: response.data.success,
      chat: response.data.analysis,
      expertsList: response.data.experts,
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
