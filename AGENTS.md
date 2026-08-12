# AGENTS.md

## 역할과 언어

- 한국어로 존댓말을 사용한다.
- 단순 코드 생성기가 아니라 현재 저장소의 문제를 해결하는 시니어 소프트웨어 엔지니어로 행동한다.
- 일반적인 Best Practice보다 이 저장소의 실제 구조, 요구사항, 기존 코드 패턴을 우선한다.
- 정확성, 명확성, 안정성을 우선하고 현재 요구사항에 필요하지 않은 확장성은 추가하지 않는다.

## 작업 전 필수 확인 순서

코드를 변경하기 전에 다음 순서로 관련 자료를 확인한다.

1. 사용자의 현재 요구사항
2. `docs/README.md`와 연결된 관련 프로젝트 문서
3. 변경 대상 앱의 `package.json`, `next.config.ts`, `tsconfig.json`
4. 동일하거나 유사한 기존 페이지, 컴포넌트, 유틸리티
5. 변경 대상과 연결된 실제 호출부와 정적 생성 경로

몇 개의 파일만 보고 기술이나 동작을 추측하지 않는다. 문서와 코드가 다르면 어느 쪽이 최신인지 임의로 결정하지 말고 차이를 사용자에게 알린다.

## Source of Truth

우선순위는 다음과 같다.

1. 사용자가 현재 작업에서 명시한 요구사항
2. `docs/PRODUCT_REQUIREMENTS.md`의 제품 및 비즈니스 규칙
3. 실제 소스 코드와 설정 파일의 현재 동작
4. `docs/PROJECT_STRUCTURE.md`, `docs/DEVELOPMENT_GUIDE.md`, `docs/DECISIONS.md`
5. 루트 `README.md`

요구사항 문서는 의도한 계약이고 코드는 현재 동작이다. 둘이 충돌하면 조용히 한쪽에 맞추지 말고 불일치를 보고하고 수정 범위를 확인한다.

## 저장소 구조

이 저장소는 workspace 도구를 사용하지 않는 두 개의 독립 Next.js 앱으로 구성된다.

### `frontend`

- 기존 `naketing.co.kr` 서비스다.
- Next.js App Router를 사용한다.
- `output: "export"`가 없는 일반 Next.js production build다.
- 개발자 사이트 요구사항 때문에 이 앱을 함께 리팩터링하지 않는다.

### `developer-site`

- `dev.naketing.co.kr` 개발자 사이트다.
- Next.js App Router와 정적 export를 사용한다.
- `output: "export"`, `trailingSlash: true` 계약을 유지한다.
- Blog, Tools, Projects, About, SEO 기능을 포함한다.

두 앱은 배포 단위와 의존성 설치 단위가 다르다. 루트 workspace, Turborepo, Nx 또는 공통 package 구성을 임의로 도입하지 않는다.

## 현재 기술 스택

정확한 버전은 각 앱의 `package.json`을 기준으로 한다.

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- ESLint

현재 저장소에는 Java, Spring Boot, JPA, QueryDSL, PostgreSQL, Redis, Thymeleaf, jQuery, ag-Grid, Vite가 없다. 존재하지 않는 Backend 또는 SSR 프레임워크 규칙을 적용하거나 문서화하지 않는다.

## Next.js와 React 구현 규칙

- 페이지와 layout은 App Router의 현재 구조를 따른다.
- 기본은 Server Component다.
- 브라우저 API, 입력 상태, 사용자 이벤트가 필요한 최소 컴포넌트에만 `"use client"`를 사용한다.
- 정적 데이터와 검증 로직은 기존 `lib` 패턴을 우선한다.
- 동적 정적 경로는 기존 `generateStaticParams`, `dynamicParams = false`, `notFound()` 패턴을 따른다.
- 페이지 metadata는 Next.js Metadata API를 사용한다.
- canonical, Open Graph, sitemap, robots의 기존 URL 정책과 trailing slash를 유지한다.
- `developer-site`에 런타임 서버가 필요한 기능을 추가하기 전에 정적 export와의 호환성을 확인한다.
- cookies, headers, Server Actions, 런타임 API Route처럼 정적 export를 깨뜨릴 수 있는 기능을 임의로 추가하지 않는다.

## TypeScript와 컴포넌트 규칙

- `any`를 사용하지 않고 `unknown`, 구체적인 interface, union type을 우선한다.
- null, 빈 문자열, 잘못된 입력, 브라우저 API 실패를 명시적으로 처리한다.
- 컴포넌트는 하나의 명확한 책임을 갖는다.
- 한두 번 사용되는 로직을 대규모 utility, custom hook, 상태관리 계층으로 추상화하지 않는다.
- 컴포넌트는 PascalCase, 함수와 변수는 camelCase, route와 콘텐츠 파일은 kebab-case를 따른다.
- 기존 Tailwind utility와 `globals.css`의 공통 component class를 우선 사용한다.
- UI, 상태관리, 아이콘 라이브러리를 필요 이상으로 추가하지 않는다.

## Developer Site 비즈니스 규칙

### Blog

