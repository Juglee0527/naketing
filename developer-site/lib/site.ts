export const siteConfig = {
  name: "이정근 | Web Developer",
  shortName: "이정근.dev",
  description:
    "Web Developer 이정근의 개발 블로그, 프로젝트 기록, 브라우저 기반 개발자 도구를 제공합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev.naketing.co.kr",
  githubUrl: "https://github.com/Juglee0527",
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
] as const;

export function absoluteUrl(path: string): string {
  const url = new URL(path, siteConfig.url);
  const hasFileExtension = /\/[^/]+\.[^/]+$/.test(url.pathname);

  if (!hasFileExtension && !url.pathname.endsWith("/")) {
    url.pathname += "/";
  }

  return url.toString();
}
