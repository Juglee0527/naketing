# Naketing

`naketing.co.kr` 서비스와 `dev.naketing.co.kr` 개발자 사이트를 같은 저장소에서 독립적으로 관리합니다.

## 애플리케이션

| 디렉터리 | 역할 | 기본 로컬 주소 |
| --- | --- | --- |
| `frontend` | 기존 Naketing 서비스 | `http://localhost:3000` |
| `developer-site` | 개발자 사이트, Blog, Tools | `http://localhost:3001` |

두 앱은 독립적인 Next.js App Router 프로젝트입니다. 각각 자체 `package.json`과 `package-lock.json`을 사용합니다.

## 빠른 시작

### Naketing

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

### Developer Site

```powershell
cd developer-site
npm.cmd install
npm.cmd run dev -- --port 3001
```

## 검증

Naketing 서비스는 테스트, lint, production build와 심사 전 정적 계약을 한 번에 확인합니다.

```powershell
cd frontend
npm.cmd run verify:review
```

Developer Site는 별도 앱 디렉터리에서 검증합니다.

```powershell
cd developer-site
npm.cmd run lint
npm.cmd run build
```

## 프로젝트 문서

프로젝트 문서는 [`docs/README.md`](./docs/README.md)를 진입점으로 사용합니다.

- [프로젝트 구조와 배포 경계](./docs/PROJECT_STRUCTURE.md)
- [배포와 도메인 연결 가이드](./docs/DEPLOYMENT.md)
- [제품 요구사항과 비즈니스 규칙](./docs/PRODUCT_REQUIREMENTS.md)
- [개발 및 검증 가이드](./docs/DEVELOPMENT_GUIDE.md)
- [주요 구조적 의사결정](./docs/DECISIONS.md)
- [ChatGPT용 Naketing 컨텍스트 프롬프트](./docs/CHATGPT_CONTEXT_PROMPT.md)
- [Codex 작업 지침](./AGENTS.md)

`developer-site/content/blog/*.md`는 프로젝트 문서가 아니라 개발자 사이트의 게시물 데이터이므로 `docs/` 밖에서 관리합니다.

## 배포 주의사항

- `frontend`는 일반 Next.js production build를 생성합니다.
- `developer-site`는 `output: "export"`를 사용하며 `developer-site/out`에 정적 파일을 생성합니다.
- 기존 서비스와 `dev.naketing.co.kr` 개발자 사이트는 Vercel에서 운영 중입니다.
- Developer Site의 Vercel Output Directory는 정적 export 결과인 `out`으로 설정합니다.
- 확인된 운영 상태, DNS 전파 확인 및 장애 대응은 [배포 가이드](./docs/DEPLOYMENT.md)를 참고하세요.
