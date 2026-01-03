'use client';

import { useEffect, useState } from 'react';
import GetIdeaListAction from '@/app/apis/actions/dashboard/idea-list';
import { toast } from 'sonner';
import { Loading } from '@/components/spinner';
import PostCard from '@/components/post-card';

export default function IdeaContents() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    GetIdeaListAction()
      .then((res) => {
        if (mounted && res.result) {
          setPosts(res.result as any);
        }
      })
      .catch((err) => {
        toast.error(err?.message ?? 'خطا در دریافت اطلاعات');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loading content="در حال بارگذاری اطلاعات" />;

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{posts.map((post) => PostCard({ post }))}</div>;
}
