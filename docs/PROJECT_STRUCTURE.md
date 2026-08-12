# 프로젝트 구조

## 개요

`naketing` 저장소는 두 개의 독립 Next.js 앱을 같은 Git 저장소에서 관리합니다.

```text
naketing/
├─ .github/workflows/       # GitHub Actions CI
├─ frontend/                 # 기존 naketing.co.kr 서비스
│  ├─ app/                   # App Router 페이지와 공통 layout
│  ├─ components/            # 자기소개 프로그램, Guide와 Tool 화면 컴포넌트
│  ├─ content/guides/         # 빌드 입력용 말하기 Guide Markdown
│  ├─ lib/                   # 자기소개 규칙, Guide 파싱, Tool·사이트 정적 데이터
│  ├─ public/
│  ├─ scripts/                # 심사 전 자동 검증 스크립트
│  ├─ package.json
│  └─ next.config.ts
├─ developer-site/           # dev.naketing.co.kr 개발자 사이트
│  ├─ app/                   # 페이지, metadata, sitemap, robots
│  ├─ components/            # 공통 UI와 브라우저 도구
│  ├─ content/blog/          # 빌드 입력용 Markdown 게시물
│  ├─ lib/                   # Blog 파싱, 사이트와 Tool 정의
│  ├─ package.json
│  └─ next.config.ts
├─ docs/                     # 프로젝트 중앙 문서
├─ AGENTS.md                 # Codex 프로젝트 지침
└─ README.md                 # 빠른 시작과 문서 진입점
```

루트 workspace, Turborepo, Nx는 사용하지 않습니다. 각 앱은 자체 `package.json`과 `package-lock.json`을 가지며 독립적으로 의존성을 설치하고 빌드합니다.

## 기술 스택

2026-08-12 기준 두 앱은 다음 버전을 사용합니다.

- Next.js 16.3.0
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Next.js App Router

정확한 현재 버전은 다음 파일을 우선합니다.

- `frontend/package.json`
- `developer-site/package.json`

현재 저장소에는 Backend, DB, Java, Spring Boot, Thymeleaf, jQuery, ag-Grid, Vite가 없습니다.

## `frontend`

### 책임

`naketing.co.kr`의 말하기·자기소개 서비스를 제공합니다.

- 브라우저 기반 3단계 자기소개 작성·점검 프로그램
- 점검 기준과 한계를 공개하는 Methodology
- Markdown 기반 원본 Guide 10개
- 브라우저 기반 무료 Tool 2개
- 개인정보 처리방침과 문의 경로
- canonical, sitemap, robots, Open Graph·Twitter 이미지와 구조화 데이터
- 환경변수 기반 AdSense 사이트 심사 스크립트 경계

### 현재 route

- `/`
- `/program`
- `/methodology`
- `/privacy`
- `/contact`
- `/guides`
- `/guides/[slug]`
- `/tools`
- `/tools/[tool]`

Header의 주요 메뉴는 `/program`, `/guides`, `/tools` 3개입니다. `/methodology`, `/privacy`, `/contact`는 Footer의 참고 및 운영 링크로 연결합니다.

### 자기소개 점검 데이터 흐름

`/program`의 화면 상태와 입력 이벤트는 `components/introduction-program.tsx`에서 관리합니다. 계산과 판정은 화면에서 분리된 순수 함수로 처리합니다.

| 계층 | 책임 |
| --- | --- |
| `components/introduction-program.tsx` | 목적 선택, 질문별 작성 도우미, 단계 이동, 첫 점검 기준선과 포커스 관리 |
| `components/introduction-program-result.tsx` | 점검 결과, 근거 문장, 수정 순서, 첫 결과 대비 변화와 복사 UI |
| `lib/speech-time.ts` | 글자 수, 단어 수, 발화 시간과 목표 분량 판정 |
| `lib/introduction-draft.ts` | 사용자가 답한 문장을 순서대로 결합하고 기존 원고 덮어쓰기 방지 |
| `lib/introduction-analysis.ts` | 후보 표현, 반복 단어, 긴 문장과 네 가지 구조 단서 점검 |
| `lib/introduction-comparison.ts` | 첫 점검과 현재 결과의 수치·구조 변화 계산 |

원고, 질문 답변과 첫 점검 기준선은 React 상태와 브라우저 메모리에만 존재합니다. 서버, 외부 API, local storage와 DB로 전송하거나 저장하지 않습니다. 페이지를 새로 열거나 프로그램을 처음부터 다시 시작하면 비교 기준선도 사라집니다.

### 렌더링과 빌드

- App Router를 사용합니다.
- 현재 페이지는 build 시 정적으로 prerender됩니다.
- root metadata 이미지 route가 Open Graph와 Twitter용 PNG를 생성합니다.
- Guide 상세 경로는 `generateStaticParams`로 build 시 생성하며 정의되지 않은 slug는 404로 처리합니다.
- Tool 상세 경로는 정적 Tool 정의와 `generateStaticParams`를 이용해 build 시 생성합니다.
- `frontend/next.config.ts`에는 `output: "export"`가 없습니다.
- 결과는 일반 Next.js production build이며 `developer-site/out`과 같은 독립 정적 export 계약을 갖지 않습니다.

