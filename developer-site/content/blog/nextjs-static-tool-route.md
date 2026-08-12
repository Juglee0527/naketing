---
title: "Next.js 정적 export에서 도구형 동적 route 확장하기"
description: "정적 export를 유지하면서 동적 route에 브라우저 도구를 안전하게 추가한 구조와 검증 기준을 정리합니다."
date: 2026-08-12
tags: [Next.js, TypeScript, Static Export]
---

# 정적 export에서도 동적 route를 명시적으로 관리하기

이 사이트의 개발자 도구는 `/tools/[tool]` 하나의 동적 route를 공유합니다. 하지만 배포 결과는 런타임 서버가 없는 정적 파일이어야 합니다. 따라서 URL을 요청받은 뒤 서버에서 도구를 찾는 방식이 아니라, build 시점에 허용된 모든 경로를 미리 생성해야 합니다.

핵심은 **도구 정의를 한곳에서 관리하고 route 생성과 화면 렌더링이 같은 정의를 사용하게 만드는 것**입니다.

## 도구 목록을 단일 기준으로 사용하기

각 도구의 slug, 이름, 설명, 개인정보 안내를 `lib/tools.ts`에서 관리합니다. 목록 화면, sitemap, metadata, 정적 route가 이 배열을 함께 사용하므로 새 도구를 추가할 때 여러 위치에 같은 정보를 반복하지 않아도 됩니다.

```ts
export type ToolSlug =
  | "json-formatter"
  | "jwt-decoder"
  | "timestamp-converter";

export const tools = [
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Unix timestamp를 UTC와 한국 시간으로 변환합니다.",
  },
] as const;
```

slug를 단순한 `string` 대신 union type으로 제한하면 오타가 route 렌더링까지 전파되는 것을 컴파일 단계에서 줄일 수 있습니다.

## build 시점에 경로 생성하기

App Router의 `generateStaticParams`는 도구 정의에서 경로 목록을 만듭니다. `dynamicParams = false`를 함께 사용해 목록에 없는 경로는 404 계약으로 처리합니다.

```ts
export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}
```

이 구조에서는 Tool을 추가한 뒤 production build 결과에 새 경로가 표시되는지가 중요한 검증 기준입니다. route 파일만 만들어 놓고 `tools` 정의를 빠뜨리면 정적 결과물이 생성되지 않습니다.

## Client Component 경계를 작게 유지하기

도구 상세 페이지 전체를 Client Component로 만들 필요는 없습니다. metadata 생성, 도구 조회, 페이지 설명은 Server Component에 남기고 입력 상태와 Clipboard API가 필요한 실제 변환기만 Client Component로 분리합니다.

- route와 metadata는 서버 경계에서 구성합니다.
- 사용자 입력과 변환 상태는 작은 Client Component가 담당합니다.
- 서버 전송이 필요 없는 변환에는 API Route를 추가하지 않습니다.
- 화면에는 입력값이 브라우저 내부에서만 처리된다는 사실을 알립니다.

Timestamp Converter도 입력값을 외부로 보내지 않습니다. JavaScript의 `Date`와 `Intl.DateTimeFormat`만 사용하므로 새 라이브러리나 런타임 API가 필요하지 않습니다.

## 입력 단위를 추측하지 않기

Unix timestamp는 초와 밀리초가 모두 사용됩니다. 자릿수로 단위를 자동 추측하면 오래된 날짜나 매우 먼 날짜에서 잘못 판단할 수 있습니다. 이 도구는 Seconds와 Milliseconds를 사용자가 명시적으로 선택하게 합니다.

변환 전에는 다음 조건을 확인합니다.

- 빈 입력인지
- 부호를 포함한 정수 형식인지
- JavaScript의 안전한 정수 범위인지
- `Date`가 표현할 수 있는 범위인지

오류를 하나의 메시지로 뭉치지 않으면 사용자는 어떤 입력을 고쳐야 하는지 바로 알 수 있습니다.

## 완료 기준은 화면 동작까지 포함하기

정적 build 성공만으로 브라우저 도구가 완성되지는 않습니다. 이번 도구는 다음 항목을 실제 화면에서 확인했습니다.

- Seconds와 Milliseconds의 정상 변환
- UTC ISO 8601과 `Asia/Seoul` 결과
- 빈값, 소수, 범위를 벗어난 입력의 오류
- Current time, Copy, Clear 동작
- 모바일 너비에서 가로 스크롤이 생기지 않는지
- 브라우저 콘솔 오류가 없는지

정적 export라는 제약은 기능을 줄이기 위한 조건이 아닙니다. 데이터 기준과 Client Component 경계를 명확하게 만들면, 서버 없이도 도구를 예측 가능하게 확장할 수 있습니다.
