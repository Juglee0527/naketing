export type SpeechPace = "slow" | "normal" | "fast";

export interface PaceDefinition {
  label: string;
  charactersPerMinute: number;
}

export interface SpeechTimeResult {
  characterCount: number;
  wordCount: number;
  totalSeconds: number;
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

export function formatSpeechDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}
