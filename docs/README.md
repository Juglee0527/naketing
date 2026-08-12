# Naketing 프로젝트 문서

이 디렉터리는 `naketing` 저장소의 구조, 제품 요구사항, 개발 규칙, 주요 의사결정을 관리하는 중앙 문서 공간입니다.

## 문서 지도

| 문서 | 목적 | 확인 시점 |
| --- | --- | --- |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 저장소 구조, 기술 스택, 앱 경계, 배포 계약 | 구조 또는 설정 변경 전 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 확인된 운영 상태, Vercel 연결 및 배포 후 검증 | 배포 설정 또는 도메인 변경 전 |
| [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) | 제품 기능, 비즈니스 규칙, 개인정보·SEO 요구사항 | 기능 개발 또는 버그 수정 전 |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | 코드 패턴, 콘텐츠 추가, 실행 및 검증 방법 | 구현과 검증 시 |
| [DECISIONS.md](./DECISIONS.md) | 장기간 유지할 구조적 선택과 이유 | 구조를 변경하거나 재검토할 때 |

Codex 작업 규칙은 저장소 루트의 [`AGENTS.md`](../AGENTS.md)에 있습니다. 빠른 실행 방법은 루트 [`README.md`](../README.md)에 있습니다.

## 문서가 아닌 Markdown 파일

다음 파일은 `docs/`로 이동하지 않습니다.

- 루트 `README.md`: GitHub와 저장소 사용자를 위한 진입점
- 루트 `AGENTS.md`: Codex가 자동으로 읽는 프로젝트 지침
- `developer-site/content/blog/*.md`: 개발자 사이트가 빌드 시 읽는 게시물 데이터

Blog 게시물은 Markdown이지만 프로젝트 설명 문서가 아니라 애플리케이션 콘텐츠입니다. 이동하면 빌드 입력 경로가 바뀌므로 중앙 문서화 대상에서 제외합니다.

## Source of Truth

정보가 충돌하면 다음 순서로 판단합니다.

1. 사용자의 현재 작업 요구사항
2. `PRODUCT_REQUIREMENTS.md`의 제품 및 비즈니스 계약
3. 실제 소스 코드와 설정 파일의 현재 동작
4. 나머지 `docs/` 문서
5. 루트 `README.md`

요구사항과 코드가 다르면 문서나 코드를 임의로 덮어쓰지 않습니다. 차이를 확인하고 어느 쪽을 수정할지 결정합니다.

## 문서 관리 원칙

- 코드에서 추론하기 어려운 요구사항과 결정 이유를 우선 기록합니다.
- 함수나 클래스 구현을 그대로 복사해 문서를 만들지 않습니다.
- 같은 내용을 여러 문서에 중복하지 않고 원문 링크를 사용합니다.
- 제품 동작이 바뀌면 코드와 `PRODUCT_REQUIREMENTS.md`를 같은 작업에서 갱신합니다.
- 앱 구조나 배포 단위가 바뀌면 `PROJECT_STRUCTURE.md`와 `DECISIONS.md`를 갱신합니다.
- 검증 명령이나 콘텐츠 작성 절차가 바뀌면 `DEVELOPMENT_GUIDE.md`를 갱신합니다.
- 확인되지 않은 운영 환경, 계정, 개인정보는 사실처럼 기록하지 않습니다.

## 기준 상태

이 문서 세트는 2026-08-12의 저장소 상태를 기준으로 처음 작성했습니다. 버전과 스크립트의 최종 기준은 각 앱의 `package.json`입니다.
