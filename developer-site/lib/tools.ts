export type ToolSlug = "json-formatter" | "jwt-decoder";

export interface ToolDefinition {
  slug: ToolSlug;
  name: string;
  description: string;
  privacyNote: string;
}

export const tools: readonly ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "JSON을 읽기 좋게 정렬하거나 한 줄로 압축합니다.",
    privacyNote: "입력한 JSON은 서버로 전송되지 않고 브라우저에서만 처리됩니다.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "JWT의 Header와 Payload를 디코딩하고 만료 정보를 확인합니다.",
    privacyNote: "입력한 JWT는 서버로 전송되지 않고 브라우저에서만 처리됩니다.",
  },
] as const;

export function getTool(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

