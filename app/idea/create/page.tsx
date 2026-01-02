'use client';
import { Controller, useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import TiptapEditor from '@/components/idea/tiptap-editor';
import IdeaForm from '@/components/idea/idea-form';
import { Button } from '@/components/ui/button';

type IdeaCreateFormValues = {
  title: string;
  description: string;
  domain: string;
  skill: string;
  seeComments: boolean;
};

export default function CreateIdea() {
  const [activeTab, setActiveTab] = useState('general');
  const {
    control,
    watch,
    formState: { isDirty, isLoading },
  } = useForm<IdeaCreateFormValues>();
  const hasBlank = watch('title')?.trim().length === 0 || watch('description')?.trim().length === 0 || watch('skill')?.trim().length === 0 || watch('domain')?.trim().length === 0;

  return (
    <form className="mt-6 w-full space-y-10 px-5">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'general' | 'description')} className="w-full space-y-6" dir="rtl">
        <div className="w-full overflow-x-auto">
          <TabsList className="md:w-fit">
            <TabsTrigger value="general" className="min-w-32 w-1/2">
              اطلاعات اولیه
            </TabsTrigger>
            <TabsTrigger value="description" className="min-w-32 w-1/2">
              توضیحات جامع
            </TabsTrigger>{' '}
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4 w-full">
          <IdeaForm control={control} setActiveTab={() => setActiveTab('description')} />
        </TabsContent>

        <TabsContent value="description" className="space-y-4">
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'توضیحات ایده الزامی است',
              minLength: {
                value: 100,
                message: 'توضیحات باید حداقل ۱۰۰ کاراکتر باشد',
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <TiptapEditor id="description" value={field.value ?? ''} onChange={field.onChange} isInvalid={!!fieldState.error} />
                {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
              </div>
            )}
          />{' '}
          <Button className="">انتشار</Button>
        </TabsContent>
      </Tabs>
    </form>
  );
}
