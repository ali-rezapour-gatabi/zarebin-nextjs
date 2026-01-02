'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ExpertForm } from '@/components/dashboard/expert-form';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/user';

export default function DashboardPage() {
  const { activeTab, setActiveTab } = useUserStore();

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'general' | 'expert')} className="space-y-6" dir="rtl">
        <div className="w-full overflow-x-auto">
          <TabsList className="md:w-fit">
            <TabsTrigger value="general" className="min-w-32 w-1/2">
              اطلاعات عمومی
            </TabsTrigger>
            <TabsTrigger value="expert" className="min-w-32 w-1/2">
              اطلاعات متخصص
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="expert" className="space-y-4">
          <ExpertForm />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
