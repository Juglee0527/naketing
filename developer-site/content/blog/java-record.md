---
title: "Java Record를 DTO에 적용하기 전에 확인할 점"
description: "불변 데이터 전달에 적합한 Java Record의 적용 범위와 주의할 경계를 살펴봅니다."
date: 2026-08-05
tags: [Java, Record, DTO]
---

# Java Record는 어디에 적합한가

Record는 값 전달 목적이 분명하고 생성 이후 값이 바뀌지 않는 응답 DTO에 잘 맞습니다. 다만 프레임워크가 기본 생성자나 setter를 요구하는 경계에서는 기존 class가 더 명확할 수 있습니다.

## 확인할 항목

- 직렬화와 역직렬화 방식
- Bean Validation 적용 위치
- 기존 매핑 코드와의 호환성
- 필드 추가가 호출부에 미치는 영향

새 문법이라는 이유만으로 일괄 변경하지 않고, 불변성이 실제 장점이 되는 경계부터 적용합니다.