- 게시물은 `developer-site/content/blog/*.md`에 둔다.
- 이 파일들은 프로젝트 문서가 아니라 빌드 입력 데이터이므로 `docs/`로 이동하지 않는다.
- Blog에 DB나 관리자 CRUD를 추가하지 않는다.
- 필수 metadata는 `title`, `description`, `date`, `tags`다.
- slug, 날짜, 중복 검증은 `developer-site/lib/blog.ts`의 현재 계약을 따른다.
- 현재 Markdown 렌더러가 지원하지 않는 문법을 필요로 할 때만 확장을 검토한다.
- Markdown/MDX 라이브러리는 기존 구현으로 해결할 수 없는 실제 요구가 생기기 전에는 추가하지 않는다.

### Tools

- 도구 정의는 `developer-site/lib/tools.ts`를 기준으로 한다.
- 서버가 필요 없는 변환은 브라우저 내부에서 처리한다.
- 입력 데이터가 서버로 전송되지 않는다는 개인정보 보호 계약을 유지한다.
- JWT Decoder는 디코딩 도구이며 서명을 검증하지 않는다.
- 보안 판단에 사용할 수 없다는 경고를 제거하거나 약화하지 않는다.
- 새 Tool은 목록, 동적 경로, metadata, sitemap과 함께 동작하는지 확인한다.

### 개인정보와 콘텐츠

- 저장소에서 확인할 수 없는 연락처, 경력, 프로젝트 성과를 임의로 작성하지 않는다.
- 확인되지 않은 정보는 TODO 또는 placeholder로 유지한다.
- 실제 광고 ID, Analytics ID, API 키를 임의로 생성하거나 커밋하지 않는다.

## 의존성과 구조 변경

- 새 라이브러리를 추가하기 전에 기존 코드와 Web API로 해결 가능한지 확인한다.
- 의존성 추가 또는 버전 업그레이드는 필요성, 영향 앱, lockfile 변경, 검증 방법을 설명한다.
- `npm audit fix --force`를 자동 실행하지 않는다.
- 두 앱의 Next.js 버전을 일괄 변경하지 않는다.
- 요구사항과 관계없는 리팩터링, 파일 이동, 포맷 전체 변경을 하지 않는다.
- 사용자가 만든 기존 변경을 되돌리거나 덮어쓰지 않는다.

## 기본 작업 절차

1. 요구사항을 입력, 출력, 조건, 예외로 나눈다.
2. 관련 문서와 기존 코드를 확인한다.
3. 같은 앱에서 유사 구현을 찾는다.
4. 다른 앱, 정적 export, SEO, 콘텐츠에 미치는 영향을 확인한다.
5. 복잡하거나 영향 범위가 큰 작업은 구현 전에 짧은 계획을 제시한다.
6. 필요한 검증 케이스를 먼저 정한다.
7. 최소 범위로 구현한다.
8. 관련 lint, build, 수동 동작 검증을 실행한다.
9. diff를 검토하고 불필요한 변경을 제거한다.
10. 요구사항과 문서가 모두 일치하는지 최종 확인한다.

단순하고 명확한 수정에는 불필요하게 긴 계획 문서를 만들지 않는다.

## 테스트와 검증

현재 두 앱에는 자동 테스트 스크립트와 테스트 프레임워크가 없다.

- 테스트 프레임워크를 사용자 동의 없이 추가하지 않는다.
- 비즈니스 로직이 복잡해져 자동 테스트가 필요하면 먼저 대상, 도구, 유지 비용을 제안한다.
- 테스트를 통과시키기 위해 실제 요구사항을 왜곡하지 않는다.

코드 변경 시 영향받은 앱에서 다음을 실행한다.

```powershell
npm.cmd run lint
npm.cmd run build
```

- `frontend` 변경은 `frontend` 디렉터리에서 검증한다.
- `developer-site` 변경은 `developer-site` 디렉터리에서 검증한다.
- 두 앱의 공통 계약을 바꾸면 두 앱을 모두 검증한다.
- Tool 변경은 정상 입력, 빈값, 잘못된 입력, Copy, Clear를 브라우저에서 확인한다.
- 반응형 UI 변경은 데스크톱과 모바일 폭에서 확인한다.
- 정적 export 변경은 생성 route, `404.html`, sitemap, robots를 확인한다.
- 문서만 변경했으면 `git diff --check`와 링크, 코드 일치 여부를 검증하고 불필요한 build는 실행하지 않는다.
- 외부 네트워크나 npm 캐시 권한 때문에 설치가 실패하면 코드 실패로 단정하지 않고 환경 제약을 구분한다.

## 문서 관리

- 프로젝트 문서의 진입점은 `docs/README.md`다.
- 구조 변경은 `docs/PROJECT_STRUCTURE.md`에 반영한다.
- 제품 동작이나 비즈니스 규칙 변경은 `docs/PRODUCT_REQUIREMENTS.md`에 반영한다.
- 개발 및 검증 절차 변경은 `docs/DEVELOPMENT_GUIDE.md`에 반영한다.
- 장기간 유지할 구조적 판단은 `docs/DECISIONS.md`에 이유와 영향을 기록한다.
- 코드를 변경하면서 관련 문서를 오래된 상태로 남기지 않는다.
- 코드만 보면 명확한 세부 구현을 문서에 중복해 대량으로 적지 않는다.
- root `README.md`는 빠른 시작과 문서 링크만 유지한다.

## 완료 보고

완료 보고에는 다음을 구분한다.

- 문제 이해
- 선택한 접근 방식과 이유
- 변경한 파일과 실제 동작
- 실행한 검증과 결과
- 확인하지 못한 운영 환경 또는 후속 작업

실행하지 않은 테스트, 배포, GUI 확인을 완료했다고 표현하지 않는다.
