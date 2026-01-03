'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContentsPage() {
  const [activeTab, setActiveTab] = useState<'idea' | 'comment'>('idea');
  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'idea' | 'comment')} className="space-y-6" dir="rtl">
        <div className="w-full overflow-x-auto">
          <TabsList className="md:w-fit">
            <TabsTrigger value="idea" className="min-w-32 w-1/2">
              ایده ها
            </TabsTrigger>
            <TabsTrigger value="comment" className="min-w-32 w-1/2">
              نظرات
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="idea" className="space-y-4"></TabsContent>
        <TabsContent value="comment" className="space-y-4"></TabsContent>
        
      </Tabs>
    </DashboardLayout>
  );
}
