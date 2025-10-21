# 배포 가이드

## 🚀 자동 배포 (권장)

### Production 배포
```bash
# 1. main 브랜치에서 작업
git checkout main

# 2. 변경사항 커밋
git add .
git commit -m "메시지"

# 3. GitHub에 푸시 (자동으로 Vercel이 배포)
git push origin main
```

**주의**: `vercel --prod` 명령어를 사용하지 마세요. GitHub 푸시만으로 자동 배포됩니다.

## 📋 브랜치 전략

- **main**: Production 브랜치 (자동 배포 활성화)
- **master**: 사용 안 함 (자동 배포 비활성화)

## ⚙️ Vercel 설정

`vercel.json`:
- main 브랜치만 자동 배포
- master 브랜치는 배포 비활성화

## 🔍 배포 확인

1. GitHub에 푸시
2. Vercel 대시보드에서 단일 배포 확인
3. 빌드 완료 대기 (1-2분)
4. Production URL 확인: https://jeonnam-sangsang-plus.vercel.app
