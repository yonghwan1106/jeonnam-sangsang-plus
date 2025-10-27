import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createDemoAccount() {
  const demoEmail = 'demo@jeonnam-sangsang.kr';
  const demoPassword = 'demo123456';
  const demoProfile = {
    full_name: '데모 사용자',
    department: '정책기획과',
    position: '체험 계정',
  };

  console.log('🚀 Creating demo account...');
  console.log(`📧 Email: ${demoEmail}`);

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users.some((user) => user.email === demoEmail);

    if (userExists) {
      console.log('✅ Demo account already exists');

      // Get user ID
      const user = existingUser?.users.find((u) => u.email === demoEmail);
      if (user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update(demoProfile)
          .eq('id', user.id);

        if (profileError) {
          console.error('⚠️  Profile update warning:', profileError.message);
        } else {
          console.log('✅ Profile updated successfully');
        }
      }

      return;
    }

    // Create new demo user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true, // Skip email verification for demo account
      user_metadata: demoProfile,
    });

    if (createError) {
      throw createError;
    }

    if (!newUser.user) {
      throw new Error('Failed to create user');
    }

    console.log('✅ Demo user created successfully');
    console.log(`👤 User ID: ${newUser.user.id}`);

    // Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        ...demoProfile,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('⚠️  Profile creation warning:', profileError.message);
    } else {
      console.log('✅ Profile created successfully');
    }

    // Create some sample ideas for the demo account
    console.log('📝 Creating sample ideas...');

    const sampleIdeas = [
      {
        user_id: newUser.user.id,
        title: '청년 귀농·귀촌 스마트팜 인큐베이팅 센터',
        content: '청년층의 귀농·귀촌을 촉진하기 위해 스마트팜 기술 교육과 창업 지원을 통합한 인큐베이팅 센터를 설립합니다. AI 기반 작물 관리, IoT 센서 활용, 데이터 분석 교육을 제공하며, 초기 정착 자금과 농지 임대를 지원합니다.',
        category: '인구감소대응',
        keywords: ['청년 귀농', '스마트팜', '창업 지원', 'AI 농업'],
        saved: true,
        is_shared: true,
        mode: 'general',
      },
      {
        user_id: newUser.user.id,
        title: '전남 그린수소 생산·활용 클러스터 조성',
        content: '신안 해상풍력과 연계하여 그린수소 생산 클러스터를 조성하고, 수소 기반 산업단지를 구축합니다. 수소 충전소 인프라를 확대하고, 수소 연료전지 제조 기업을 유치하여 미래 에너지 산업의 거점으로 육성합니다.',
        category: '신산업육성',
        keywords: ['그린수소', '해상풍력', '신재생에너지', '클러스터'],
        saved: true,
        is_shared: true,
        mode: 'general',
      },
      {
        user_id: newUser.user.id,
        title: '로컬크리에이터 육성 및 마케팅 지원 센터',
        content: '전남의 특산품과 문화를 알리는 로컬크리에이터를 육성하고, 콘텐츠 제작 스튜디오, 마케팅 교육, 라이브커머스 플랫폼을 지원합니다. 지역 소상공인과 매칭하여 온라인 판로를 개척하고 지역 경제를 활성화합니다.',
        category: '지역경제활성화',
        keywords: ['로컬크리에이터', '라이브커머스', '마케팅', '지역특산품'],
        saved: true,
        is_shared: false,
        mode: 'general',
      },
      {
        user_id: newUser.user.id,
        title: 'K-문화 체험형 관광 콘텐츠 개발',
        content: '한복 체험, 전통 음식 만들기, 판소리 공연 등 K-문화를 직접 체험할 수 있는 관광 프로그램을 개발합니다. AR/VR 기술을 활용한 역사 재현 콘텐츠와 외국인 맞춤형 투어를 제공하여 문화관광 수요를 창출합니다.',
        category: '문화관광진흥',
        keywords: ['K-문화', '체험관광', 'AR/VR', '외국인관광'],
        saved: false,
        is_shared: false,
        mode: 'creative',
      },
      {
        user_id: newUser.user.id,
        title: '스마트 양식장 IoT 통합 관리 시스템',
        content: '전남 수산업의 경쟁력 강화를 위해 IoT 센서 기반 스마트 양식장 관리 시스템을 도입합니다. 수온, 산소량, 먹이 공급을 자동화하고, AI가 최적의 양식 환경을 추천하여 생산성을 향상시킵니다.',
        category: '농축수산혁신',
        keywords: ['스마트 양식', 'IoT', 'AI', '수산업'],
        saved: true,
        is_shared: true,
        mode: 'general',
      },
    ];

    const { error: ideasError } = await supabase
      .from('ideas')
      .insert(sampleIdeas);

    if (ideasError) {
      console.error('⚠️  Sample ideas creation warning:', ideasError.message);
    } else {
      console.log(`✅ Created ${sampleIdeas.length} sample ideas`);
    }

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

createDemoAccount();
