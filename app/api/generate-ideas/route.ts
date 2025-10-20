import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/utils/supabase/server';

interface Idea {
  title: string;
  content: string;
  keywords: string[];
  probability?: number;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    const { category, problemStatement, mode, creativityLevel } = await request.json();

    if (!category || !problemStatement || !mode) {
      return NextResponse.json(
        { error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 프롬프트 생성
    let systemPrompt = `당신은 전라남도의 정책 전문가이자 혁신적인 아이디어 발굴가입니다.
주어진 정책 분야와 문제 상황에 대해 창의적이고 실현 가능한 정책 아이디어를 제안해주세요.

각 아이디어는 다음 형식의 JSON 배열로 제공해주세요:
[
  {
    "title": "아이디어 제목",
    "content": "구체적인 설명 (200-300자)",
    "keywords": ["키워드1", "키워드2", "키워드3"]
  }
]

정확히 5개의 아이디어를 생성해주세요.`;

    const userPrompt = `정책 분야: ${category}

문제 상황:
${problemStatement}`;

    if (mode === 'creative') {
      systemPrompt += `\n\n**창의 탐색 모드**: 일반적이지 않고 독창적이며 혁신적인 아이디어를 생성해주세요.
기존의 틀을 벗어나 참신하고 파격적인 접근을 시도하되, 완전히 비현실적이지는 않도록 해주세요.
창의성 수준: ${creativityLevel}% (낮을수록 더 독창적)`;
    } else {
      systemPrompt += `\n\n**일반 탐색 모드**: 실현 가능성이 높고 검증된 접근법을 활용한 아이디어를 생성해주세요.
기존 정책 사례나 성공 모델을 참고하여 안정적이고 효과적인 제안을 해주세요.`;
    }

    // Claude API 호출
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: mode === 'creative' ? 1.0 : 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // 응답 파싱
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // JSON 추출 (코드 블록이 있을 경우 제거)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    let ideas = JSON.parse(jsonMatch[0]);

    // 창의 모드일 경우 확률 추가
    if (mode === 'creative') {
      ideas = ideas.map((idea: Idea) => ({
        ...idea,
        probability: creativityLevel,
      }));
    }

    return NextResponse.json({ ideas });
  } catch (error: unknown) {
    console.error('Error generating ideas:', error);
    const errorMessage = error instanceof Error ? error.message : '아이디어 생성 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
