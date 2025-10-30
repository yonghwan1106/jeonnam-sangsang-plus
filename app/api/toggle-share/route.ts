import { getCurrentUser } from '@/lib/auth';
import { ideas } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

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
    const idea = await ideas.findById(ideaId);

    if (!idea || idea.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Idea not found or unauthorized' },
        { status: 404 }
      );
    }

    // 공유 상태 업데이트
    const updatedIdea = await ideas.update(ideaId, { is_shared: isShared });

    if (!updatedIdea) {
      return NextResponse.json(
        { error: 'Failed to update idea' },
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
