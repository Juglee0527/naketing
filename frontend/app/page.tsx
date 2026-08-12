import Link from "next/link";

import { formatGuideDate, getAllGuides } from "@/lib/guides";
import { tools } from "@/lib/tools";

export default function Home() {
  const recentGuides = getAllGuides().slice(0, 3);

  return (
    <div className="w-full">
      <section className="border-b border-zinc-800">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-4xl flex-col justify-center space-y-6 px-4 py-16 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1 text-xs text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            말하기 & 퍼스널 브랜딩 서비스 준비 중
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            말을 바꾸면
            <br />
            <span className="text-violet-400">나를 바꿀 수 있습니다.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
            나케팅은 말하기·표현력·브랜딩 역량을 점검하고 개선할 수 있는 서비스를 준비하고
            있습니다. <span className="text-violet-300">“나를 어떻게 설명할 것인가”</span>에
            집중하여 현재 사용할 수 있는 가이드와 무료 도구부터 제공합니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/guides"
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 md:text-base"
            >
              가이드 읽기
            </Link>
            <Link
              href="/tools"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm text-zinc-200 hover:bg-zinc-900 md:text-base"
            >
              무료 도구 사용하기
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-300">Recent guides</p>
            <h2 className="mt-2 text-2xl font-bold">최근 말하기 가이드</h2>
          </div>
          <Link className="text-sm text-violet-300 hover:text-violet-200" href="/guides">
            전체 보기 →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {recentGuides.map((guide) => (
            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6" key={guide.slug}>
              <time className="text-xs text-zinc-500" dateTime={guide.date}>
                {formatGuideDate(guide.date)}
              </time>
              <h3 className="mt-3 text-lg font-semibold leading-7">
                <Link className="hover:text-violet-300" href={`/guides/${guide.slug}`}>
                  {guide.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{guide.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="text-sm font-medium text-violet-300">Browser-only tools</p>
          <h2 className="mt-2 text-2xl font-bold">무료 말하기 도구</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            입력한 원고는 외부 서버로 전송하지 않고 현재 브라우저 안에서만 계산합니다.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {tools.map((tool) => (
              <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6" key={tool.slug}>
                <h3 className="text-lg font-semibold">{tool.name}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{tool.description}</p>
                <Link
                  className="mt-5 inline-flex text-sm font-semibold text-violet-300 hover:text-violet-200"
                  href={`/tools/${tool.slug}`}
                >
                  도구 열기 →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
