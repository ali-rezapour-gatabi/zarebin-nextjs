'use server';
import axios from 'axios';
import { serverRequest } from '@/lib/api.server';

export default async function GetIdeaListAction() {
  try {
    const res = await serverRequest<{ success?: boolean; message?: string; list?: unknown }>({
      method: 'POST',
      url: '/idea/ideas/list/',
      data: null,
    });

    if (res.data.success === false) {
      return {
        success: false,
        message: res.data.message,
      };
    }
    return {
      success: true,
      message: res.data.message,
      result: res.data.list,
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
