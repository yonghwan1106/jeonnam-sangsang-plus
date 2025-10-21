import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface SaveIdeaRequest {
  title: string;
  content: string;
  keywords?: string[];
  category: string;
  mode: 'general' | 'creative';
  probability?: number;
}

export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 요청 데이터 파싱
    const { title, content, keywords, category, mode, probability } = await request.json() as SaveIdeaRequest;

    if (!title || !content || !category || !mode) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스에 저장
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user.id,
        title,
        content,
        category,
        mode,
        probability: probability || null,
        keywords: keywords || [],
        saved: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, idea: data });
  } catch (error: unknown) {
    console.error('Error saving idea:', error);
    const errorMessage = error instanceof Error ? error.message : '아이디어 저장 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
