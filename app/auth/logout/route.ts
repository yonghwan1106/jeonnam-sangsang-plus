import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function handleLogout(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

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
