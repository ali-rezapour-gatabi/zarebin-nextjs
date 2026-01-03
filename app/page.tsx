'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { Button } from '@/components/ui/button';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatStore } from '@/store/chat';
import { Tabs } from '@radix-ui/react-tabs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { setCurrentConversation, setExpertsList, setMessage, setMessages } = useChatStore();
  const [activeTab, setActiveTab] = useState('idea');
  useEffect(() => {
    setMessage('');
    setExpertsList([]);
    setMessages([]);
    setCurrentConversation(null);
  }, [setCurrentConversation, setExpertsList, setMessage, setMessages]);

  return (
    <main className="mx-auto max-w-[1100px] w-full px-3">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="space-y-6 h-full mt-10 md:mt-20" dir="rtl">
        <div className="flex flex-col gap-2 md:flex-row justify-between">
          <TabsList className="h-11">
            <TabsTrigger value="idea" className="min-w-32 w-1/2">
              مطرح کردن ایده
            </TabsTrigger>
            <TabsTrigger value="chat" className="min-w-32 w-1/2">
              پیدا کردن متخصص
            </TabsTrigger>
          </TabsList>
          {activeTab === 'idea' && (
            <Button className="md:h-11 px-10" onClick={() => router.push('/idea/create')}>
              مطرح کردن ایده
            </Button>
          )}
          {activeTab === 'chat' && (
            <Button className="md:h-11 px-10" onClick={() => router.push('/idea/create')}>
              متخصصیاب
            </Button>
          )}
        </div>

        <TabsContent value="chat">
          <div className="mt-20" />
          <ChatContainer />
        </TabsContent>

        <TabsContent value="idea">
          <h2 className="md:px-20 text-md lg:text-lg font-bold text-center bg-primary/30 py-2 rounded-lg">
            ایده‌ها و پیشنهاداتت رو ثبت کن و برای مطرح‌کردن ایده‌ات یا پیدا کردن متخصص مناسب، به جمع کاربران ما بپیوند.
          </h2>
        </TabsContent>
      </Tabs>
    </main>
  );
}
