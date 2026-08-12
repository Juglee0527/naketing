const defaultSiteUrl = "https://www.naketing.co.kr";

export const siteConfig = {
  name: "Naketing",
  title: "Naketing - 나케팅",
  description: "말하기, 자기소개와 퍼스널 브랜딩을 더 명확하게 표현하도록 돕는 가이드와 도구를 제공합니다.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/+$/, ""),
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
