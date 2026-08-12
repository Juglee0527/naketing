import type { Metadata } from "next";
import Link from "next/link";

import { tools } from "@/lib/tools";
import { sharedOpenGraphImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "무료 말하기 도구",
  description: "자기소개와 발표 원고를 브라우저에서 점검할 수 있는 무료 도구입니다.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Naketing 무료 말하기 도구",
    description: "자기소개와 발표 원고를 브라우저에서 점검할 수 있는 무료 도구입니다.",
    url: "/tools",
    images: [sharedOpenGraphImage],
  },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="text-sm font-medium text-violet-300">Tools</p>
      <h1 className="mt-3 text-3xl font-bold">무료 말하기 도구</h1>
      <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
        자기소개와 발표 원고를 직접 점검할 수 있습니다. 입력한 내용은 외부 서버로 전송하지 않습니다.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6" key={tool.slug}>
            <h2 className="text-xl font-semibold">{tool.name}</h2>
            <p className="mt-3 leading-7 text-zinc-400">{tool.description}</p>
            <p className="mt-4 text-sm leading-6 text-emerald-300">{tool.privacyNote}</p>
            <Link
              className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
              href={`/tools/${tool.slug}`}
            >
              도구 열기
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
