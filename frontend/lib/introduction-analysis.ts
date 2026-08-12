import {
  calculateSpeechTime,
  paceDefinitions,
  type SpeechPace,
  type SpeechTimeResult,
} from "./speech-time";

export type TargetDuration = 30 | 60 | 180;
export type LengthStatus = "short" | "appropriate" | "long";
export type StructureCheckId = "identity" | "experience" | "outcome" | "closing";

export interface PhraseFinding {
  phrase: string;
  count: number;
  indices: number[];
}

export interface RepeatedWordFinding {
  word: string;
  count: number;
}

export interface SentenceFinding {
  text: string;
  characterCount: number;
}

export interface StructureCheck {
  id: StructureCheckId;
  label: string;
  description: string;
  met: boolean;
}

export interface IntroductionAnalysisResult extends SpeechTimeResult {
  targetSeconds: TargetDuration;
  toleranceSeconds: number;
  minimumCharacters: number;
  maximumCharacters: number;
  lengthStatus: LengthStatus;
  differenceSeconds: number;
  sentenceCount: number;
  averageSentenceCharacters: number;
  longSentences: SentenceFinding[];
  fillerPhrases: PhraseFinding[];
  repeatedWords: RepeatedWordFinding[];
  structureChecks: StructureCheck[];
}

const fillerPhraseCandidates = [
  "개인적으로",
  "솔직히",
  "어쨌든",
  "일단",
  "사실",
  "약간",
  "그냥",
  "뭔가",
  "열심히",
] as const;

const repeatedWordStopWords = new Set([
  "그리고",
  "그래서",
  "하지만",
  "저는",
  "제가",
  "저의",
  "나는",
  "나의",
  "합니다",
  "했습니다",
  "있습니다",
  "것입니다",
  "때문에",
  "통해",
]);

const structureDefinitions: Array<Omit<StructureCheck, "met"> & { pattern: RegExp }> = [
  {
    id: "identity",
    label: "자기 정의",
    description: "역할, 직무 또는 자신을 설명하는 문장이 있는지 확인합니다.",
    pattern: /(저는|나는|제가|저의|제 역할|제 직무|전공|개발자|기획자|디자이너|마케터|엔지니어)/,
  },
  {
    id: "experience",
    label: "경험 근거",
    description: "주장을 뒷받침하는 경험이나 행동이 있는지 확인합니다.",
    pattern: /(경험|프로젝트|업무|담당|진행|수행|근무|활동|개발|기획|운영|해결)/,
  },
  {
    id: "outcome",
    label: "결과 또는 성과",
    description: "숫자나 변화처럼 확인 가능한 결과가 있는지 확인합니다.",
    pattern: /(\d[\d,.]*\s*(?:%|명|개|건|회|배|원|개월|년|일|시간|분)|성과|결과|개선|증가|감소|달성|절감|수상|기여)/,
  },
  {
    id: "closing",
    label: "마무리",
    description: "지원 목적, 기여 방향 또는 분명한 결론이 있는지 확인합니다.",
    pattern: /(기여하겠습니다|하겠습니다|되고 싶습니다|목표입니다|지원했습니다|잘 부탁드립니다|감사합니다|강점입니다)[.!?。！？]?\s*$/,
  },
];

function findAllIndices(source: string, phrase: string): number[] {
  const indices: number[] = [];
  let startIndex = 0;

  while (startIndex < source.length) {
    const index = source.indexOf(phrase, startIndex);
    if (index === -1) {
      break;
    }

    indices.push(index);
    startIndex = index + phrase.length;
  }

  return indices;
}

function splitSentences(source: string): string[] {
  return Array.from(source.matchAll(/[^.!?。！？\n]+[.!?。！？]?/g), (match) => match[0].trim()).filter(Boolean);
}

function countVisibleCharacters(source: string): number {
  return Array.from(source.replace(/\s/g, "")).length;
}

function findFillerPhrases(source: string): PhraseFinding[] {
  return fillerPhraseCandidates.flatMap((phrase) => {
    const indices = findAllIndices(source, phrase);
    return indices.length > 0 ? [{ phrase, count: indices.length, indices }] : [];
  });
}

function findRepeatedWords(source: string): RepeatedWordFinding[] {
  const counts = new Map<string, number>();
  const words = source
    .toLocaleLowerCase("ko-KR")
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((word) => word.length >= 2 && !repeatedWordStopWords.has(word));

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count >= 3)
    .map(([word, count]) => ({ word, count }))
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word, "ko"))
    .slice(0, 8);
}

export function analyzeIntroduction(
  script: string,
  pace: SpeechPace,
  targetSeconds: TargetDuration,
): IntroductionAnalysisResult | null {
  const speechTime = calculateSpeechTime(script, pace);
  if (!speechTime) {
    return null;
  }

  const toleranceSeconds = Math.max(3, Math.round(targetSeconds * 0.1));
  const minimumSeconds = targetSeconds - toleranceSeconds;
  const maximumSeconds = targetSeconds + toleranceSeconds;
  const charactersPerMinute = paceDefinitions[pace].charactersPerMinute;
  const minimumCharacters = Math.round((minimumSeconds / 60) * charactersPerMinute);
  const maximumCharacters = Math.round((maximumSeconds / 60) * charactersPerMinute);
  const lengthStatus: LengthStatus =
    speechTime.totalSeconds < minimumSeconds
      ? "short"
      : speechTime.totalSeconds > maximumSeconds
        ? "long"
        : "appropriate";
  const sentences = splitSentences(script);
  const sentenceFindings = sentences.map((text) => ({
    text,
    characterCount: countVisibleCharacters(text),
  }));

  return {
    ...speechTime,
    targetSeconds,
    toleranceSeconds,
    minimumCharacters,
    maximumCharacters,
    lengthStatus,
    differenceSeconds: speechTime.totalSeconds - targetSeconds,
    sentenceCount: sentences.length,
    averageSentenceCharacters:
      sentences.length === 0 ? 0 : Math.round(sentenceFindings.reduce((sum, sentence) => sum + sentence.characterCount, 0) / sentences.length),
    longSentences: sentenceFindings.filter((sentence) => sentence.characterCount >= 55),
    fillerPhrases: findFillerPhrases(script),
    repeatedWords: findRepeatedWords(script),
    structureChecks: structureDefinitions.map(({ pattern, ...definition }) => ({
      ...definition,
      met: pattern.test(script),
    })),
  };
}
