import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IntroductionLengthChecker } from "@/components/introduction-length-checker";
import { SpeechTimeCalculator } from "@/components/speech-time-calculator";
import { getTool, tools, type ToolSlug } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}

function renderTool(toolSlug: ToolSlug) {
  switch (toolSlug) {
    case "speech-time-calculator":
      return <SpeechTimeCalculator />;
    case "introduction-length-checker":
      return <IntroductionLengthChecker />;
  }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return { title: "도구를 찾을 수 없습니다" };
  }

  const canonicalPath = `/tools/${tool.slug}`;
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url: canonicalPath,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link className="text-sm font-medium text-violet-300 hover:text-violet-200" href="/tools">
        ← 도구 목록
      </Link>
      <header className="mt-8">
        <p className="text-sm font-medium text-violet-300">Browser-only tool</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{tool.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{tool.description}</p>
        <p className="mt-3 text-sm leading-6 text-emerald-300">{tool.privacyNote}</p>
      </header>

      <div className="mt-8">{renderTool(tool.slug)}</div>

      <section className="mt-14 border-t border-zinc-800 pt-10" aria-labelledby="tool-usage-heading">
        <p className="text-sm font-medium text-violet-300">How to use</p>
        <h2 className="mt-2 text-2xl font-bold" id="tool-usage-heading">
          이렇게 사용하세요
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {tool.usageSteps.map((step, index) => (
            <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5" key={step}>
              <span className="text-xs font-bold text-violet-300">0{index + 1}</span>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-8 border-t border-zinc-800 pt-10 md:grid-cols-2" aria-labelledby="tool-method-heading">
        <div>
          <p className="text-sm font-medium text-violet-300">Method</p>
          <h2 className="mt-2 text-2xl font-bold" id="tool-method-heading">
            계산 기준
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
            {tool.method.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link className="mt-5 inline-flex text-sm font-semibold text-violet-300 hover:text-violet-200" href="/methodology">
            전체 점검 기준과 한계 →
          </Link>
        </div>
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6">
          <p className="text-sm font-semibold text-violet-200">계산 예시</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-zinc-500">입력 조건</dt>
              <dd className="mt-1 leading-6 text-zinc-200">{tool.example.input}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">예상 결과</dt>
              <dd className="mt-1 leading-6 text-zinc-200">{tool.example.result}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="tool-limitations-heading">
        <p className="text-sm font-medium text-amber-300">Before using the result</p>
        <h2 className="mt-2 text-2xl font-bold" id="tool-limitations-heading">
          결과를 해석할 때 확인하세요
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
          {tool.limitations.map((item) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-1 text-amber-300">△</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <p className="text-sm font-semibold text-emerald-300">다음 단계</p>
        <h2 className="mt-3 text-xl font-bold">계산 결과를 자기소개 수정으로 연결하세요</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          시간과 분량을 확인했다면 원고의 구조와 표현도 함께 점검해 보세요. 자기소개 프로그램에서는 상황을 정하고
          원고를 작성한 뒤 수정 순서까지 확인할 수 있습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
            href="/program"
          >
            자기소개 프로그램 시작
          </Link>
          <Link
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            href={`/guides/${tool.relatedGuide.slug}`}
          >
            {tool.relatedGuide.title}
          </Link>
        </div>
      </aside>
    </div>
  );
}
