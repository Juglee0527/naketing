"use client";

import { useEffect, useRef, useState } from "react";

import { IntroductionProgramResult } from "@/components/introduction-program-result";
import {
  analyzeIntroduction,
  type IntroductionAnalysisResult,
  type TargetDuration,
} from "@/lib/introduction-analysis";
import { paceDefinitions, type SpeechPace } from "@/lib/speech-time";

type ProgramStep = 1 | 2 | 3;
type IntroductionSituation = "interview" | "presentation" | "networking" | "general";
type IntroductionFocus = "strength" | "experience" | "achievement" | "motivation";

const stepLabels: Record<ProgramStep, string> = {
  1: "목적 설정",
  2: "원고 작성",
  3: "점검 결과",
};

const situationDefinitions: Record<
  IntroductionSituation,
  { label: string; description: string; prompt: string }
> = {
  interview: {
    label: "면접",
    description: "지원 직무와 연결되는 경험을 중심으로 설명합니다.",
    prompt: "지원 직무와 관련해 내가 해결했던 문제는 무엇인가요?",
  },
  presentation: {
    label: "발표",
    description: "주제와 청중이 얻을 내용을 먼저 전달합니다.",
    prompt: "발표 주제와 청중이 듣고 난 뒤 기억해야 할 한 문장은 무엇인가요?",
  },
  networking: {
    label: "네트워킹",
    description: "현재 역할과 관심사를 짧게 소개합니다.",
    prompt: "지금 하는 일과 앞으로 만나고 싶은 사람을 어떻게 연결할 수 있나요?",
  },
  general: {
    label: "일반 자기소개",
    description: "상황에 구애받지 않는 기본 소개를 만듭니다.",
    prompt: "처음 만난 사람이 나에 대해 꼭 기억했으면 하는 내용은 무엇인가요?",
  },
};

const focusDefinitions: Record<IntroductionFocus, { label: string; prompt: string }> = {
  strength: { label: "강점", prompt: "그 강점이 드러난 행동은 무엇이었나요?" },
  experience: { label: "경험", prompt: "그 경험에서 맡은 역할과 직접 한 행동은 무엇인가요?" },
  achievement: { label: "성과", prompt: "숫자나 변화로 확인할 수 있는 결과는 무엇인가요?" },
  motivation: { label: "지원 동기", prompt: "상대 또는 조직과 내가 연결되는 이유는 무엇인가요?" },
};

const targetLabels: Record<TargetDuration, string> = {
  30: "30초",
  60: "1분",
  180: "3분",
};

