import { Spinner } from '@/components/ui/spinner';

export function Loading({ content }: { content?: string }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <Spinner />
      <p>{content}</p>
    </div>
  );
}
