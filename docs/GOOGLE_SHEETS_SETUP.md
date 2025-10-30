# Google Sheets 설정 가이드

이 프로젝트는 Supabase 대신 Google Sheets를 데이터베이스로 사용합니다.

## 1. Google Cloud 프로젝트 설정

### 1.1 Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: `jeonnam-sangsang-plus` (또는 원하는 이름)

### 1.2 Google Sheets API 활성화

1. 좌측 메뉴에서 **APIs & Services** > **Library** 선택
2. "Google Sheets API" 검색
3. **Enable** 버튼 클릭

### 1.3 서비스 계정 생성

1. **APIs & Services** > **Credentials** 이동
2. **+ CREATE CREDENTIALS** > **Service Account** 선택
3. 서비스 계정 세부정보 입력:
   - Name: `jeonnam-sangsang-sheets`
   - Description: `Service account for Google Sheets database`
4. **Create and Continue** 클릭
5. 역할(Role) 선택: **Editor** 권한 부여
6. **Done** 클릭

### 1.4 서비스 계정 키 생성

1. 생성된 서비스 계정 클릭
2. **Keys** 탭 선택
3. **Add Key** > **Create new key** 클릭
4. **Key type**: JSON 선택
5. **Create** 클릭하면 JSON 파일이 다운로드됩니다
   - 이 파일을 안전하게 보관하세요!
   - 절대 GitHub에 커밋하지 마세요!

## 2. Google Sheets 스프레드시트 설정

### 2.1 새 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com/) 접속
2. 새 스프레드시트 생성
3. 스프레드시트 이름: `전남형 AI 정책 발굴 플랫폼`

### 2.2 시트 구조 설정

#### Users 시트 생성

1. 첫 번째 시트 이름을 `Users`로 변경
2. 헤더 행(A1:D1)에 다음 입력:
   - A1: `ID`
   - B1: `Email`
   - C1: `Password`
   - D1: `Created At`

#### Ideas 시트 생성

1. 새 시트 추가 (+ 버튼 클릭)
2. 시트 이름을 `Ideas`로 변경
3. 헤더 행(A1:K1)에 다음 입력:
   - A1: `ID`
   - B1: `User ID`
   - C1: `Title`
   - D1: `Content`
   - E1: `Category`
   - F1: `Mode`
   - G1: `Probability`
   - H1: `Keywords`
   - I1: `Saved`
   - J1: `Is Shared`
   - K1: `Created At`

### 2.3 서비스 계정에 권한 부여

1. 스프레드시트 우측 상단 **공유** 버튼 클릭
2. 다운로드한 JSON 파일에서 `client_email` 값 복사
   - 예: `jeonnam-sangsang-sheets@your-project.iam.gserviceaccount.com`
3. 이메일 주소를 공유 대화상자에 입력
4. 권한: **편집자** 선택
5. **보내기** 클릭 (알림 메일 보내지 않음)

### 2.4 스프레드시트 ID 복사

브라우저 URL에서 스프레드시트 ID를 복사합니다:
```
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
                                      ^^^^^^^^^^^^^^^^^^^^
                                      이 부분이 Spreadsheet ID
```

## 3. 환경 변수 설정

### 3.1 .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# Anthropic API Key (기존 값 유지)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google Sheets API 설정
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...전체 JSON 내용..."}
GOOGLE_SHEETS_SPREADSHEET_ID=복사한_스프레드시트_ID

# Node environment
NODE_ENV=development
```

### 3.2 서비스 계정 JSON 포맷

`GOOGLE_SHEETS_CREDENTIALS`에는 다운로드한 JSON 파일의 전체 내용을 한 줄로 입력해야 합니다:

**올바른 예시:**
```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n","client_email":"example@my-project.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/example%40my-project.iam.gserviceaccount.com"}
```

**중요 사항:**
- JSON의 모든 줄바꿈을 제거하고 한 줄로 만들어야 합니다
- `private_key` 내부의 `\n`은 유지해야 합니다
- 작은따옴표(')가 아닌 큰따옴표(")를 사용해야 합니다

## 4. 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 5. 시트 초기화 (선택사항)

시트에 헤더가 없거나 재설정이 필요한 경우:

```bash
npm run init-sheets
```

이 명령어는 Users와 Ideas 시트에 헤더 행을 자동으로 생성합니다.

## 6. 문제 해결

### 401 Unauthorized 오류

- 서비스 계정 이메일이 스프레드시트에 공유되어 있는지 확인
- `GOOGLE_SHEETS_CREDENTIALS`의 JSON 형식이 올바른지 확인
- Google Sheets API가 활성화되어 있는지 확인

### 403 Forbidden 오류

- 서비스 계정에 **편집자** 권한이 부여되어 있는지 확인
- 스프레드시트가 삭제되지 않았는지 확인

### Invalid credentials 오류

- `GOOGLE_SHEETS_CREDENTIALS`의 `private_key`에 `\n`이 포함되어 있는지 확인
- JSON 파일을 다시 다운로드하여 사용

### Spreadsheet not found 오류

- `GOOGLE_SHEETS_SPREADSHEET_ID`가 올바른지 확인
- 스프레드시트 URL에서 ID를 정확히 복사했는지 확인

## 7. 보안 주의사항

1. **절대 GitHub에 커밋하지 마세요:**
   - `.env.local` 파일
   - 서비스 계정 JSON 파일

2. **`.gitignore`에 추가되어 있는지 확인:**
   ```
   .env.local
   *.json
   ```

3. **Vercel에 배포 시:**
   - Vercel 대시보드에서 환경 변수를 설정
   - `GOOGLE_SHEETS_CREDENTIALS`는 전체 JSON을 복사하여 붙여넣기
   - 모든 환경(Production, Preview, Development)에 적용

## 8. 데모 계정 생성

애플리케이션을 테스트하기 위해 데모 계정을 생성할 수 있습니다:

```bash
npm run setup-demo
```

이 명령어는 다음 데모 계정을 생성합니다:
- 이메일: `demo@jeonnam.go.kr`
- 비밀번호: `demo1234`

## 9. 추가 참고 자료

- [Google Sheets API 문서](https://developers.google.com/sheets/api/guides/concepts)
- [Service Account 인증 가이드](https://cloud.google.com/iam/docs/service-accounts)
- [googleapis Node.js 클라이언트](https://github.com/googleapis/google-api-nodejs-client)
