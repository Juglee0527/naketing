# 주요 의사결정

이 문서는 장기간 유지해야 하는 구조적 선택을 기록합니다. 단순 구현 세부나 일시적인 작업 계획은 기록하지 않습니다.

## D-001: 두 Next.js 앱을 독립 배포 단위로 유지

- 상태: 채택
- 결정일: 2026-08-12

### 배경

기존 `naketing.co.kr` 서비스를 유지하면서 `dev.naketing.co.kr` 개발자 사이트를 추가해야 했습니다.

### 결정

같은 저장소 안에 `frontend`와 `developer-site`를 독립 Next.js 앱으로 유지합니다.

### 이유

- 기존 서비스 변경 범위를 최소화합니다.
- 서로 다른 호스트와 배포 설정을 분리할 수 있습니다.
- 현재 규모에서 workspace와 모노레포 도구가 제공하는 이점보다 복잡도가 큽니다.

### 결과

- 각 앱은 자체 package와 lockfile을 가집니다.
- 의존성 설치, lint, build를 앱별로 실행합니다.
- 공통 코드가 일부 생겨도 세 번째 반복 전에는 성급하게 shared package를 만들지 않습니다.

## D-002: Developer Site는 정적 export 유지

- 상태: 채택
- 결정일: 2026-08-12

### 배경

개발자 사이트의 초기 기능은 정적 콘텐츠와 브라우저 도구로 구성됩니다.

### 결정

`developer-site`는 Next.js의 `output: "export"`와 `trailingSlash: true`를 사용합니다.

### 이유

- 런타임 서버 없이 배포할 수 있습니다.
- Blog와 Tool이 build 시점에 모두 확정됩니다.
- 초기 운영 복잡도와 비용을 낮춥니다.

### 결과

- 서버 런타임 기능 도입 시 이 결정을 다시 검토해야 합니다.
- metadata route와 동적 route는 정적 생성 가능해야 합니다.
- canonical과 sitemap은 trailing slash 정책을 일관되게 사용합니다.

## D-003: Blog는 Markdown 파일로 관리

- 상태: 채택
- 결정일: 2026-08-12

### 배경

관리자 화면과 DB 없이 Git 기반으로 글을 작성하고 배포해야 합니다.

### 결정

Blog 게시물을 `developer-site/content/blog/*.md`에 저장하고 build 시 읽습니다.

### 이유

- 별도 Backend와 DB가 필요 없습니다.
- Git history로 콘텐츠 변경을 추적할 수 있습니다.
- 현재 글 규모에 적합한 가장 단순한 방식입니다.

### 결과

- metadata 오류는 build 단계에서 실패합니다.
- 게시물 Markdown은 프로젝트 문서가 아니므로 `docs/`로 이동하지 않습니다.
- 관리자 CRUD와 Blog DB를 요구사항 없이 추가하지 않습니다.

## D-004: 초기 Tools는 브라우저에서만 처리

- 상태: 채택
- 결정일: 2026-08-12

### 배경

JSON과 JWT에는 민감한 데이터가 포함될 수 있으며 현재 기능은 서버 처리가 필요하지 않습니다.

### 결정

JSON Formatter와 JWT Decoder는 Client Component와 브라우저 Web API만 사용합니다.

### 이유

- 입력 데이터가 외부로 전송되지 않습니다.
- API 운영과 보안 범위를 만들지 않습니다.
- 정적 export 계약을 유지합니다.

### 결과

- Tool 화면에서 브라우저 내부 처리 사실을 안내합니다.
- JWT Decoder가 서명 검증 도구가 아니라는 경고를 유지합니다.
- 향후 서버 기능이 필요한 Tool은 별도 구조 결정을 거칩니다.

## D-005: 프로젝트 문서는 `docs/`에서 중앙 관리

- 상태: 채택
- 결정일: 2026-08-12

### 배경

AI가 코드만으로 제품 요구사항과 구조 결정의 이유를 모두 추론하면 잘못된 일반화가 발생할 수 있습니다. Markdown 문서가 여러 디렉터리에 흩어지면 어떤 문서가 기준인지 판단하기 어렵습니다.

### 결정

프로젝트 설명 문서는 `docs/`에 모으고 `docs/README.md`를 단일 문서 진입점으로 사용합니다.

### 예외

- Git 저장소 진입점인 루트 `README.md`
- Codex 자동 지침인 루트 `AGENTS.md`
- 애플리케이션 콘텐츠인 `developer-site/content/blog/*.md`

### 결과

- 요구사항과 코드 변경 시 관련 문서를 같은 작업에서 갱신합니다.
- 코드 내용을 그대로 복제하는 문서는 만들지 않습니다.
- 작은 규칙마다 새 파일을 만들지 않고 현재 중앙 문서에 섹션을 추가합니다.

## D-006: 광고 수익화 대상은 Naketing 서비스로 한정

- 상태: 채택
- 결정일: 2026-08-12

### 배경

같은 저장소에는 서비스인 `naketing.co.kr`과 개발자 포트폴리오인 `dev.naketing.co.kr`이 함께 있습니다. Developer Site 문서에 있던 AdSense 계획은 두 사이트의 역할을 혼동한 것이며, 사용자의 수익화 목표는 기존 Naketing 서비스입니다.

### 결정

Google AdSense 광고 수익화 대상은 `frontend`가 제공하는 `naketing.co.kr`로 한정합니다. `developer-site`가 제공하는 `dev.naketing.co.kr`은 광고 없는 개발자 포트폴리오로 유지합니다.

Naketing은 소개 화면에 광고를 바로 추가하지 않고, 말하기·자기소개·퍼스널 브랜딩 Guides와 무료 Tools를 먼저 제공한 뒤 원본 콘텐츠가 있는 화면에만 광고를 적용합니다.

### 이유

- Naketing의 서비스 주제와 검색 콘텐츠 및 무료 Tool을 하나의 사용자 흐름으로 연결할 수 있습니다.
- Developer Site의 개인 포트폴리오 목적과 Naketing의 수익화 목적을 분리합니다.
- 콘텐츠가 부족한 소개 화면에 광고만 추가하는 구조를 피합니다.
- 광고가 Home과 서비스 CTA의 신뢰도와 전환 흐름을 방해하지 않도록 합니다.

### 결과

- Naketing 수익화 기능과 콘텐츠는 `frontend` 안에 구현합니다.
- Developer Site의 Blog, Tools와 광고 코드를 Naketing에 직접 import하거나 shared package로 묶지 않습니다.
- Home, 시작하기, 회사소개, 대표소개와 프로그램 소개는 초기 광고 제외 화면입니다.
- Guide와 무료 Tool, 개인정보 안내, SEO와 색인 준비가 완료된 뒤 AdSense 심사를 요청합니다.
- 실제 publisher ID, 계정 승인, Search Console 색인과 CMP 설정은 외부에서 확인하기 전까지 완료로 표현하지 않습니다.
