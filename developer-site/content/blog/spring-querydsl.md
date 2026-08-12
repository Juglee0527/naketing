---
title: "Spring Data JPA와 QueryDSL을 함께 사용할 때의 기준"
description: "단순 조회와 동적 조회를 구분해 Repository 책임을 명확하게 유지하는 기준을 정리합니다."
date: 2026-08-10
tags: [Spring Boot, JPA, QueryDSL]
---

# Spring Data JPA와 QueryDSL의 역할 나누기

Spring Data JPA의 메서드 이름 기반 쿼리는 조건이 단순할 때 의도가 잘 드러납니다. 조건 조합이 늘어나기 시작하면 QueryDSL로 조회 책임을 옮기는 편이 변경 범위를 이해하기 쉽습니다.

## 선택 기준

- 고정된 단일 조건 조회는 Spring Data JPA를 사용합니다.
- 선택 조건이 조합되는 목록 조회는 QueryDSL을 사용합니다.
- 화면 요구사항에 종속된 조회 결과는 전용 응답 타입으로 반환합니다.

도구를 먼저 정하기보다 조회 조건의 복잡도와 반환 데이터의 책임을 먼저 확인하는 것이 중요합니다.

