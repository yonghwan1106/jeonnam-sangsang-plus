import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { ideaId, isShared } = await request.json();

    if (!ideaId) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      );
    }

    // 아이디어가 현재 사용자의 것인지 확인
    const { data: idea, error: fetchError } = await supabase
      .from('ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !idea) {
      return NextResponse.json(
        { error: 'Idea not found or unauthorized' },
        { status: 404 }
      );
    }

    // 공유 상태 업데이트
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ is_shared: isShared })
      .eq('id', ideaId)
      .eq('user_id', user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling share:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
