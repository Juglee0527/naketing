import type { Metadata } from "next";
import Link from "next/link";

import { formatGuideDate, getAllGuides } from "@/lib/guides";
import { sharedOpenGraphImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "말하기 가이드",
  description: "자기소개, 면접, 발표와 퍼스널 브랜딩을 더 명확하게 전달하는 방법을 정리합니다.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Naketing 말하기 가이드",
    description: "자기소개, 면접, 발표와 퍼스널 브랜딩을 더 명확하게 전달하는 방법을 정리합니다.",
    url: "/guides",
    images: [sharedOpenGraphImage],
  },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="text-sm font-medium text-violet-300">Guides</p>
      <h1 className="mt-3 text-3xl font-bold">말하기와 자기표현 가이드</h1>
      <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
        자신을 짧고 분명하게 설명할 수 있도록 문제, 개선 원칙, 예시와 점검 기준을 함께 정리합니다.
      </p>

      <div className="mt-10 space-y-5">
        {guides.map((guide) => (
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6" key={guide.slug}>
            <time className="text-xs text-zinc-500" dateTime={guide.date}>
              {formatGuideDate(guide.date)}
            </time>
            <h2 className="mt-3 text-xl font-semibold">
              <Link className="hover:text-violet-300" href={`/guides/${guide.slug}`}>
                {guide.title}
              </Link>
            </h2>
            <p className="mt-3 leading-7 text-zinc-400">{guide.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="태그">
              {guide.tags.map((tag) => (
                <li className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
