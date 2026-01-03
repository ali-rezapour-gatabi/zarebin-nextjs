'use client';
import { useParams } from 'next/navigation';
export default function IdeaDetailsPage() {
  const { id } = useParams();
  return <div>id: {id}</div>;
}