### SEO origin

`frontend`의 canonical, sitemap과 robots 기본 origin은 운영에서 응답하는 `https://www.naketing.co.kr`입니다. 다른 공개 origin에서 build할 때만 `NEXT_PUBLIC_SITE_URL`로 override합니다. 이 값은 비밀값이 아니며 build 결과에 공개됩니다.

### AdSense 환경변수

`NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID`는 AdSense 사이트 심사 스크립트에 공개되는 publisher ID입니다. 값이 없으면 스크립트를 렌더링하지 않으며, 값이 있으면 root layout에서 모든 공개 route의 HTML `<head>`에 한 번만 주입합니다. 실제 계정 값은 저장소에 커밋하지 않고 `frontend` Vercel Project의 환경변수로 관리합니다. 형식과 로컬 변수 목록은 `frontend/.env.example`을 따릅니다.

## `developer-site`

### 책임

개발자 이정근의 개인 사이트를 제공합니다.

- 개발자 소개
- Markdown 기반 Blog
- 브라우저 기반 무료 개발자 Tools
- Projects
- About
- 검색 노출을 위한 metadata, sitemap, robots
- 광고 없는 개발자 포트폴리오 운영

현재 코드의 `AdSlot`은 광고 요청을 만들지 않는 빈 placeholder입니다. 광고 수익화 대상은 Developer Site가 아니라 `frontend`이며, `frontend`에는 실제 publisher ID가 있을 때만 출력되는 사이트 심사 스크립트 경계가 구현돼 있습니다. 승인 후 광고 단위는 아직 구현하지 않았습니다.

### 현재 route

- `/`
- `/blog`
- `/blog/[slug]`
- `/tools`
- `/tools/[tool]`
- `/projects`
- `/about`
- `/sitemap.xml`
- `/robots.txt`

### 렌더링 경계

- 페이지와 콘텐츠 조회는 기본적으로 Server Component에서 처리합니다.
- JSON Formatter, JWT Decoder, Timestamp Converter만 입력 상태와 브라우저 API 때문에 Client Component입니다.
- Blog와 Tool 동적 경로는 `generateStaticParams`로 build 시 생성합니다.
- 존재하지 않는 slug는 `notFound()` 계약을 사용합니다.

### 정적 export 계약

`developer-site/next.config.ts`는 다음 계약을 가집니다.

- `output: "export"`
- `trailingSlash: true`
- build 결과: `developer-site/out`

런타임 서버에 의존하는 기능은 이 계약과 충돌할 수 있으므로 도입 전에 구조 결정을 다시 검토해야 합니다.

## 환경변수

`developer-site`의 기본 canonical origin은 `https://dev.naketing.co.kr`입니다.

다른 환경에서 build할 때만 다음 값을 사용합니다.

```text
NEXT_PUBLIC_SITE_URL=https://dev.naketing.co.kr
```

예시는 `developer-site/.env.example`에 있습니다. 비밀값이 아니며 build 결과에 공개될 수 있는 값만 `NEXT_PUBLIC_` 변수로 사용합니다.

## 배포 상태

저장소와 2026-08-12 운영 응답에서 확인한 사실은 다음과 같습니다.

- GitHub Actions CI가 `frontend`, `developer-site`를 독립적으로 검증합니다.
- 저장소가 관리하는 자동 배포 workflow는 없습니다.
- `developer-site` Vercel Project는 GitHub `main` branch와 연결되어 push 후 자동 배포됩니다.
- `vercel.json`이 없습니다.
- 활성 `CNAME` 파일이 없습니다.
- `developer-site`는 정적 export가 가능합니다.
- `naketing.co.kr`과 `www.naketing.co.kr`은 Vercel에서 응답합니다.
- `dev.naketing.co.kr`은 Vercel custom domain과 DNS 연결이 완료됐으며 Vercel에서 `Valid Configuration` 상태입니다.
- 공용 DNS에서 `dev.naketing.co.kr`의 Vercel CNAME 해석을 확인했고, 사용자가 모바일 데이터 환경에서 실제 HTTPS 접속을 확인했습니다.

Vercel Project와 custom domain은 저장소 파일이 아니라 Vercel Dashboard에서 관리합니다. Developer Site의 Root Directory는 `developer-site`, Output Directory는 `out`입니다. 운영 절차와 검증 기준은 `docs/DEPLOYMENT.md`를 따릅니다.

논리적인 배포 단위는 다음과 같습니다.

| 호스트 | 프로젝트 루트 | 빌드 명령 | 결과 |
| --- | --- | --- | --- |
| `naketing.co.kr` | `frontend` | `npm run build` | Next.js production build |
| `dev.naketing.co.kr` | `developer-site` | `npm run build` | `out` 정적 파일 |
