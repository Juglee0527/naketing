const defaultSiteUrl = "https://www.naketing.co.kr";

export const siteConfig = {
  name: "Naketing",
  title: "Naketing - 나케팅",
  description: "말하기, 자기소개와 퍼스널 브랜딩을 더 명확하게 표현하도록 돕는 가이드와 도구를 제공합니다.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/+$/, ""),
  author: {
    name: "이정근",
    description: "Naketing을 만들고 말하기와 자기표현 가이드를 작성합니다.",
  },
} as const;

export const sharedOpenGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Naketing - 나를 설명하는 말을 직접 쓰고 점검하는 서비스",
} as const;

export const sharedTwitterImage = {
  url: "/twitter-image",
  width: 1200,
  height: 630,
  alt: sharedOpenGraphImage.alt,
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
