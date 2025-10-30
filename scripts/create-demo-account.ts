#!/usr/bin/env tsx
import { users, ideas } from '../lib/google-sheets';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function createDemoAccount() {
  const demoEmail = 'demo@jeonnam-sangsang.kr';
  const demoPassword = 'demo123456';

  console.log('🚀 Creating demo account...');
  console.log(`📧 Email: ${demoEmail}`);

  try {
    // Check if user already exists
    const existingUser = await users.findByEmail(demoEmail);

    if (existingUser) {
      console.log('✅ Demo account already exists');
      console.log(`👤 User ID: ${existingUser.id}`);

      // Create some sample ideas if they don't exist
      const userIdeas = await ideas.findByUserId(existingUser.id);
      if (userIdeas.length === 0) {
        console.log('📝 Creating sample ideas...');
        await createSampleIdeas(existingUser.id);
      } else {
        console.log(`✅ Demo account has ${userIdeas.length} existing ideas`);
      }

      console.log('\n🎉 Demo account is ready!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', demoEmail);
      console.log('🔑 Password:', demoPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return;
    }

    // Create new demo user
    const newUser = await users.create(demoEmail, demoPassword);

    console.log('✅ Demo user created successfully');
    console.log(`👤 User ID: ${newUser.id}`);

    // Create sample ideas
    console.log('📝 Creating sample ideas...');
    await createSampleIdeas(newUser.id);

    console.log('\n🎉 Demo account setup complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', demoEmail);
    console.log('🔑 Password:', demoPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Users can now click "데모 계정으로 체험하기" to login');
  } catch (error) {
    console.error('❌ Error creating demo account:', error);
    process.exit(1);
  }
}

async function createSampleIdeas(userId: string) {
  const sampleIdeas = [
    {
      user_id: userId,
      title: '청년 귀농·귀촌 스마트팜 인큐베이팅 센터',
      content: '청년층의 귀농·귀촌을 촉진하기 위해 스마트팜 기술 교육과 창업 지원을 통합한 인큐베이팅 센터를 설립합니다. AI 기반 작물 관리, IoT 센서 활용, 데이터 분석 교육을 제공하며, 초기 정착 자금과 농지 임대를 지원합니다.',
      category: '인구감소대응',
      keywords: ['청년 귀농', '스마트팜', '창업 지원', 'AI 농업'],
      saved: true,
      is_shared: true,
      mode: 'general' as const,
    },
    {
      user_id: userId,
      title: '전남 그린수소 생산·활용 클러스터 조성',
      content: '신안 해상풍력과 연계하여 그린수소 생산 클러스터를 조성하고, 수소 기반 산업단지를 구축합니다. 수소 충전소 인프라를 확대하고, 수소 연료전지 제조 기업을 유치하여 미래 에너지 산업의 거점으로 육성합니다.',
      category: '신산업육성',
      keywords: ['그린수소', '해상풍력', '신재생에너지', '클러스터'],
      saved: true,
      is_shared: true,
      mode: 'general' as const,
    },
    {
      user_id: userId,
      title: '로컬크리에이터 육성 및 마케팅 지원 센터',
      content: '전남의 특산품과 문화를 알리는 로컬크리에이터를 육성하고, 콘텐츠 제작 스튜디오, 마케팅 교육, 라이브커머스 플랫폼을 지원합니다. 지역 소상공인과 매칭하여 온라인 판로를 개척하고 지역 경제를 활성화합니다.',
      category: '지역경제활성화',
      keywords: ['로컬크리에이터', '라이브커머스', '마케팅', '지역특산품'],
      saved: true,
      is_shared: false,
      mode: 'general' as const,
    },
    {
      user_id: userId,
      title: 'K-문화 체험형 관광 콘텐츠 개발',
      content: '한복 체험, 전통 음식 만들기, 판소리 공연 등 K-문화를 직접 체험할 수 있는 관광 프로그램을 개발합니다. AR/VR 기술을 활용한 역사 재현 콘텐츠와 외국인 맞춤형 투어를 제공하여 문화관광 수요를 창출합니다.',
      category: '문화관광진흥',
      keywords: ['K-문화', '체험관광', 'AR/VR', '외국인관광'],
      saved: false,
      is_shared: false,
      mode: 'creative' as const,
    },
    {
      user_id: userId,
      title: '스마트 양식장 IoT 통합 관리 시스템',
      content: '전남 수산업의 경쟁력 강화를 위해 IoT 센서 기반 스마트 양식장 관리 시스템을 도입합니다. 수온, 산소량, 먹이 공급을 자동화하고, AI가 최적의 양식 환경을 추천하여 생산성을 향상시킵니다.',
      category: '농축수산혁신',
      keywords: ['스마트 양식', 'IoT', 'AI', '수산업'],
      saved: true,
      is_shared: true,
      mode: 'general' as const,
    },
  ];

  for (const idea of sampleIdeas) {
    await ideas.create(idea);
  }

  console.log(`✅ Created ${sampleIdeas.length} sample ideas`);
}

createDemoAccount();
