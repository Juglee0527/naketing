import Link from "next/link";

import { navigation, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="홈으로 이동">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white">
            JG
          </span>
          <span>
            <strong className="block text-sm text-white">{siteConfig.shortName}</strong>
            <span className="block text-xs text-slate-400">Web Developer</span>
          </span>
        </Link>

        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-violet-300" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

