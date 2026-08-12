import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "자기소개 점검 기준과 한계",
  description: "Naketing의 발화 시간, 표현, 문장과 자기소개 구조 점검 기준 및 결과의 한계를 설명합니다.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Naketing 자기소개 점검 기준과 한계",
    description: "발화 시간과 자기소개 원고를 어떤 규칙으로 점검하는지 확인합니다.",
    url: "/methodology",
  },
};

const structureCriteria = [
  ["자기 정의", "개발자, 기획자, 엔지니어와 같은 역할 또는 담당 직무를 나타내는 문장 단서를 찾습니다."],
  ["경험 근거", "프로젝트, 업무, 담당 활동과 직접 한 개발·기획·분석·해결 행동을 나타내는 문장 단서를 찾습니다."],
  ["결과 또는 성과", "숫자와 단위, 개선·증가·감소·달성·절감·해결처럼 확인 가능한 변화를 나타내는 문장 단서를 찾습니다."],
  ["마무리", "기여 방향, 목표, 지원 이유 또는 인사로 원고가 끝나는지 확인합니다."],
] as const;

export default function MethodologyPage() {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <header className="border-b border-zinc-800 pb-8">
        <p className="text-sm font-medium text-violet-300">Methodology</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">자기소개 점검 기준과 한계</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">
          Naketing은 원고의 의미를 평가하거나 정답을 만드는 서비스가 아닙니다. 사용자가 직접 확인할 수 있는
          글자 수와 문장 단서를 바탕으로 수정할 위치를 찾도록 돕습니다.
        </p>
        <p className="mt-3 text-sm text-zinc-500">기준 검토일: 2026년 8월 12일 · 작성 이정근</p>
      </header>

      <section className="mt-10" aria-labelledby="speech-time-method">
        <h2 className="text-2xl font-bold" id="speech-time-method">발화 시간과 목표 분량</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
          <li>공백과 줄바꿈을 제외한 글자 수를 셉니다.</li>
          <li>느리게 분당 240자, 보통 300자, 빠르게 360자를 기준으로 예상 시간을 반올림합니다.</li>
          <li>목표 시간의 ±10%를 적정 범위로 사용하며 허용 폭은 최소 3초입니다.</li>
          <li>화면에 표시한 최소·최대 글자 수와 판정은 같은 글자 수 경계를 사용합니다.</li>
        </ul>
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-7 text-amber-100">
          쉼, 강조, 발음, 청중 반응과 현장 상황은 계산하지 않습니다. 최종 시간은 반드시 원고를 직접 읽어 확인해야 합니다.
        </p>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="expression-method">
        <h2 className="text-2xl font-bold" id="expression-method">표현과 문장 점검</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-5">
            <h3 className="font-semibold">점검 후보 표현</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              개인적으로, 솔직히, 어쨌든, 일단, 사실, 약간, 그냥, 뭔가, 열심히를 표시합니다. 더 긴 단어 안의 부분 문자열은 제외합니다.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 p-5">
            <h3 className="font-semibold">반복 단어</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              두 글자 이상 단어가 세 번 이상 나오면 표시합니다. 자주 쓰는 연결어는 제외하고 일반적인 한국어 조사는 같은 단어로 모읍니다.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 p-5">
            <h3 className="font-semibold">긴 문장</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              마침표, 물음표, 느낌표와 줄바꿈으로 문장을 나누고 공백 제외 55자 이상 문장을 수정 후보로 표시합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="structure-method">
        <h2 className="text-2xl font-bold" id="structure-method">자기소개 구조 단서</h2>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          아래 항목은 의미의 완성도를 판단하지 않습니다. 등록된 문장 단서가 발견되면 실제 근거 문장을 함께 보여줍니다.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {structureCriteria.map(([label, description]) => (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5" key={label}>
              <dt className="font-semibold text-violet-200">{label}</dt>
              <dd className="mt-2 text-sm leading-6 text-zinc-400">{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="comparison-method">
        <h2 className="text-2xl font-bold" id="comparison-method">수정 전후 비교</h2>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          처음 점검한 결과를 현재 브라우저 메모리에 기준선으로 보관합니다. 다시 점검하면 글자 수, 예상 시간,
          후보 표현, 긴 문장과 구조 단서의 변화만 보여줍니다. 처음부터 다시 시작하거나 페이지를 새로 열면 기준선은 삭제됩니다.
        </p>
      </section>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="method-limitations">
        <h2 className="text-2xl font-bold" id="method-limitations">해석할 수 없는 영역</h2>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
          <li>내용의 사실 여부, 경험의 진위와 지원 직무 적합성을 검증하지 않습니다.</li>
          <li>목소리, 발음, 억양, 시선과 청중의 반응을 분석하지 않습니다.</li>
          <li>규칙에 없는 직무명과 표현은 구조 단서가 있어도 놓칠 수 있습니다.</li>
          <li>점검 결과는 AI 평가나 종합 점수가 아니며 사용자가 직접 수정하기 위한 참고 자료입니다.</li>
        </ul>
      </section>

      <aside className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold">입력 내용은 브라우저에서만 처리합니다</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          프로그램과 도구에 입력한 원고 및 첫 점검 기준선은 서버나 외부 API로 전송하거나 저장하지 않습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500" href="/program">
            자기소개 점검 시작
          </Link>
          <Link className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800" href="/tools">
            무료 도구 보기
          </Link>
        </div>
      </aside>
    </article>
  );
}
