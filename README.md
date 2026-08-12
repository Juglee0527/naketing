# Naketing

`naketing.co.kr` 서비스와 `dev.naketing.co.kr` 개발자 사이트를 같은 저장소에서 독립적으로 관리합니다.

두 앱은 서로 다른 배포 단위입니다. 루트 workspace나 모노레포 도구를 사용하지 않으며, 각 디렉터리에서 의존성을 설치하고 빌드합니다.

## 프로젝트 구조

```text
naketing/
├─ frontend/                 # 기존 Naketing 서비스
│  ├─ app/                   # Next.js App Router
│  ├─ public/
│  ├─ next.config.ts
│  └─ package.json
├─ developer-site/           # 개발자 사이트
│  ├─ app/                   # 페이지, sitemap, robots
│  ├─ components/            # 공통 UI와 브라우저 도구
│  ├─ content/blog/          # Markdown 블로그 글
│  ├─ lib/                   # 블로그 파싱, 사이트/도구 정의
│  ├─ next.config.ts
│  └─ package.json
└─ README.md
```

## 기술 스택

두 앱은 현재 같은 버전을 사용합니다.

- Next.js 16.0.3 (App Router)
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

## 기존 Naketing 서비스

`frontend`는 `naketing.co.kr`용 기존 서비스입니다. 현재 라우트는 다음과 같습니다.

- `/`
- `/start`
- `/about`
- `/founder`
- `/program`

기존 코드는 개발자 사이트 추가 과정에서 수정하지 않았습니다. `frontend/next.config.ts`에는 `output: "export"`가 없으므로 Next.js의 일반 production build를 생성합니다.

### 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

### 검증과 빌드

```bash
cd frontend
npm run lint
npm run build
```

## Developer Site

`developer-site`는 `dev.naketing.co.kr`용 독립 앱입니다.

- Home: 개발자 소개, 기술 스택, 최근 글, 주요 도구
- Blog: Markdown 글 목록/상세, 최신순 정렬, 글별 SEO metadata
- Tools: JSON Formatter, JWT Decoder
- Projects: 프로젝트별 기술, 문제, 해결 방식, 링크
- About: 확인 가능한 프로필 정보와 수정용 TODO
- SEO: canonical, Open Graph, `sitemap.xml`, `robots.txt`, 블로그 JSON-LD
- AdSense: 실제 광고 코드 없이 Blog/Tools 하단에 향후 삽입 경계만 제공

JSON Formatter와 JWT Decoder의 입력값은 API Route나 서버로 전송하지 않고 브라우저에서 처리합니다. JWT Decoder는 서명을 검증하지 않습니다.

### 로컬 실행

기존 앱과 동시에 실행할 때는 다른 포트를 사용합니다.

```bash
cd developer-site
npm install
npm run dev -- --port 3001
```

개발자 사이트 주소는 `http://localhost:3001`입니다.

### 환경변수

canonical URL과 sitemap의 기본 origin은 `https://dev.naketing.co.kr`입니다. 다른 환경에서 빌드할 때만 다음 값을 설정합니다.

```bash
NEXT_PUBLIC_SITE_URL=https://dev.naketing.co.kr
```

예시는 `developer-site/.env.example`에 있습니다.

### 검증과 빌드

```bash
cd developer-site
npm run lint
npm run build
```

`developer-site/next.config.ts`는 `output: "export"`를 사용합니다. 빌드 결과는 `developer-site/out`에 생성되며 Node.js 서버 없이 정적 호스팅할 수 있습니다.

## 배포 구조

현재 저장소에는 GitHub Actions workflow, `vercel.json`, 활성 `CNAME` 파일이 없습니다. 과거 README에는 GitHub Pages 자동 배포가 적혀 있었지만 현재 Git 추적 파일만으로는 실제 CI/CD 구성을 확인할 수 없습니다.

권장 배포 단위는 다음과 같습니다.

| 호스트 | 프로젝트 루트 | 빌드 명령 | 출력 |
| --- | --- | --- | --- |
| `naketing.co.kr` | `frontend` | `npm run build` | Next.js production build |
| `dev.naketing.co.kr` | `developer-site` | `npm run build` | `out` 정적 파일 |

Vercel을 사용한다면 같은 Git 저장소를 두 프로젝트에 연결하고 Root Directory를 각각 지정할 수 있습니다. 정적 호스팅을 사용한다면 `developer-site/out`을 `dev.naketing.co.kr`에 연결합니다. 실제 DNS와 호스팅 설정은 운영 환경에서 별도로 확인해야 합니다.

## Blog 글 추가 방법

`developer-site/content/blog`에 `.md` 파일을 추가합니다.

```markdown
---
title: "글 제목"
description: "검색 결과와 목록에 표시할 설명"
date: 2026-08-12
tags: [Java, Spring]
---

# 본문 제목

본문을 작성합니다.
```

필수 metadata는 `title`, `description`, `date`, `tags`입니다. 파일명이 기본 slug가 되며, 필요한 경우 frontmatter에 `slug`를 지정할 수 있습니다. slug는 영문 소문자, 숫자, 하이픈만 지원합니다.

빌드 시 metadata 누락, 잘못된 날짜, 잘못된 slug, 중복 slug를 오류로 처리합니다. 글을 commit/push한 뒤 해당 앱이 다시 배포되면 목록, 상세 페이지, sitemap에 반영됩니다.

현재 Markdown 렌더러는 제목(`#`~`###`), 문단, 순서 없는 목록, fenced code block, 굵게, inline code, 링크를 지원합니다. 더 많은 문법이 실제로 필요해질 때 범위를 확장합니다.

## Tool 추가 방법

1. `developer-site/lib/tools.ts`의 `ToolSlug`와 `tools`에 도구를 추가합니다.
2. 브라우저에서 동작하는 UI를 `developer-site/components`에 Client Component로 구현합니다.
3. `developer-site/app/tools/[tool]/page.tsx`에서 slug에 맞는 컴포넌트를 렌더링합니다.
4. `npm run lint`와 `npm run build`로 정적 경로, 타입, metadata를 검증합니다.

서버가 필요하지 않은 변환 기능에는 API Route를 추가하지 않습니다.
