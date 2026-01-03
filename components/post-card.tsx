import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { User2, MessageCircle, Heart, ArrowLeftToLine } from 'lucide-react';
import { Button } from './ui/button';
import { DOMAINS } from '@/constant/domain.constant';
import Link from 'next/link';

export default function PostCard({ post }: { post: any }) {
  const domain = DOMAINS.find((domain: any) => domain.key === post.domain);
  return (
    <Card key={post.id}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          <Avatar className="size-10 rounded-full items-center justify-center">
            {post?.avatar ? (
              <AvatarImage src={'/api/' + post?.avatar} alt={post?.first_name} className="object-cover" />
            ) : (
              <User2 className="size-12 bg-primary/10 rounded-full p-2" />
            )}
          </Avatar>{' '}
          <h4 className="text-xs ">{post.author.first_name + ' ' + post.author.last_name}</h4>
        </div>
        <h3 className="text-xs bg-primary/20 p-2 rounded-xl">{domain?.value}</h3>
      </CardHeader>
      <CardContent className="h-32 flex flex-col gap-3">
        <h2 className="text-sm">{post.title}</h2>
      </CardContent>
      <CardFooter className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 justify-center">
            <MessageCircle className="size-5 text-primary" />
            <span className=" font-semibold">{post.comment_count != 0 ? post.comment_count : ''}</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Heart className="size-5 text-primary" />
            <span className=" font-semibold">{post.like_count != 0 ? post.like_count : ''}</span>
          </div>
        </div>
        <Link className="border border-secondary bg-accent rounded-lg px-5 py-2" href={`/idea/${post.id}`}>
          <ArrowLeftToLine className="size-6" />
        </Link>
      </CardFooter>
    </Card>
  );
}
