# 배포 가이드

이 문서는 두 Next.js 앱의 배포 경계, 현재 확인된 운영 상태, Vercel에서 사용자가 완료해야 하는 설정을 기록합니다.

## 확인된 상태

2026-08-12에 DNS와 HTTP 응답을 직접 확인한 결과입니다.

| 호스트 | 상태 | 확인 결과 |
| --- | --- | --- |
| `naketing.co.kr` | 운영 중 | HTTPS 요청이 `www.naketing.co.kr`로 307 redirect |
| `www.naketing.co.kr` | 운영 중 | HTTP 200, `Server: Vercel`, Next.js 정적 prerender 응답 |
| `dev.naketing.co.kr` | 미연결 | DNS 이름이 존재하지 않음 |

저장소에는 자동 배포 workflow, `vercel.json`, 활성 `CNAME`이 없습니다. 기존 Naketing 앱의 Vercel 프로젝트 설정과 Git 자동 배포 연결 여부는 Vercel 계정 권한 없이는 확인할 수 없습니다.

## 배포 단위

같은 Git 저장소를 사용하지만 Vercel Project는 앱별로 분리합니다.

| Vercel Project | Root Directory | Build Command | 저장소 build 결과 |
| --- | --- | --- | --- |
| 기존 Naketing | `frontend` | `npm run build` | Next.js production build |
| Developer Site | `developer-site` | `npm run build` | `out` 정적 export |

루트 workspace를 사용하지 않으므로 저장소 루트에서 두 앱을 하나의 build 명령으로 묶지 않습니다.

## Developer Site 연결 절차

Vercel 공식 monorepo 방식에 따라 같은 Git 저장소를 새 Project로 한 번 더 import하고 앱 디렉터리를 Root Directory로 지정합니다.

1. Vercel Dashboard에서 현재 GitHub 저장소를 새 Project로 import합니다.
2. Root Directory를 `developer-site`로 지정합니다.
3. Framework Preset은 Next.js 자동 감지를 사용합니다.
4. Node.js는 로컬과 CI 기준인 22를 사용합니다.
5. Install Command와 Output Directory는 먼저 Next.js 기본값을 사용하고 임의 override하지 않습니다.
6. 첫 배포에서 `/`, `/blog/`, `/tools/`, `/tools/timestamp-converter/`, `/sitemap.xml`, `/robots.txt`를 확인합니다.
7. Project의 Settings → Domains에서 `dev.naketing.co.kr`을 추가합니다.
8. Vercel 화면이 제시하는 CNAME 값을 실제 DNS 관리 화면에 등록합니다. CNAME 대상은 추측하거나 문서에 고정하지 않습니다.
9. Vercel에서 도메인 검증과 SSL 발급이 끝난 뒤 실제 HTTPS 응답을 확인합니다.

`NEXT_PUBLIC_SITE_URL`의 코드 기본값은 `https://dev.naketing.co.kr`입니다. 다른 공개 origin으로 배포할 때만 해당 환경의 build 변수로 override합니다.

## 저장소에 추가하지 않는 설정

현재 요구사항에는 별도 rewrite, redirect, header, serverless function이 없습니다. 따라서 다음 설정은 실제 필요가 생기기 전까지 추가하지 않습니다.

- 루트 workspace 또는 monorepo 도구
- 앱을 연결하기 위한 `vercel.json`
- GitHub Actions 기반 중복 배포 workflow
- 추측한 Vercel Project ID나 DNS CNAME 값
- Vercel 인증 token

Vercel Dashboard의 Root Directory와 Domain 설정만으로 해결되는 항목을 저장소 설정 파일로 중복 관리하지 않습니다.

## 배포 후 검증

PowerShell에서 다음 순서로 확인합니다.

```powershell
Resolve-DnsName dev.naketing.co.kr
curl.exe -I https://dev.naketing.co.kr
curl.exe -I https://dev.naketing.co.kr/tools/timestamp-converter/
Invoke-WebRequest -UseBasicParsing https://dev.naketing.co.kr/sitemap.xml
Invoke-WebRequest -UseBasicParsing https://dev.naketing.co.kr/robots.txt
```

완료 기준은 다음과 같습니다.

- DNS가 Vercel에서 안내한 대상으로 해석됩니다.
- HTTPS가 유효한 인증서로 200 응답을 반환합니다.
- 정적 route를 직접 새로고침해도 404가 발생하지 않습니다.
- sitemap과 robots의 origin 및 trailing slash가 실제 도메인과 일치합니다.
- Git push 후 Developer Site Project에 새 production deployment가 생성됩니다.
- 배포가 확인된 뒤 Search Console 등록과 sitemap 제출을 진행합니다.

## 배포 실패 대응

Vercel은 알려진 중대 취약점이 있는 Next.js 버전의 신규 배포를 차단할 수 있습니다. Deploy Logs에 취약 버전 경고가 나오면 Vercel 설정을 우회하지 않고 다음 순서로 처리합니다.

1. Next.js 공식 보안 권고에서 현재 패치 버전을 확인합니다.
2. `next`와 `eslint-config-next`를 같은 버전으로 갱신합니다.
3. `package-lock.json`을 함께 커밋합니다.
4. 두 앱의 lint와 production build를 실행합니다.
5. 검증된 커밋을 push해 Vercel 자동 재배포를 확인합니다.

`npm audit fix --force`로 의존성을 일괄 변경하거나 Vercel의 보안 차단을 우회하지 않습니다.

## 외부 설정 변경 원칙

Vercel Project 생성, custom domain 연결, DNS 변경은 계정과 운영 트래픽에 영향을 주는 외부 작업입니다. Codex는 사용자 승인과 해당 계정 접근 수단 없이 완료됐다고 표현하지 않습니다.
