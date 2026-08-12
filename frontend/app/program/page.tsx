import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "프로그램 소개",
  description: "자기 설명 능력을 높이기 위해 Naketing이 준비하는 프로그램 방향을 안내합니다.",
  alternates: { canonical: "/program" },
  openGraph: {
    title: "Naketing 프로그램 소개",
    description: "자기 설명 능력을 높이기 위해 Naketing이 준비하는 프로그램 방향을 안내합니다.",
    url: "/program",
  },
};

const programAreas = [
  {
    number: "01",
    title: "말하기 패턴 점검",
    description: "반복되는 표현, 장황한 문장과 핵심이 늦게 나오는 습관을 알아볼 수 있는 기준을 만듭니다.",
  },
  {
    number: "02",
    title: "표현 구조 정리",
    description: "하고 싶은 말을 핵심, 근거와 결론 순서로 정리해 듣는 사람이 이해하기 쉽게 구성합니다.",
  },
  {
    number: "03",
    title: "나만의 언어 만들기",
    description: "경험과 강점을 과장 없이 설명하고 여러 상황에서도 일관되게 전달할 표현을 다듬습니다.",
  },
] as const;

export default function ProgramPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-violet-300">Program</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">나를 설명하는 힘을 기르는 프로그램</h1>
        <p className="mt-5 text-base leading-8 text-zinc-300">
          Naketing은 자기소개, 면접과 발표에서 생각을 짧고 분명하게 전달하는 과정을 설계하고 있습니다.
          단순히 말을 꾸미기보다 무엇을 말할지 정하고, 구조화하고, 직접 점검하는 데 집중합니다.
        </p>
      </header>

      <section className="mt-12 border-y border-zinc-800" aria-labelledby="program-direction">
        <h2 className="sr-only" id="program-direction">
          프로그램 방향
        </h2>
        {programAreas.map((area) => (
          <article className="grid gap-3 border-b border-zinc-800 py-7 last:border-b-0 sm:grid-cols-[4rem_1fr_1.6fr] sm:items-start" key={area.number}>
            <p className="text-sm font-semibold text-violet-300">{area.number}</p>
            <h3 className="text-lg font-semibold">{area.title}</h3>
            <p className="text-sm leading-7 text-zinc-400">{area.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <p className="text-sm font-semibold text-emerald-300">현재 제공 범위</p>
        <h2 className="mt-3 text-2xl font-bold">가이드와 무료 도구부터 이용할 수 있습니다</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          현재 프로그램 소개는 서비스 방향을 안내합니다. 음성 또는 AI 분석 기능은 아직 제공하지 않으며,
          지금은 직접 읽고 적용하는 가이드와 브라우저에서 원고를 점검하는 도구를 제공합니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
            href="/guides"
          >
            가이드 읽기
          </Link>
          <Link
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
            href="/tools"
          >
            무료 도구 사용하기
          </Link>
        </div>
      </section>
    </div>
  );
}
