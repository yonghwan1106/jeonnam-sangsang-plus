import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // 이메일 확인 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 성공: 대시보드로 리다이렉트
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // 에러 발생 또는 코드 없음: 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login`);
}
