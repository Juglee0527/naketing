import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} 이정근. 기록하고 만들며 개선합니다.</p>
        <Link
          className="text-slate-300 hover:text-violet-300"
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}

