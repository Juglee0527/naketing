import Link from "next/link";

import { formatGuideDate, getAllGuides } from "@/lib/guides";
import { tools } from "@/lib/tools";

export default function Home() {
  const guides = getAllGuides();
  const recentGuides = guides.slice(0, 3);
  const mainSections = [
    {
      number: "01",
      title: "프로그램 소개",
      description: "나를 설명하는 힘을 기르기 위해 Naketing이 다루는 문제와 프로그램 방향을 확인합니다.",
      href: "/program",
      linkLabel: "프로그램 알아보기",
    },
    {
      number: "02",
      title: "가이드",
      description: `자기소개, 면접과 발표에 바로 적용할 수 있는 ${guides.length}개의 가이드를 읽습니다.`,
      href: "/guides",
      linkLabel: "가이드 전체 보기",
    },
    {
      number: "03",
      title: "도구",
      description: `원고 분량과 예상 발화 시간을 직접 점검하는 ${tools.length}개의 무료 도구를 사용합니다.`,
      href: "/tools",
      linkLabel: "도구 전체 보기",
    },
  ] as const;

  return (
    <div className="w-full">
      <section className="border-b border-zinc-800">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] md:items-center md:px-6 md:py-28">
          <div>
            <p className="text-sm font-semibold tracking-wide text-violet-300">
              말하기 · 자기소개 · 퍼스널 브랜딩
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              나를 설명하는 말,
              <br />
              <span className="text-violet-400">더 짧고 분명하게.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              Naketing은 자기소개와 발표에서 핵심을 놓치지 않도록 실전 가이드와 브라우저 기반
              도구를 제공합니다. 읽고, 직접 점검하고, 필요한 표현부터 고쳐보세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/guides"
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                가이드부터 읽기
              </Link>
              <Link
                href="/program"
                className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900"
              >
                프로그램 알아보기
              </Link>
            </div>
          </div>

          <aside className="border-l-2 border-violet-500 pl-6 md:pl-8" aria-label="현재 제공 기능">
            <p className="text-sm font-semibold text-zinc-200">지금 이용할 수 있습니다</p>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-3xl font-bold text-white">{guides.length}</dt>
                <dd className="mt-1 text-sm text-zinc-400">직접 작성한 말하기 가이드</dd>
              </div>
              <div>
                <dt className="text-3xl font-bold text-white">{tools.length}</dt>
                <dd className="mt-1 text-sm text-zinc-400">설치 없이 쓰는 무료 도구</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-emerald-300">브라우저 안에서 처리</dt>
                <dd className="mt-1 text-sm leading-6 text-zinc-400">도구에 입력한 원고를 서버로 보내지 않습니다.</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="text-sm font-medium text-violet-300">Explore Naketing</p>
          <h2 className="mt-2 text-2xl font-bold">세 가지 영역에서 필요한 것만 찾으세요</h2>
          <div className="mt-9 grid border-y border-zinc-800 md:grid-cols-3">
            {mainSections.map((section, index) => (
              <article
                className={`py-7 md:px-7 ${index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""}`}
                key={section.href}
              >
                <p className="text-xs font-semibold text-violet-300">{section.number}</p>
                <h3 className="mt-3 text-xl font-semibold">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{section.description}</p>
                <Link
                  className="mt-5 inline-flex text-sm font-semibold text-violet-300 hover:text-violet-200"
                  href={section.href}
                >
                  {section.linkLabel} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
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
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-violet-300">Browser-only tools</p>
              <h2 className="mt-2 text-2xl font-bold">바로 써보는 무료 도구</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                입력한 원고는 외부 서버로 전송하지 않고 현재 브라우저 안에서만 계산합니다.
              </p>
            </div>
            <Link className="text-sm text-violet-300 hover:text-violet-200" href="/tools">
              전체 보기 →
            </Link>
          </div>

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
