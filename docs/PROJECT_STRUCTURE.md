# 프로젝트 구조

## 개요

`naketing` 저장소는 두 개의 독립 Next.js 앱을 같은 Git 저장소에서 관리합니다.

```text
naketing/
├─ .github/workflows/       # GitHub Actions CI
├─ frontend/                 # 기존 naketing.co.kr 서비스
│  ├─ app/                   # App Router 페이지와 공통 layout
│  ├─ public/
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

- Next.js 16.0.3
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

기존 Naketing 서비스의 화면을 제공합니다.

### 현재 route

- `/`
- `/start`
- `/about`
- `/founder`
- `/program`

### 렌더링과 빌드

- App Router를 사용합니다.
- 현재 페이지는 build 시 정적으로 prerender됩니다.
- `frontend/next.config.ts`에는 `output: "export"`가 없습니다.
- 결과는 일반 Next.js production build이며 `developer-site/out`과 같은 독립 정적 export 계약을 갖지 않습니다.

## `developer-site`

### 책임

개발자 이정근의 개인 사이트를 제공합니다.

- 개발자 소개
- Markdown 기반 Blog
- 브라우저 기반 무료 개발자 Tools
- Projects
- About
- 검색 노출을 위한 metadata, sitemap, robots
- 향후 AdSense 삽입 경계

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
- JSON Formatter와 JWT Decoder만 입력 상태와 브라우저 API 때문에 Client Component입니다.
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

저장소에서 확인 가능한 사실은 다음과 같습니다.

- GitHub Actions CI가 `frontend`, `developer-site`를 독립적으로 검증합니다.
- 자동 배포 workflow는 없습니다.
- `vercel.json`이 없습니다.
- 활성 `CNAME` 파일이 없습니다.
- `developer-site`는 정적 export가 가능합니다.

실제 `naketing.co.kr`과 `dev.naketing.co.kr`의 호스팅 플랫폼, DNS, 자동 배포 연결 상태는 저장소만으로 확인할 수 없습니다. 운영 설정을 확인하기 전에는 GitHub Pages나 Vercel 배포가 구성됐다고 단정하지 않습니다.

논리적인 배포 단위는 다음과 같습니다.

| 호스트 | 프로젝트 루트 | 빌드 명령 | 결과 |
| --- | --- | --- | --- |
| `naketing.co.kr` | `frontend` | `npm run build` | Next.js production build |
| `dev.naketing.co.kr` | `developer-site` | `npm run build` | `out` 정적 파일 |
