export type SpeechPace = "slow" | "normal" | "fast";
export type SpeechTargetDuration = 30 | 60 | 180;
export type SpeechLengthStatus = "short" | "appropriate" | "long";

export interface PaceDefinition {
  label: string;
  charactersPerMinute: number;
}

export interface SpeechTimeResult {
  characterCount: number;
  wordCount: number;
  totalSeconds: number;
}

export interface SpeechLengthAssessment extends SpeechTimeResult {
  status: SpeechLengthStatus;
  targetSeconds: SpeechTargetDuration;
  toleranceSeconds: number;
  minimumCharacters: number;
  maximumCharacters: number;
  differenceSeconds: number;
}

export const paceDefinitions: Record<SpeechPace, PaceDefinition> = {
  slow: { label: "느리게", charactersPerMinute: 240 },
  normal: { label: "보통", charactersPerMinute: 300 },
  fast: { label: "빠르게", charactersPerMinute: 360 },
};

export function countSpeechCharacters(value: string): number {
  return Array.from(value.replace(/\s/g, "")).length;
}

export function countSpeechWords(value: string): number {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue.split(/\s+/).length : 0;
}

export function calculateSpeechTime(value: string, pace: SpeechPace): SpeechTimeResult | null {
  const characterCount = countSpeechCharacters(value);
  if (characterCount === 0) {
    return null;
  }

  const totalSeconds = Math.max(
    1,
    Math.round((characterCount / paceDefinitions[pace].charactersPerMinute) * 60),
  );

  return {
    characterCount,
    wordCount: countSpeechWords(value),
    totalSeconds,
  };
}

export function assessSpeechLength(
  value: string,
  pace: SpeechPace,
  targetSeconds: SpeechTargetDuration,
): SpeechLengthAssessment | null {
  const speechTime = calculateSpeechTime(value, pace);
  if (!speechTime) {
    return null;
  }

  const toleranceSeconds = Math.max(3, Math.round(targetSeconds * 0.1));
  const minimumSeconds = targetSeconds - toleranceSeconds;
  const maximumSeconds = targetSeconds + toleranceSeconds;
  const charactersPerMinute = paceDefinitions[pace].charactersPerMinute;
  const minimumCharacters = Math.round((minimumSeconds / 60) * charactersPerMinute);
  const maximumCharacters = Math.round((maximumSeconds / 60) * charactersPerMinute);
  const status: SpeechLengthStatus =
    speechTime.characterCount < minimumCharacters
      ? "short"
      : speechTime.characterCount > maximumCharacters
        ? "long"
        : "appropriate";

  return {
    ...speechTime,
    status,
    targetSeconds,
    toleranceSeconds,
    minimumCharacters,
    maximumCharacters,
    differenceSeconds: speechTime.totalSeconds - targetSeconds,
  };
}

export function formatSpeechDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}
