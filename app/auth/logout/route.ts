import { signOut } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

async function handleLogout(request: NextRequest) {
  await signOut();

  // 요청의 origin을 사용하여 올바른 URL로 리다이렉트
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/login`);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}
