'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { Button } from '@/components/ui/button';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatStore } from '@/store/chat';
import { Tabs } from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { setCurrentConversation, setExpertsList, setMessage, setMessages } = useChatStore();
  const [activeTab, setActiveTab] = useState('idea');
  useEffect(() => {
    setMessage('');
    setExpertsList([]);
    setMessages([]);
    setCurrentConversation(null);
  }, [setCurrentConversation, setExpertsList, setMessage, setMessages]);

  return (
    <main className="mx-auto flex flex-col justify-center items-center ">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="space-y-6 w-full h-full mt-20 min-w-[300px] md:min-w-[600px] lg:min-w-[800px]" dir="rtl">
        <div className="w-full overflow-x-auto">
          <TabsList className="w-full rounded-md flex justify-center mx-auto">
            <TabsTrigger value="idea" className="min-w-32 w-1/2">
              مطرح کردن ایده
            </TabsTrigger>
            <TabsTrigger value="chat" className="min-w-32 w-1/2">
              پیدا کردن متخصص
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat">
          <div className="mt-20" />
          <ChatContainer />
        </TabsContent>

        <TabsContent value="idea">
          <span>یا</span>
          <Button>آیده دارم ولی متخصصشو ندارم باید چیکار کنم!!!</Button>
        </TabsContent>
      </Tabs>
    </main>
  );
}
