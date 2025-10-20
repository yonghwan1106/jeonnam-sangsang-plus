# 상상 더하기+ | 전남형 AI 정책 발굴 플랫폼

**2025년 전라남도 정책 아이디어 공모전 출품작**

데이터와 AI의 창의성으로 전라남도의 정책 혁신을 가속화하는 핵심 의사결정 지원 플랫폼

## 프로젝트 개요

**상상 더하기+**는 Claude AI를 활용하여 전라남도의 혁신적인 정책 아이디어를 발굴하는 플랫폼입니다. '버벌라이즈드 샘플링' 원리를 적용하여 저확률·고잠재력 아이디어를 생성하고, 정책 담당자들이 효율적으로 아이디어를 관리할 수 있도록 지원합니다.

### 공모전 정보
- **공모전명**: 2025년 전라남도 정책 아이디어 공모전
- **출품 분야**: 디지털 행정 혁신
- **프로젝트 목표**: AI 기술을 활용한 정책 발굴 프로세스 혁신

## 주요 기능

### MVP (Phase 1) 구현 완료

- ✅ **사용자 인증**: 이메일/비밀번호 기반 회원가입 및 로그인
- ✅ **AI 아이디어 생성**: Claude API를 활용한 정책 아이디어 자동 생성
  - **일반 탐색 모드**: 실현 가능성이 높은 아이디어
  - **창의 탐색 모드**: 독창적이고 혁신적인 아이디어 (창의성 수준 조절 가능)
- ✅ **아이디어 관리**: 생성된 아이디어 저장 및 조회
- ✅ **정책 분야**: 5개 분야 지원 (인구감소대응, 신산업육성, 지역경제활성화, 문화관광진흥, 농축수산혁신)

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude 4 Sonnet API
- **Deployment**: Vercel

## 시작하기

### 1. 사전 요구사항

- Node.js 18+ 
- npm 또는 yarn
- Supabase 계정
- Anthropic API 키

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/01_initial_schema.sql` 실행
3. 프로젝트 URL 및 API 키 복사

자세한 설정 방법은 [supabase/README.md](./supabase/README.md) 참조

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 애플리케이션 확인

## 프로젝트 구조

```
jeonnam-sangsang-plus/
├── app/
│   ├── api/
│   │   ├── generate-ideas/    # AI 아이디어 생성 API
│   │   └── save-idea/          # 아이디어 저장 API
│   ├── auth/logout/            # 로그아웃 라우트
│   ├── dashboard/              # 대시보드 페이지
│   ├── generate/               # 아이디어 생성 페이지
│   ├── login/                  # 로그인 페이지
│   ├── my-ideas/               # 저장된 아이디어 페이지
│   ├── signup/                 # 회원가입 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 메인 페이지
├── components/                 # 재사용 가능한 컴포넌트
├── lib/                        # 라이브러리 설정
├── types/                      # TypeScript 타입 정의
├── utils/                      # 유틸리티 함수
│   └── supabase/               # Supabase 클라이언트
├── supabase/                   # Supabase 마이그레이션
├── docs/                       # 문서
│   └── prd.md                  # 제품 요구사항 문서
├── middleware.ts               # Next.js 미들웨어
└── README.md
```

## Vercel 배포

### 1. GitHub 저장소 연결

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel에서 프로젝트 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
5. "Deploy" 클릭

### 3. Supabase Redirect URLs 업데이트

Supabase 대시보드 → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

## 향후 계획

### Phase 2: 협업 기능 강화 (예정)
- 아이디어 공유 기능
- 평가 및 댓글 시스템
- 팀 협업 도구
- 검색 및 필터링 고도화

### Phase 3: 인사이트 및 고도화 (예정)
- 통계 대시보드
- 워드 클라우드 시각화
- Naver Maps API 연동
- 실시간 알림

## 기대 효과

1. **정책 발굴 효율성 향상**: AI를 활용하여 정책 아이디어 생성 시간을 90% 단축
2. **창의성 증대**: 버벌라이즈드 샘플링을 통해 기존에 발견하지 못한 혁신적 아이디어 발굴
3. **비용 절감**: 외부 연구용역 및 전문가 자문 비용 절감
4. **지속적 혁신**: 언제든지 새로운 정책 아이디어를 생성하고 관리할 수 있는 시스템 구축

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 기여

기여는 언제나 환영합니다! Issue나 Pull Request를 자유롭게 제출해주세요.

## 문의

프로젝트 관련 문의사항이 있으시면 Issue를 등록해주세요.

---

**2025년 전라남도 정책 아이디어 공모전 출품작**  
*"OK! 지금은 전남시대"를 실현하는 AI 기반 정책 혁신 플랫폼*
