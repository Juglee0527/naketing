export type ToolSlug = "speech-time-calculator" | "introduction-length-checker";

export interface ToolDefinition {
  slug: ToolSlug;
  name: string;
  description: string;
  privacyNote: string;
}

export const tools: readonly ToolDefinition[] = [
  {
    slug: "speech-time-calculator",
    name: "말하기 시간 계산기",
    description: "원고의 공백 제외 글자 수와 발화 속도로 예상 말하기 시간을 계산합니다.",
    privacyNote: "입력한 원고는 서버로 전송하거나 저장하지 않고 브라우저에서만 계산합니다.",
  },
  {
    slug: "introduction-length-checker",
    name: "자기소개 분량 점검기",
    description: "30초, 1분 또는 3분 목표와 비교해 자기소개 원고의 예상 분량을 점검합니다.",
    privacyNote: "입력한 자기소개는 서버로 전송하거나 저장하지 않고 브라우저에서만 점검합니다.",
  },
] as const;

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}
