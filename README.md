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
- ✅ **아이디어 공유**: 다른 사용자와 아이디어 공유 기능
- ✅ **정책 분야**: 5개 분야 지원 (인구감소대응, 신산업육성, 지역경제활성화, 문화관광진흥, 농축수산혁신)

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Authentication**: Custom cookie-based session management
- **AI**: Anthropic Claude 4 Sonnet API
- **Deployment**: Vercel

## 시작하기

### 1. 사전 요구사항

- Node.js 18+ 
- npm 또는 yarn
- Google Cloud 프로젝트 (Google Sheets API 활성화)
- Anthropic API 키

### 2. Google Sheets 설정

자세한 설정 가이드는 [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)를 참조하세요.

**간단 요약:**

1. Google Cloud Console에서 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 및 JSON 키 다운로드
4. Google Sheets에 새 스프레드시트 생성
5. 서비스 계정에 스프레드시트 편집 권한 부여

### 3. 프로젝트 설정

```bash
# 저장소 클론
git clone <repository-url>
cd jeonnam-sangsang-plus

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 다음 값들을 입력:
# - ANTHROPIC_API_KEY: Anthropic API 키
# - GOOGLE_SHEETS_CREDENTIALS: 서비스 계정 JSON (한 줄로)
# - GOOGLE_SHEETS_SPREADSHEET_ID: 스프레드시트 ID
```

### 4. 데이터베이스 초기화

```bash
# Google Sheets에 헤더 생성
npm run init-sheets

# 데모 계정 생성 (선택사항)
npm run setup-demo
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 애플리케이션을 확인하세요.

### 6. 데모 계정 로그인

데모 계정을 생성한 경우:
- 이메일: `demo@jeonnam-sangsang.kr`
- 비밀번호: `demo123456`

또는 로그인 페이지에서 "데모 계정으로 체험하기" 버튼을 클릭하세요.

## 프로젝트 구조

```
jeonnam-sangsang-plus/
├── app/                    # Next.js 앱 디렉토리
│   ├── api/               # API 라우트
│   │   ├── auth/         # 인증 API
│   │   ├── generate-ideas/ # AI 아이디어 생성
│   │   ├── save-idea/    # 아이디어 저장
│   │   └── toggle-share/ # 공유 설정
│   ├── dashboard/        # 대시보드 페이지
│   ├── generate/         # 아이디어 생성 페이지
│   ├── my-ideas/         # 내 아이디어 페이지
│   ├── shared-ideas/     # 공유된 아이디어 페이지
│   ├── login/            # 로그인 페이지
│   └── signup/           # 회원가입 페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 라이브러리
│   ├── auth.ts           # 인증 관리
│   └── google-sheets.ts  # Google Sheets API
├── docs/                  # 문서
│   └── GOOGLE_SHEETS_SETUP.md
├── scripts/               # 유틸리티 스크립트
│   ├── init-sheets.ts    # 시트 초기화
│   └── create-demo-account.ts
└── middleware.ts          # Next.js 미들웨어
```

## 주요 기능 사용법

### 1. 회원가입 및 로그인

1. 홈페이지에서 "시작하기" 클릭
2. 이메일과 비밀번호로 회원가입
3. 자동으로 로그인되어 대시보드로 이동

### 2. AI 아이디어 생성

1. 대시보드에서 "아이디어 생성" 클릭
2. 정책 분야 선택 (5개 중 택 1)
3. 문제 상황 또는 정책 목표 입력
4. 탐색 모드 선택:
   - **일반 탐색**: 실현 가능성 높은 검증된 아이디어
   - **창의 탐색**: 독창적이고 혁신적인 아이디어 (확률 레벨 조정 가능)
5. "아이디어 생성" 버튼 클릭
6. 5개의 아이디어가 자동으로 생성됨

### 3. 아이디어 관리

- **저장**: 생성된 아이디어 중 마음에 드는 것을 클릭하여 저장
- **조회**: "내 아이디어" 메뉴에서 저장된 아이디어 확인
- **공유**: 아이디어 카드의 공유 토글로 다른 사용자와 공유 가능
- **공유 목록**: "공유 아이디어" 메뉴에서 다른 사용자의 아이디어 확인

## 배포 (Vercel)

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...전체 JSON...}
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
NODE_ENV=production
```

### 배포 명령어

```bash
# Vercel CLI로 배포
vercel --prod

# 또는 Git 푸시로 자동 배포
git push origin main
```

## 개발 가이드

### 스크립트 명령어

```bash
npm run dev         # 개발 서버 실행
npm run build       # 프로덕션 빌드
npm start           # 프로덕션 서버 실행
npm run lint        # ESLint 실행
npm run init-sheets # Google Sheets 초기화
npm run setup-demo  # 데모 계정 생성
```

### 코드 구조

- **lib/google-sheets.ts**: Google Sheets API 래퍼
  - `users`: 사용자 관리 함수
  - `ideas`: 아이디어 관리 함수
- **lib/auth.ts**: 인증 및 세션 관리
  - `signUp`, `signIn`, `signOut`
  - `getCurrentUser`, `getSession`

## 문제 해결

일반적인 문제와 해결 방법은 [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)의 "문제 해결" 섹션을 참조하세요.

## 라이선스

Private - 전라남도 정책 아이디어 공모전 출품작

## 팀 소개

**상상 더하기+ 팀**

전라남도의 정책 혁신을 위해 AI 기술을 활용한 플랫폼을 개발하고 있습니다.

## 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
