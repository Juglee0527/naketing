import { describe, expect, it } from "vitest";

import { applyIntroductionDraft, createIntroductionDraft } from "./introduction-draft";

describe("createIntroductionDraft", () => {
  it("combines non-empty answers in the writing order", () => {
    expect(
      createIntroductionDraft({
        identity: "저는 웹 개발자입니다",
        situation: "결제 오류를 분석했습니다.",
        focus: "처리 흐름을 개선했습니다",
        closing: "안정적인 서비스에 기여하겠습니다!",
      }),
    ).toBe(
      "저는 웹 개발자입니다. 결제 오류를 분석했습니다. 처리 흐름을 개선했습니다. 안정적인 서비스에 기여하겠습니다!",
    );
  });

  it("ignores empty answers and normalizes whitespace", () => {
    expect(
      createIntroductionDraft({
        identity: "  저는   기획자입니다  ",
        situation: "",
        focus: "  사용자 문제를 정리합니다 ",
        closing: "   ",
      }),
    ).toBe("저는 기획자입니다. 사용자 문제를 정리합니다.");
  });
});

describe("applyIntroductionDraft", () => {
  const answers = {
    identity: "저는 개발자입니다",
    situation: "",
    focus: "",
    closing: "",
  };

  it("does not overwrite an existing script", () => {
    expect(applyIntroductionDraft("기존 원고입니다.", answers)).toEqual({
      status: "existing-script",
      script: "기존 원고입니다.",
    });
  });

  it("reports an empty draft without changing the script", () => {
    expect(
      applyIntroductionDraft("", { identity: "", situation: "", focus: "", closing: "" }),
    ).toEqual({ status: "empty-draft", script: "" });
  });
});
