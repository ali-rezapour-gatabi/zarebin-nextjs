'use server';
import { api } from '@/lib/baseUrl';
import { cookies } from 'next/headers';

export const CreateIdeaAction = async (data: any): Promise<{ success: boolean; message: string }> => {
  const cookie = await cookies();
  const token = cookie.get('access');
  if (!token) return { success: false, message: 'برای ادامه مراحل لطفا مجددا وارد شوید' };

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('domain', data.domain);
  formData.append('comments_visibility', data.commentsVisibility);

  try {
    const res = await api.post('/idea/ideas/create/', formData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return { success: res.data.success, message: res.data.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
