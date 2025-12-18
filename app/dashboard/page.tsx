'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ExpertForm } from '@/components/dashboard/expert-form';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/user';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { role, activeTab, setActiveTab } = useUserStore();
  const isExpert = role === 'expert';

  useEffect(() => {
    if (!isExpert && activeTab === 'expert') {
      setActiveTab('general');
    }
  }, [activeTab, isExpert, setActiveTab]);

  return (
    <DashboardLayout>
      <Tabs value={isExpert ? activeTab : 'general'} onValueChange={(value) => setActiveTab(value as 'general' | 'expert')} className="space-y-6" dir="rtl">
        <div className="w-full overflow-x-auto">
          <TabsList className="md:w-fit">
            <TabsTrigger value="general" className="min-w-32 w-1/2">
              اطلاعات عمومی
            </TabsTrigger>
            {isExpert && (
              <TabsTrigger value="expert" className="min-w-32 w-1/2">
                اطلاعات متخصص
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <ProfileForm />
        </TabsContent>

        {isExpert && (
          <TabsContent value="expert" className="space-y-4">
            <ExpertForm />
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
}
