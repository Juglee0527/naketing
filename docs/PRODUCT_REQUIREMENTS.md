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

Naketing의 현재 수익화 목표는 `naketing.co.kr`에 말하기·자기소개·퍼스널 브랜딩 관련 원본 콘텐츠와 무료 도구를 제공하고, 검색 유입이 발생하는 해당 화면에 Google AdSense 광고를 게재하는 것입니다. 광고는 서비스 소개 자체를 대신하지 않으며 사용자에게 가치 있는 콘텐츠와 도구가 먼저 제공되어야 합니다.

현재 저장소에는 서비스 방향을 소개하는 화면과 정적 Guides 기반이 있습니다. 다음 서비스 기능은 구현된 것으로 보지 않습니다.

- 회원가입과 로그인
- 말하기 기록 저장
- 음성 또는 AI 분석
- 분석 리포트
- Backend와 DB

### 현재 화면 계약

- 홈은 Naketing의 핵심 메시지와 주요 콘텐츠로 연결하는 진입점입니다.
- 홈은 프로그램 소개, 가이드, 도구의 역할을 구분하고 최신 가이드와 현재 제공하는 도구를 바로 보여줍니다.
- 주요 메뉴는 프로그램 소개(`/program`), 가이드(`/guides`), 도구(`/tools`) 3개만 제공합니다.
- 개인정보 처리방침(`/privacy`)과 문의(`/contact`)는 Footer의 운영 보조 링크로 제공합니다.
- 시작하기(`/start`), 회사소개(`/about`), 대표소개(`/founder`) 화면은 제공하지 않습니다.
- 개발자 사이트 기능을 기존 Naketing route에 섞지 않습니다.
- AI 분석 MVP를 구현하기 전까지는 AI 분석이 아직 제공되지 않는다는 현재 상태를 명확히 표현합니다.

### 자기소개 점검 프로그램

`/program`은 서비스 방향만 설명하는 준비 중 화면이 아니라 사용자가 직접 완료할 수 있는 3단계 자기소개 점검 프로그램입니다.

1. 면접, 발표, 네트워킹 또는 일반 자기소개 상황과 목표 시간, 강조할 내용을 선택합니다.
2. 상황별 작성 질문을 참고해 자기소개 원고를 입력합니다.
3. 예상 발화 시간, 문장 길이와 자기소개 기본 구조를 규칙 기반으로 점검합니다.

- 입력한 원고는 서버, 외부 API 또는 저장소로 전송하지 않습니다.
- 규칙 기반 결과를 AI 분석, 음성 분석 또는 사실 검증으로 표현하지 않습니다.
- 로그인, DB와 원고 저장 없이 한 번의 브라우저 세션 안에서 완료할 수 있어야 합니다.

### 광고 수익화 범위

- 광고 수익화 대상은 `naketing.co.kr`의 `frontend` 앱입니다.
- `dev.naketing.co.kr`의 `developer-site` 앱은 개발자 포트폴리오이며 광고 수익화 대상이 아닙니다.
- 광고는 향후 Guides 상세와 무료 Tools 상세처럼 원본 콘텐츠 또는 실질적인 도구 기능이 있는 화면에만 게재합니다.
- Home, 프로그램 소개, 개인정보 처리방침, 문의, 404 화면에는 초기 광고를 게재하지 않습니다.
- 광고를 서비스 CTA, navigation, 입력, 변환, Copy 버튼으로 오인할 수 있는 위치에 배치하지 않습니다.
- 광고 수나 배치 때문에 본문이 밀리거나 사용자가 콘텐츠를 읽기 어려워지지 않도록 합니다.
- 본인 또는 지인에게 광고 클릭을 요청하거나 광고 클릭을 유도하는 문구를 사용하지 않습니다.

### Guides

Guides는 Naketing 주제에 맞는 검색 유입과 광고 게재 기반을 만드는 원본 콘텐츠입니다. 목록, 정적 상세 경로와 Markdown 파싱이 구현됐으며 원본 Guide 10개가 등록돼 있습니다. AdSense 신청 전 프로젝트 내부 콘텐츠 수 기준을 충족했으며 각 글의 실제 검색 색인과 사용자 가치는 운영 과정에서 계속 확인합니다.

- 목록: `/guides`
- 상세: `/guides/[slug]`
- 콘텐츠: `frontend/content/guides/*.md`

초기 콘텐츠는 자기소개, 면접과 말하기, 발표와 퍼스널 브랜딩을 중심으로 구성합니다. 각 Guide는 단순 키워드 채우기가 아니라 다음 정보를 제공해야 합니다.

- 사용자가 겪는 구체적인 문제
- 좋지 않은 예시와 이유
- 개선 원칙
- 개선된 예시
- 직접 확인할 수 있는 체크리스트
- 관련 Naketing 무료 Tool 또는 Guide 링크

Google AdSense 신청 전 내부 준비 기준은 원본 Guide 10개 이상입니다. 이 수량은 Google의 공식 최소 조건이 아니라 콘텐츠가 부족한 상태에서 신청하지 않기 위한 프로젝트 내부 기준입니다.

### 무료 Tools

무료 Tools는 Naketing의 말하기와 자기표현 주제에 직접 연결되어야 하며, 서버가 필요 없는 기능은 브라우저 내부에서 처리합니다. 현재 말하기 시간 계산기와 자기소개 분량 점검기가 구현돼 있어 AdSense 신청 전 프로젝트 내부 Tool 수 기준을 충족합니다.

