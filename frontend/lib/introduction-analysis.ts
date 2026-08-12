import {
  assessSpeechLength,
  type SpeechLengthAssessment,
  type SpeechLengthStatus,
  type SpeechPace,
  type SpeechTargetDuration,
} from "./speech-time";

export type TargetDuration = SpeechTargetDuration;
export type LengthStatus = SpeechLengthStatus;
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

export interface IntroductionAction {
  id: string;
  title: string;
  description: string;
}

export interface IntroductionAnalysisResult extends SpeechLengthAssessment {
  lengthStatus: LengthStatus;
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
    pattern: /(경험|프로젝트|업무|담당|진행|수행|근무|활동|개발(?:했|한|하며|하고|해|을|된| 중)|기획(?:했|한|하며|하고|해|을|된| 중)|운영(?:했|한|하며|하고|해|을|된| 중)|해결)/,
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

const structureActionTitles: Record<StructureCheckId, string> = {
  identity: "자기 정의를 한 문장으로 보완하세요",
  experience: "경험 근거를 한 문장으로 보완하세요",
  outcome: "결과 또는 성과를 한 문장으로 보완하세요",
  closing: "마무리를 한 문장으로 보완하세요",
};

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
  const lengthAssessment = assessSpeechLength(script, pace, targetSeconds);
  if (!lengthAssessment) {
    return null;
  }

  const sentences = splitSentences(script);
  const sentenceFindings = sentences.map((text) => ({
    text,
    characterCount: countVisibleCharacters(text),
  }));

  return {
    ...lengthAssessment,
    lengthStatus: lengthAssessment.status,
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

export function getIntroductionActions(result: IntroductionAnalysisResult): IntroductionAction[] {
  const actions: IntroductionAction[] = [];

  if (result.lengthStatus === "long") {
    actions.push({
      id: "length-long",
      title: "핵심과 직접 연결되지 않는 문장을 줄이세요",
      description: `목표보다 약 ${result.differenceSeconds}초 깁니다. ${result.maximumCharacters}자 안쪽을 기준으로 반복 설명부터 덜어보세요.`,
    });
  } else if (result.lengthStatus === "short") {
    actions.push({
      id: "length-short",
      title: "주장을 뒷받침할 근거를 보완하세요",
      description: `목표보다 약 ${Math.abs(result.differenceSeconds)}초 짧습니다. 경험에서 직접 한 행동이나 결과를 한 문장 추가해 보세요.`,
    });
  }

  if (result.fillerPhrases.length > 0) {
    const count = result.fillerPhrases.reduce((sum, finding) => sum + finding.count, 0);
    actions.push({
      id: "filler",
      title: "점검 후보 표현을 문장에서 빼고 다시 읽어보세요",
      description: `${count}곳이 표시됐습니다. 표현을 빼도 뜻이 유지되면 삭제하고, 필요한 경우 더 구체적인 말로 바꾸세요.`,
    });
  }

  if (result.repeatedWords.length > 0) {
    actions.push({
      id: "repetition",
      title: "같은 단어가 가까이 반복되는지 확인하세요",
      description: `반복이 많은 단어는 ${result.repeatedWords.map((finding) => `${finding.word} ${finding.count}회`).join(", ")}입니다. 꼭 필요한 반복만 남겨보세요.`,
    });
  }

  if (result.longSentences.length > 0) {
    actions.push({
      id: "sentence-length",
      title: "긴 문장을 핵심과 근거로 나누세요",
      description: `공백 제외 55자 이상 문장이 ${result.longSentences.length}개 있습니다. 접속어 앞이나 행동과 결과 사이에서 문장을 나눠보세요.`,
    });
  }

  for (const check of result.structureChecks.filter((item) => !item.met)) {
    actions.push({
      id: `structure-${check.id}`,
      title: structureActionTitles[check.id],
      description: check.description,
    });
  }

  actions.push({
    id: "read-aloud",
    title: "마지막으로 소리 내어 읽어보세요",
    description: "쉼, 강조와 발음 습관은 글자 수만으로 확인할 수 없습니다. 실제로 읽으며 어색한 호흡을 표시하세요.",
  });

  return actions;
}
