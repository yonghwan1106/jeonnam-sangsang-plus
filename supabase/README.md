# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 정보를 입력합니다:
   - Name: `jeonnam-sangsang-plus`
   - Database Password: 안전한 비밀번호 생성
   - Region: `Northeast Asia (Seoul)`
4. "Create new project" 버튼을 클릭합니다.

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 "SQL Editor"로 이동합니다.
2. `migrations/01_initial_schema.sql` 파일의 내용을 복사하여 붙여넣습니다.
3. "Run" 버튼을 클릭하여 스키마를 생성합니다.

## 3. 환경 변수 설정

1. Supabase 대시보드에서 "Project Settings" > "API"로 이동합니다.
2. 다음 값들을 복사합니다:
   - Project URL
   - anon public key
   - service_role key (보안 주의!)

3. `.env.local` 파일을 수정합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## 4. 인증 설정

1. Supabase 대시보드에서 "Authentication" > "Providers"로 이동합니다.
2. "Email" 제공자가 활성화되어 있는지 확인합니다.
3. "Authentication" > "URL Configuration"에서:
   - Site URL: `http://localhost:3000` (개발 환경)
   - Redirect URLs: `http://localhost:3000/**` 추가

## 5. Row Level Security (RLS) 확인

데이터베이스 스키마에 이미 RLS 정책이 포함되어 있습니다.
"Database" > "Policies"에서 정책이 올바르게 생성되었는지 확인하세요.

## 테이블 구조

### profiles
- 사용자 프로필 정보 저장
- auth.users와 1:1 관계

### ideas
- AI가 생성한 정책 아이디어 저장
- 사용자별로 관리

## 주의사항

- `service_role key`는 절대 클라이언트 코드에 노출하지 마세요.
- RLS 정책이 올바르게 설정되어 있는지 확인하세요.
- 프로덕션 배포 시 Redirect URLs를 업데이트하세요.
