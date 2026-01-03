'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { serverRequest } from '@/lib/api.server';

type CreateIdeaInput = {
  title: string;
  description: string;
  domain: string;
  commentsVisibility: string;
};

export const CreateIdeaAction = async (data: CreateIdeaInput): Promise<{ success: boolean; message: string }> => {
  const cookie = await cookies();
  const token = cookie.get('access');
  if (!token) return { success: false, message: 'برای ادامه مراحل لطفا مجددا وارد شوید' };

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('domain', data.domain);
  formData.append('comments_visibility', data.commentsVisibility);

  try {
    const res = await serverRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: '/idea/ideas/create/',
      data: formData,
    });
    return { success: res.data.success, message: res.data.message };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message ?? error.message ?? 'خطای غیرمنتظره‌ای رخ داد' };
    }
    return { success: false, message: 'خطای غیرمنتظره‌ای رخ داد' };
  }
};
