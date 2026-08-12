import type { Metadata } from "next";
import Link from "next/link";

import { AdSenseSiteScript } from "@/components/adsense-site-script";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="bg-zinc-950 text-white">
        <AdSenseSiteScript />
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-zinc-800 bg-zinc-950/90">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500 text-xs font-bold">
                  N
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-semibold md:text-base">Naketing</span>
                  <span className="text-[11px] text-zinc-400 md:text-xs">나를 마케팅하다</span>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-300 sm:gap-5 sm:text-sm">
                <Link href="/program" className="hover:text-violet-300">
                  프로그램 소개
                </Link>
                <Link href="/guides" className="hover:text-violet-300">
                  가이드
                </Link>
                <Link href="/tools" className="hover:text-violet-300">
                  도구
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex flex-1">{children}</main>

          <footer className="border-t border-zinc-800 bg-zinc-950/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p>© {new Date().getFullYear()} Naketing. Made by Junggeun Lee.</p>
              <nav className="flex gap-4" aria-label="하단 메뉴">
                <Link href="/privacy" className="hover:text-violet-300">
                  개인정보 처리방침
                </Link>
                <Link href="/contact" className="hover:text-violet-300">
                  문의
                </Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
