import { describe, expect, it } from "vitest";

import { assessSpeechLength, calculateSpeechTime } from "./speech-time";

describe("calculateSpeechTime", () => {
  it("returns null when the script has no visible characters", () => {
    expect(calculateSpeechTime(" \n\t ", "normal")).toBeNull();
  });

  it("calculates the estimated duration from the selected pace", () => {
    expect(calculateSpeechTime("가".repeat(300), "normal")).toEqual({
      characterCount: 300,
      wordCount: 1,
      totalSeconds: 60,
    });
  });
});

describe("assessSpeechLength", () => {
  it("uses the same target boundary for every consumer", () => {
    expect(assessSpeechLength("가".repeat(300), "normal", 60)).toMatchObject({
      status: "appropriate",
      targetSeconds: 60,
      toleranceSeconds: 6,
      minimumCharacters: 270,
      maximumCharacters: 330,
      differenceSeconds: 0,
    });
  });

  it("classifies values outside the target boundary", () => {
    expect(assessSpeechLength("가".repeat(269), "normal", 60)?.status).toBe("short");
    expect(assessSpeechLength("가".repeat(331), "normal", 60)?.status).toBe("long");
  });
});