1. 말하기 시간 계산기: 구현됨
2. 자기소개 분량 점검기: 구현됨
3. 군더더기 표현 점검기: 후보

각 Tool은 정상 입력, 빈값, 잘못된 입력, 경계값, 결과 초기화와 모바일 화면을 처리해야 합니다. 입력값을 외부로 전송하지 않는 경우 그 사실을 화면에 명시합니다. 규칙 기반 결과를 AI 분석으로 표현하지 않습니다.

### Naketing SEO와 개인정보

- 주요 페이지에 title, description, canonical URL과 Open Graph를 제공합니다.
- Guides와 Tools의 정적 경로를 sitemap에 포함하고 robots에서 sitemap 위치를 안내합니다.
- canonical과 sitemap의 기본 공개 origin은 실제 운영 응답 기준인 `https://www.naketing.co.kr`입니다. 다른 공개 origin으로 build할 때만 `NEXT_PUBLIC_SITE_URL`로 override합니다.
- Search Console 연결과 색인 상태는 외부 계정에서 실제 확인하기 전까지 완료로 표현하지 않습니다.
- 광고 적용 전에 개인정보 처리방침과 문의 방법을 공개합니다.
- 개인정보 처리방침에는 Google을 포함한 제3자의 광고 쿠키 사용과 사용자의 맞춤 광고 설정 방법을 안내합니다.
- 적용 지역의 동의 요건을 충족할 수 있도록 실제 AdSense 계정에서 Google 인증 CMP를 설정합니다.

### Naketing AdSense

- `frontend`에는 환경변수 기반 사이트 심사 스크립트 경계가 구현돼 있지만 실제 publisher ID가 없으므로 현재 광고 스크립트를 렌더링하지 않습니다. 광고가 구현되거나 사이트 연결이 완료된 것으로 보지 않습니다.
- 실제 AdSense 계정에서 발급된 publisher ID만 사용하고 가짜 ID를 코드나 문서에 넣지 않습니다.
- publisher ID가 없으면 광고 스크립트와 광고 요청을 생성하지 않습니다.
- publisher ID는 `ca-pub-` 뒤에 숫자 16개가 오는 형식만 허용하며 잘못된 값은 build 오류로 처리합니다.
- 사이트 승인 전에는 사이트 확인에 필요한 범위만 구현하고, 실제 광고 단위는 승인 후 적용합니다.
- 승인 후 초기 광고 위치는 Guide 본문 하단과 충분한 간격을 둔 Tool 결과 하단으로 제한합니다.
- `ads.txt`는 실제 publisher ID를 받은 뒤 `naketing.co.kr/ads.txt`에서 제공하며 추측한 값을 미리 만들지 않습니다.
- 광고 공간은 레이아웃 이동을 줄일 수 있도록 크기를 확보하고 모바일과 데스크톱에서 별도로 확인합니다.
- Auto Ads는 초기 기본값으로 사용하지 않습니다. 수동 광고 배치의 성능과 사용자 경험을 측정한 후 별도 실험으로 검토합니다.

### 수익화 구현 순서

1. AI 관련 표현과 실제 제공 상태를 일치시킵니다.
2. 개인정보 처리방침, 문의, 페이지별 SEO, sitemap과 robots를 구현합니다.
3. 원본 Guide를 10개 이상 게시합니다.
4. Naketing 주제의 무료 Tool을 2개 이상 구현합니다.
5. Search Console에서 sitemap과 주요 경로의 색인을 확인합니다.
6. 실제 AdSense 계정으로 `naketing.co.kr`의 사이트 심사를 요청합니다.
7. 승인 후 제한된 수동 광고 위치와 `ads.txt`를 적용합니다.
8. 광고 노출, 페이지 RPM, 검색 유입, Core Web Vitals와 모바일 이탈을 확인한 뒤 배치를 조정합니다.

## Developer Site

### 목적

`dev.naketing.co.kr`은 다음 목적을 갖습니다.

1. 개발자 포트폴리오
2. 개발 블로그
3. 무료 개발자 도구
4. 반응이 좋은 Tool을 Micro-SaaS로 발전시킬 수 있는 기반

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

### 광고 적용 범위

- Developer Site에는 AdSense 광고를 적용하지 않습니다.
- 현재 Blog와 Tools에 있는 `AdSlot`은 실제 광고를 요청하지 않는 빈 placeholder이며 수익화 구현으로 보지 않습니다.
- Naketing 광고 컴포넌트와 publisher ID를 Developer Site에 공유하거나 주입하지 않습니다.

## 미확정 항목

다음은 코드나 문서만으로 확정할 수 없습니다.

- 공개할 연락처
- 공개할 상세 경력
- Analytics 계정
- `naketing.co.kr`의 Search Console과 AdSense 계정 상태

미확정 항목은 사용자 확인 없이 구현 완료 상태로 바꾸지 않습니다.

`developer-site` Vercel Project, Git 자동 배포, `dev.naketing.co.kr` custom domain 연결은 2026-08-12에 확인됐습니다. 현재 운영 설정과 검증 근거는 `docs/DEPLOYMENT.md`에서 관리합니다.
