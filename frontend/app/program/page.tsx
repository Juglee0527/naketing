import type { Metadata } from "next";
import Link from "next/link";

import { IntroductionProgram } from "@/components/introduction-program";

export const metadata: Metadata = {
  title: "자기소개 점검 프로그램",
  description: "상황과 목표 시간을 정하고 자기소개 원고의 분량과 구조를 브라우저에서 직접 점검합니다.",
  alternates: { canonical: "/program" },
  openGraph: {
    title: "Naketing 자기소개 점검 프로그램",
    description: "상황과 목표 시간을 정하고 자기소개 원고의 분량과 구조를 브라우저에서 직접 점검합니다.",
    url: "/program",
  },
};

const programAreas = [
  {
    number: "01",
    title: "목적 설정",
    description: "면접, 발표, 네트워킹과 일반 자기소개 중 상황을 고르고 목표 시간과 강조할 내용을 정합니다.",
  },
  {
    number: "02",
    title: "원고 작성",
    description: "상황에 맞는 질문을 따라 자신의 역할, 경험, 성과와 마무리 문장을 직접 작성합니다.",
  },
  {
    number: "03",
    title: "규칙 기반 점검",
    description: "예상 시간, 문장 길이와 자기소개 구조를 확인하고 부족한 부분을 직접 수정합니다.",
  },
] as const;

export default function ProgramPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-violet-300">Self-introduction program</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">자기소개를 직접 쓰고 바로 점검하세요</h1>
        <p className="mt-5 text-base leading-8 text-zinc-300">
          상황과 목표 시간을 먼저 정하고 질문을 따라 원고를 작성해 보세요. 입력한 원고는 서버로 보내지 않고
          현재 브라우저에서 예상 시간과 기본 구조를 확인합니다.
        </p>
      </header>

      <section className="mt-10" aria-label="자기소개 점검 프로그램">
        <IntroductionProgram />
      </section>

      <section className="mt-14 border-y border-zinc-800" aria-labelledby="program-method">
        <div className="py-8">
          <p className="text-sm font-medium text-violet-300">How it works</p>
          <h2 className="mt-2 text-2xl font-bold" id="program-method">
            점검은 세 단계로 진행됩니다
          </h2>
        </div>
        {programAreas.map((area) => (
          <article
            className="grid gap-3 border-t border-zinc-800 py-7 sm:grid-cols-[4rem_1fr_1.6fr] sm:items-start"
            key={area.number}
          >
            <p className="text-sm font-semibold text-violet-300">{area.number}</p>
            <h3 className="text-lg font-semibold">{area.title}</h3>
            <p className="text-sm leading-7 text-zinc-400">{area.description}</p>
          </article>
        ))}
      </section>

      <aside className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <p className="text-sm font-semibold text-emerald-300">개인정보와 결과 범위</p>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          원고는 저장하거나 외부 API로 전송하지 않습니다. 점검 결과는 글자 수와 표현 규칙을 바탕으로 하며,
          음성 분석이나 AI 평가가 아닙니다. 실제 말하기 시간은 쉼, 강조와 현장 상황에 따라 달라질 수 있습니다.
        </p>
        <Link className="mt-4 inline-flex text-sm font-semibold text-violet-300 hover:text-violet-200" href="/methodology">
          점검 기준과 한계 확인 →
        </Link>
      </aside>
    </div>
  );
}
