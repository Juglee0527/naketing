import { describe, expect, it } from "vitest";

import { analyzeIntroduction } from "./introduction-analysis";
import { compareIntroductionResults } from "./introduction-comparison";

describe("compareIntroductionResults", () => {
  it("compares visible metrics and structure changes against the first result", () => {
    const baseline = analyzeIntroduction(
      "저는 그냥 개발자입니다. 프로젝트를 진행했습니다. 사실 프로젝트는 중요합니다.",
      "normal",
      60,
    );
    const current = analyzeIntroduction(
      "저는 웹 개발자입니다. 프로젝트에서 결제 오류를 해결했고 처리 흐름을 개선했습니다. 안정적인 서비스에 기여하겠습니다.",
      "normal",
      60,
    );

    expect(baseline).not.toBeNull();
    expect(current).not.toBeNull();
    expect(compareIntroductionResults(baseline!, current!)).toMatchObject({
      fillerDifference: -2,
      resolvedStructureLabels: expect.arrayContaining(["결과 또는 성과", "마무리"]),
      newlyMissingStructureLabels: [],
    });
  });

  it("reports a structure clue that disappeared after revision", () => {
    const baseline = analyzeIntroduction("저는 웹 개발자입니다. 서비스에 기여하겠습니다.", "normal", 60);
    const current = analyzeIntroduction("프로젝트 경험이 있습니다.", "normal", 60);

    expect(compareIntroductionResults(baseline!, current!)).toMatchObject({
      resolvedStructureLabels: ["경험 근거"],
      newlyMissingStructureLabels: expect.arrayContaining(["자기 정의", "마무리"]),
    });
  });
});
