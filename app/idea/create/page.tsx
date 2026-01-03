'use client';
import { Controller, useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import TiptapEditor from '@/components/idea/tiptap-editor';
import IdeaForm from '@/components/idea/idea-form';
import { Button } from '@/components/ui/button';
import FileImportToEditor from '@/components/idea/file-import-to-editor';
import { CreateIdeaAction } from '@/app/apis/actions/create-idea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export type IdeaCreateFormValues = {
  title: string;
  description: string;
  domain: string;
  commentsVisibility: boolean;
};

export default function CreateIdea() {
  const [activeTab, setActiveTab] = useState('general');
  const router = useRouter();
  const {
    control,
    setValue,
    watch,
    formState: { isLoading },
  } = useForm<IdeaCreateFormValues>({
    defaultValues: {
      title: '',
      description: '',
      domain: '',
      commentsVisibility: true,
    },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const descriptionValue = watch('description') ?? '';

  const onSubmit = async (data: IdeaCreateFormValues) => {
    const res = await CreateIdeaAction(data);
    if (!res.success) return toast.error(res.message);
    toast.success(res.message);
    router.push('/dashboard/contents');
  };

  return (
    <form className="mt-6 w-full space-y-10 px-5" onSubmit={control.handleSubmit(onSubmit)}>
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
          <FileImportToEditor
            currentText={descriptionValue}
            onImport={(html) => setValue('description', html, { shouldDirty: true, shouldValidate: true })}
            disabled={isLoading}
            preserveMultipleSpaces
          />
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
          <div className="flex flex-col md:flex-row justify-between mb-10">
            <Button type="submit" className="px-10 text-foreground h-12">
              انتشار
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
