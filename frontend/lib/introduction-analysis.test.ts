import { describe, expect, it } from "vitest";

import { analyzeIntroduction } from "./introduction-analysis";

describe("analyzeIntroduction", () => {
  it("returns null for an empty script", () => {
    expect(analyzeIntroduction("  \n ", "normal", 60)).toBeNull();
  });

  it("calculates length boundaries from the selected pace and target", () => {
    const result = analyzeIntroduction("가".repeat(300), "normal", 60);

    expect(result).toMatchObject({
      characterCount: 300,
      totalSeconds: 60,
      targetSeconds: 60,
      toleranceSeconds: 6,
      minimumCharacters: 270,
      maximumCharacters: 330,
      lengthStatus: "appropriate",
      differenceSeconds: 0,
    });
  });

  it("finds filler phrases, repeated words and long sentences", () => {
    const longSentence = "저는 그냥 프로젝트 경험을 바탕으로 사용자 문제를 해결하고 결과를 개선하는 개발자이며 협업 과정에서도 끝까지 책임을 다해 목표를 달성했습니다.";
    const result = analyzeIntroduction(`${longSentence} 사실 프로젝트 프로젝트 프로젝트를 진행했습니다.`, "normal", 60);

    expect(result?.fillerPhrases).toEqual([
      { phrase: "사실", count: 1, indices: [longSentence.length + 1] },
      { phrase: "그냥", count: 1, indices: [3] },
    ]);
    expect(result?.repeatedWords).toContainEqual({ word: "프로젝트", count: 3 });
    expect(result?.longSentences[0]).toMatchObject({ text: longSentence });
  });

  it("checks identity, experience, outcome and closing indicators", () => {
    const completeScript =
      "저는 웹 개발자입니다. 프로젝트에서 결제 오류를 해결했고 처리 시간을 30% 개선했습니다. 팀에 안정적으로 기여하겠습니다.";
    const incompleteScript = "안녕하세요. 성실하게 배우겠습니다.";

    expect(analyzeIntroduction(completeScript, "normal", 60)?.structureChecks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "identity", met: true }),
        expect.objectContaining({ id: "experience", met: true }),
        expect.objectContaining({ id: "outcome", met: true }),
        expect.objectContaining({ id: "closing", met: true }),
      ]),
    );
    expect(analyzeIntroduction(incompleteScript, "normal", 60)?.structureChecks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "identity", met: false }),
        expect.objectContaining({ id: "experience", met: false }),
        expect.objectContaining({ id: "outcome", met: false }),
        expect.objectContaining({ id: "closing", met: false }),
      ]),
    );
  });

  it("splits punctuation and line breaks into sentences", () => {
    const result = analyzeIntroduction("첫 문장입니다. 둘째 문장입니다!\n마지막 문장입니다", "normal", 30);

    expect(result?.sentenceCount).toBe(3);
    expect(result?.averageSentenceCharacters).toBeGreaterThan(0);
  });
});