export function IntroductionProgram() {
  const [step, setStep] = useState<ProgramStep>(1);
  const [situation, setSituation] = useState<IntroductionSituation>("interview");
  const [focus, setFocus] = useState<IntroductionFocus>("experience");
  const [targetSeconds, setTargetSeconds] = useState<TargetDuration>(60);
  const [pace, setPace] = useState<SpeechPace>("normal");
  const [script, setScript] = useState("");
  const [result, setResult] = useState<IntroductionAnalysisResult | null>(null);
  const [error, setError] = useState("");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step]);

  function moveToWriting() {
    setError("");
    setStep(2);
  }

  function analyzeScript() {
    const analyzedResult = analyzeIntroduction(script, pace, targetSeconds);
    if (!analyzedResult) {
      setError("점검할 자기소개 원고를 입력해 주세요.");
      return;
    }

    setResult(analyzedResult);
    setError("");
    setStep(3);
  }

  function resetProgram() {
    setStep(1);
    setSituation("interview");
    setFocus("experience");
    setTargetSeconds(60);
    setPace("normal");
    setScript("");
    setResult(null);
    setError("");
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <ol className="grid grid-cols-3 border-b border-zinc-800" aria-label="자기소개 점검 단계">
        {(Object.entries(stepLabels) as Array<[`${ProgramStep}`, string]>).map(([value, label]) => {
          const stepNumber = Number(value) as ProgramStep;
          const isCurrent = stepNumber === step;
          const isComplete = stepNumber < step;

          return (
            <li
              className={`px-3 py-4 text-center text-xs font-semibold sm:text-sm ${
                isCurrent ? "bg-violet-500/10 text-violet-200" : isComplete ? "text-emerald-300" : "text-zinc-500"
              }`}
              aria-current={isCurrent ? "step" : undefined}
              key={value}
            >
              <span className="mr-1.5">{isComplete ? "✓" : value}</span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="p-5 sm:p-8">
        {step === 1 && (
          <section aria-labelledby="program-step-heading">
            <p className="text-sm font-medium text-violet-300">Step 1</p>
            <h2
              className="mt-2 text-2xl font-bold outline-none"
              id="program-step-heading"
              ref={stepHeadingRef}
              tabIndex={-1}
            >
              자기소개 목적을 정하세요
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              상황과 목표를 먼저 정하면 무엇을 남기고 줄일지 판단하기 쉬워집니다.
            </p>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-zinc-200">사용 상황</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(Object.entries(situationDefinitions) as Array<
                  [IntroductionSituation, (typeof situationDefinitions)[IntroductionSituation]]
                >).map(([value, definition]) => (
                  <label
                    className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                      situation === value
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-zinc-700 bg-zinc-950/60 hover:border-zinc-500"
                    }`}
                    key={value}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="situation"
                      value={value}
                      checked={situation === value}
                      onChange={() => setSituation(value)}
                    />
                    <span className="block font-semibold text-zinc-100">{definition.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-zinc-400">{definition.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-7 grid gap-5 sm:grid-cols-3">
              <label className="block sm:col-span-1">
                <span className="text-sm font-semibold text-zinc-200">목표 시간</span>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={targetSeconds}
                  onChange={(event) => setTargetSeconds(Number(event.target.value) as TargetDuration)}
                >
                  {(Object.entries(targetLabels) as Array<[`${TargetDuration}`, string]>).map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-zinc-200">강조할 내용</span>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={focus}
                  onChange={(event) => setFocus(event.target.value as IntroductionFocus)}
                >
                  {(Object.entries(focusDefinitions) as Array<
                    [IntroductionFocus, (typeof focusDefinitions)[IntroductionFocus]]
                  >).map(([value, definition]) => (
                    <option value={value} key={value}>
                      {definition.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
              type="button"
              onClick={moveToWriting}
            >
              원고 작성하기
            </button>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="program-step-heading">
            <p className="text-sm font-medium text-violet-300">Step 2</p>
            <h2
              className="mt-2 text-2xl font-bold outline-none"
              id="program-step-heading"
              ref={stepHeadingRef}
              tabIndex={-1}
            >
              질문을 참고해 원고를 작성하세요
            </h2>
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-xs font-semibold text-violet-300">작성 질문</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-300">
                <li>• 나는 누구이며 지금 어떤 역할을 하고 있나요?</li>
                <li>• {situationDefinitions[situation].prompt}</li>
                <li>• {focusDefinitions[focus].prompt}</li>
                <li>• 마지막에 상대가 기억해야 할 한 문장은 무엇인가요?</li>
              </ul>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-200">발화 속도</span>
                <select
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  value={pace}
                  onChange={(event) => {
                    setPace(event.target.value as SpeechPace);
                    setResult(null);
                  }}
                >
                  {(Object.entries(paceDefinitions) as Array<
                    [SpeechPace, (typeof paceDefinitions)[SpeechPace]]
                  >).map(([value, definition]) => (
                    <option value={value} key={value}>
                      {definition.label} · 분당 {definition.charactersPerMinute}자
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-400">
                목표: {situationDefinitions[situation].label} · {targetLabels[targetSeconds]} · {focusDefinitions[focus].label}
              </div>
            </div>

            <label className="mt-6 block" htmlFor="program-script">
              <span className="text-sm font-semibold text-zinc-200">자기소개 원고</span>
              <textarea
                id="program-script"
                className="mt-2 min-h-72 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={script}
                onChange={(event) => {
                  setScript(event.target.value);
                  setResult(null);
                  setError("");
                }}
                placeholder="작성 질문을 참고해 자기소개 원고를 입력해 주세요."
                maxLength={5000}
              />
            </label>
            <p className="mt-2 flex justify-between gap-4 text-xs text-zinc-500">
              <span>입력한 원고는 외부 서버로 전송하지 않습니다.</span>
              <span>{script.length.toLocaleString("ko-KR")} / 5,000자</span>
            </p>
            <p className="mt-3 min-h-6 text-sm text-red-300" role="alert">
              {error}
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
              >
                이전 단계
              </button>
              <button
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
                type="button"
                onClick={analyzeScript}
              >
                점검 결과 보기
              </button>
            </div>
          </section>
        )}

        {step === 3 && result && (
          <section aria-labelledby="program-step-heading">
            <p className="text-sm font-medium text-violet-300">Step 3</p>
            <h2
              className="mt-2 text-2xl font-bold outline-none"
              id="program-step-heading"
              ref={stepHeadingRef}
              tabIndex={-1}
            >
              자기소개 점검 결과
            </h2>

            <IntroductionProgramResult
              result={result}
              script={script}
              targetLabel={targetLabels[targetSeconds]}
              onEdit={() => setStep(2)}
              onReset={resetProgram}
            />
          </section>
        )}
      </div>
    </div>
  );
}
