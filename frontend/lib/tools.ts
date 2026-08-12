export type ToolSlug = "speech-time-calculator" | "introduction-length-checker";

export interface ToolDefinition {
  slug: ToolSlug;
  name: string;
  description: string;
  privacyNote: string;
  usageSteps: readonly string[];
  method: readonly string[];
  example: {
    input: string;
    result: string;
  };
  limitations: readonly string[];
  relatedGuide: {
    slug: string;
    title: string;
  };
}

export const tools: readonly ToolDefinition[] = [
  {
    slug: "speech-time-calculator",
    name: "말하기 시간 계산기",
    description: "원고의 공백 제외 글자 수와 발화 속도로 예상 말하기 시간을 계산합니다.",
    privacyNote: "입력한 원고는 서버로 전송하거나 저장하지 않고 브라우저에서만 계산합니다.",
    usageSteps: [
      "발표, 면접 답변 또는 자기소개 원고를 입력합니다.",
      "실제 말하는 습관과 가까운 느리게, 보통 또는 빠르게 속도를 선택합니다.",
      "예상 시간과 글자 수를 확인한 뒤 직접 소리 내어 읽으며 차이를 비교합니다.",
    ],
    method: [
      "띄어쓰기와 줄바꿈을 제외한 글자 수를 계산합니다.",
      "느리게는 분당 240자, 보통은 300자, 빠르게는 360자를 기준으로 사용합니다.",
      "글자 수를 선택한 분당 글자 수로 나누고 초 단위로 반올림합니다.",
    ],
    example: {
      input: "공백 제외 300자의 원고를 보통 속도로 선택",
      result: "예상 말하기 시간 약 1분",
    },
    limitations: [
      "문장 사이의 쉼, 강조, 호흡과 청중 반응은 계산에 포함하지 않습니다.",
      "고유명사, 외국어와 숫자가 많은 원고는 실제 발화 시간이 더 길 수 있습니다.",
      "최종 시간은 원고를 실제로 읽고 측정한 값과 함께 판단해야 합니다.",
    ],
    relatedGuide: {
      slug: "shorten-long-interview-answers",
      title: "길어진 면접 답변을 짧게 줄이는 방법",
    },
  },
  {
    slug: "introduction-length-checker",
    name: "자기소개 분량 점검기",
    description: "30초, 1분 또는 3분 목표와 비교해 자기소개 원고의 예상 분량을 점검합니다.",
    privacyNote: "입력한 자기소개는 서버로 전송하거나 저장하지 않고 브라우저에서만 점검합니다.",
    usageSteps: [
      "30초, 1분 또는 3분 중 실제 자기소개 목표 시간을 선택합니다.",
      "발화 속도를 선택하고 준비한 자기소개 원고를 입력합니다.",
      "짧음, 적정 또는 김 판정과 권장 글자 수 범위를 확인해 원고를 조정합니다.",
    ],
    method: [
      "선택한 목표 시간의 ±10%를 적정 범위로 사용하며 최소 허용 폭은 3초입니다.",
      "발화 속도별 분당 글자 수로 적정 시간의 최소·최대 글자 수를 추정합니다.",
      "현재 원고의 예상 시간이 적정 범위보다 작거나 큰지 비교합니다.",
    ],
    example: {
      input: "1분 목표, 보통 속도, 공백 제외 300자의 자기소개",
      result: "적정 범위 270~330자 안에 있어 약 1분으로 판정",
    },
    limitations: [
      "적정 판정은 내용의 설득력이나 경험의 사실 여부를 평가하지 않습니다.",
      "쉼, 말 더듬음, 강조와 현장 질문에 따라 실제 시간은 달라질 수 있습니다.",
      "분량을 맞춘 뒤에는 핵심 주장과 경험 근거가 있는지 별도로 점검해야 합니다.",
    ],
    relatedGuide: {
      slug: "30-second-self-introduction",
      title: "30초 자기소개를 짧고 분명하게 만드는 방법",
    },
  },
] as const;

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}
