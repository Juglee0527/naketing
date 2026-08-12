# 제품 요구사항

이 문서는 코드만으로는 놓치기 쉬운 제품 목적과 유지해야 할 동작 계약을 기록합니다.

## 공통 원칙

- `naketing.co.kr`과 `dev.naketing.co.kr`은 같은 저장소에 있지만 서로 다른 서비스와 배포 단위입니다.
- 한 서비스의 요구사항 때문에 다른 서비스를 함께 리팩터링하지 않습니다.
- 가독성, 모바일 대응, 빠른 로딩, SEO, 유지보수성을 우선합니다.
- 과도한 애니메이션, gradient, glassmorphism, 카드 분할을 피합니다.
- 확인되지 않은 개인정보와 프로젝트 성과를 임의로 작성하지 않습니다.
- 실제 운영 배포와 계정 연결은 저장소 증거 없이 완료됐다고 표현하지 않습니다.

## Naketing 서비스

### 목적

Naketing은 말하기, 표현력, 브랜딩 역량을 다루는 서비스입니다.

현재 저장소에는 서비스 방향을 소개하는 화면만 있으며, 다음 기능은 구현된 것으로 보지 않습니다.

- 회원가입과 로그인
- 말하기 기록 저장
- 음성 또는 AI 분석
- 분석 리포트
- Backend와 DB

### 현재 화면 계약

- 홈에서 Naketing 서비스의 핵심 메시지를 전달합니다.
- `/start`, `/about`, `/founder`, `/program` 화면을 유지합니다.
- 개발자 사이트 기능을 기존 Naketing route에 섞지 않습니다.

## Developer Site

### 목적

`dev.naketing.co.kr`은 다음 목적을 갖습니다.

1. 개발자 포트폴리오
2. 개발 블로그
3. 무료 개발자 도구
4. 향후 검색 유입과 AdSense 적용 기반
5. 반응이 좋은 Tool을 Micro-SaaS로 발전시킬 수 있는 기반

### Navigation

다음 메뉴를 유지합니다.

- Home
- Blog
- Tools
- Projects
- About

### Home

Home은 개인 개발자 사이트라는 점이 바로 보여야 합니다.

- 이름: 이정근
- 역할: Web Developer
- 주요 기술 스택
- Blog, Tools, Projects 소개
- 최근 Blog 글
- 주요 Tools

저장소에서 확인되지 않는 경력과 성과를 추가하지 않습니다.

### Blog

- DB와 관리자 페이지를 사용하지 않습니다.
- 게시물은 `developer-site/content/blog/*.md`로 관리합니다.
- Git commit/push와 앱 재배포를 통해 게시합니다.
- 목록은 최신 날짜 순으로 정렬합니다.
- 필수 metadata는 `title`, `description`, `date`, `tags`입니다.
- 파일명이 기본 slug이며 선택적으로 `slug` metadata를 사용할 수 있습니다.
- slug는 영문 소문자, 숫자, 하이픈을 사용합니다.
- 잘못된 metadata, 날짜, slug, 중복 slug는 build 오류로 처리합니다.
- 없는 slug는 404로 처리합니다.
- 글별 title, description, canonical, Open Graph, JSON-LD를 생성합니다.

현재 Markdown 렌더러가 지원하는 범위는 다음과 같습니다.

- `#`부터 `###`까지의 제목
- 문단
- 순서 없는 목록
- fenced code block
- 굵게
- inline code
- 링크

지원 범위 밖 문법은 실제 게시물 요구가 생겼을 때 추가합니다.

### Tools 공통 규칙

- 현재 Tool은 JSON Formatter, JWT Decoder, Timestamp Converter입니다.
- 입력값은 서버나 외부 API로 전송하지 않습니다.
- 가능한 모든 처리는 브라우저 내부에서 수행합니다.
- Tool 화면에는 브라우저 내부 처리 사실을 알립니다.
- 정상 입력뿐 아니라 빈값과 잘못된 입력을 처리합니다.
- Copy와 Clear 기능을 제공합니다.

### JSON Formatter

- JSON 입력
- Pretty Print
- Minify
- Copy
- Clear
- 잘못된 JSON 오류 안내

### JWT Decoder

- JWT 입력
- Header와 Payload 표시
- 숫자 형식의 `exp`가 있으면 한국 시간 기준 만료 시각 표시
- 현재 시각 기준 만료 여부 표시
- Copy
- Clear
- 잘못된 JWT 오류 안내

JWT Decoder는 서명을 검증하지 않습니다. 인증 또는 보안 판단 도구가 아니라는 경고를 명확하게 유지합니다.

### Timestamp Converter

- Unix timestamp 입력
- Seconds와 Milliseconds 단위 선택
- UTC ISO 8601과 한국 시간(`Asia/Seoul`) 표시
- 현재 시각 입력
- Copy
- Clear
- 빈값, 정수가 아닌 값, 지원 범위를 벗어난 값의 오류 안내

### Projects

프로젝트는 다음 정보를 표현할 수 있어야 합니다.

- 프로젝트명
- 설명
- 주요 기술
- 문제
- 해결 방식
- 링크

확인되지 않은 내용은 과장하지 않고 이후 수정 가능한 정적 데이터로 관리합니다.

### About

다음 정보를 표현할 수 있는 구조를 유지합니다.

- 이정근
- Web Developer
- 기술 스택
- GitHub
- 경력과 경험
- 연락처

현재 저장소에서 확인할 수 없는 경력과 연락처는 TODO로 유지합니다.

### SEO

- Next.js Metadata API를 사용합니다.
- 모든 주요 페이지에 title과 description을 제공합니다.
- canonical URL과 Open Graph를 제공합니다.
- sitemap과 robots를 정적 생성합니다.
- Blog 상세 metadata는 게시물별로 생성합니다.
- `trailingSlash: true`와 canonical, sitemap URL 표현을 일치시킵니다.
- 별도 SEO 라이브러리를 필요 없이 추가하지 않습니다.

### AdSense

- 현재 실제 광고 코드를 넣지 않습니다.
- 가짜 publisher ID를 넣지 않습니다.
- Blog와 Tools의 기존 `AdSlot` 경계를 향후 광고 삽입 위치로 사용합니다.
- 실제 적용 시 사용자 경험, 개인정보 안내, 성능 영향을 다시 검토합니다.

## 미확정 항목

다음은 코드나 문서만으로 확정할 수 없습니다.

- 실제 호스팅 플랫폼
- DNS와 자동 배포 연결 상태
- 공개할 연락처
- 공개할 상세 경력
- Analytics, Search Console, AdSense 계정

미확정 항목은 사용자 확인 없이 구현 완료 상태로 바꾸지 않습니다.
