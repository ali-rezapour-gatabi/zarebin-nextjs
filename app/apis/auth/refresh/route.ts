import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

export async function POST() {
  const cookieStore = await cookies();
  const refresh = cookieStore.get('refresh')?.value;

  if (!refresh) {
    return NextResponse.json({ message: 'لطفا مجدد وارد شوید' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/users/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    return NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
  }

  const data = (await response.json()) as { access?: string; refresh?: string };
  if (!data.access) {
    return NextResponse.json({ message: 'Invalid refresh response' }, { status: 401 });
  }

  cookieStore.set('access', data.access, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  if (data.refresh) {
    cookieStore.set('refresh', data.refresh, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return NextResponse.json({ access: data.access });
}
