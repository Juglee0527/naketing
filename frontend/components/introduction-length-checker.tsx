"use client";

import { useState } from "react";

import {
  calculateSpeechTime,
  formatSpeechDuration,
  paceDefinitions,
  type SpeechPace,
  type SpeechTimeResult,
} from "@/lib/speech-time";

type TargetDuration = "30" | "60" | "180";
type LengthStatus = "short" | "appropriate" | "long";

interface LengthCheckResult extends SpeechTimeResult {
  status: LengthStatus;
  targetSeconds: number;
  toleranceSeconds: number;
  minimumCharacters: number;
  maximumCharacters: number;
}

const targetLabels: Record<TargetDuration, string> = {
  "30": "30초 자기소개",
  "60": "1분 자기소개",
  "180": "3분 자기소개",
};

const statusLabels: Record<LengthStatus, string> = {
  short: "목표보다 짧습니다",
  appropriate: "적정 범위입니다",
  long: "목표보다 깁니다",
};

const statusColors: Record<LengthStatus, string> = {
  short: "text-amber-300",
  appropriate: "text-emerald-300",
  long: "text-red-300",
};

function checkIntroductionLength(
  script: string,
  pace: SpeechPace,
  target: TargetDuration,
): LengthCheckResult | null {
  const speechTime = calculateSpeechTime(script, pace);
  if (!speechTime) {
    return null;
  }

  const targetSeconds = Number(target);
  const toleranceSeconds = Math.max(3, Math.round(targetSeconds * 0.1));
  const minimumSeconds = targetSeconds - toleranceSeconds;
  const maximumSeconds = targetSeconds + toleranceSeconds;
  const charactersPerMinute = paceDefinitions[pace].charactersPerMinute;
  const minimumCharacters = Math.round((minimumSeconds / 60) * charactersPerMinute);
  const maximumCharacters = Math.round((maximumSeconds / 60) * charactersPerMinute);
  const status: LengthStatus =
    speechTime.totalSeconds < minimumSeconds
      ? "short"
      : speechTime.totalSeconds > maximumSeconds
        ? "long"
        : "appropriate";

  return {
    ...speechTime,
    status,
    targetSeconds,
    toleranceSeconds,
    minimumCharacters,
    maximumCharacters,
  };
}

export function IntroductionLengthChecker() {
  const [script, setScript] = useState("");
  const [target, setTarget] = useState<TargetDuration>("60");
  const [pace, setPace] = useState<SpeechPace>("normal");
  const [result, setResult] = useState<LengthCheckResult | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function checkLength() {
    setMessage("");
    const checkedResult = checkIntroductionLength(script, pace, target);

    if (!checkedResult) {
      setResult(null);
      setError("점검할 자기소개 원고를 입력해 주세요.");
      return;
    }

    setResult(checkedResult);
    setError("");
  }

  async function copyResult() {
    if (!result) {
      setError("먼저 자기소개 분량을 점검해 주세요.");
      return;
    }

    const output = [
      `목표: ${targetLabels[target]}`,
      `예상 말하기 시간: ${formatSpeechDuration(result.totalSeconds)}`,
      `판정: ${statusLabels[result.status]}`,
      `공백 제외 글자 수: ${result.characterCount}자`,
      `적정 글자 수 추정: ${result.minimumCharacters}~${result.maximumCharacters}자`,
      `발화 속도 기준: 분당 ${paceDefinitions[pace].charactersPerMinute}자`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(output);
      setMessage("점검 결과를 클립보드에 복사했습니다.");
      setError("");
    } catch {
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function clearChecker() {
    setScript("");
    setTarget("60");
    setPace("normal");
    setResult(null);
    setError("");
    setMessage("");
  }

  function resetResult() {
    setResult(null);
    setError("");
    setMessage("");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-200" htmlFor="introduction-target">
            목표 시간
          </label>
          <select
            id="introduction-target"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={target}
            onChange={(event) => {
              setTarget(event.target.value as TargetDuration);
              resetResult();
            }}
          >
            {Object.entries(targetLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-200" htmlFor="introduction-pace">
            발화 속도
          </label>
          <select
            id="introduction-pace"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={pace}
            onChange={(event) => {
              setPace(event.target.value as SpeechPace);
              resetResult();
            }}
          >
            {Object.entries(paceDefinitions).map(([value, definition]) => (
              <option value={value} key={value}>
                {definition.label} · 분당 {definition.charactersPerMinute}자
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-200" htmlFor="introduction-script">
          자기소개 원고
        </label>
        <textarea
          id="introduction-script"
          className="min-h-64 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          value={script}
          onChange={(event) => {
            setScript(event.target.value);
            resetResult();
          }}
          placeholder="점검할 자기소개 원고를 입력해 주세요."
          maxLength={20000}
        />
        <p className="mt-2 text-right text-xs text-zinc-600">최대 20,000자</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          type="button"
          onClick={checkLength}
        >
          분량 점검
        </button>
        <button
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
          type="button"
          onClick={copyResult}
        >
          결과 복사
        </button>
        <button
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          type="button"
          onClick={clearChecker}
        >
          초기화
        </button>
      </div>

      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>

      {result && (
        <section className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-5" aria-label="분량 점검 결과">
          <p className={`text-sm font-semibold ${statusColors[result.status]}`}>{statusLabels[result.status]}</p>
          <p className="mt-2 text-3xl font-bold text-white">{formatSpeechDuration(result.totalSeconds)}</p>
          <p className="mt-2 text-sm text-zinc-400">
            목표 {formatSpeechDuration(result.targetSeconds)} · 적정 판정 ±{result.toleranceSeconds}초
          </p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-500">현재 글자 수</dt>
              <dd className="mt-1 font-semibold text-zinc-200">{result.characterCount}자</dd>
            </div>
            <div>
              <dt className="text-zinc-500">적정 글자 수 추정</dt>
              <dd className="mt-1 font-semibold text-zinc-200">
                {result.minimumCharacters}~{result.maximumCharacters}자
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">계산 기준</dt>
              <dd className="mt-1 font-semibold text-zinc-200">
                분당 {paceDefinitions[pace].charactersPerMinute}자
              </dd>
            </div>
          </dl>
        </section>
      )}

      <p className="text-xs leading-5 text-zinc-500">
        적정 판정은 선택한 목표 시간의 ±10%를 기준으로 하며 최소 허용 폭은 3초입니다. 실제 발화
        시간은 쉼, 강조, 발음과 현장 상황에 따라 달라질 수 있습니다.
      </p>
    </div>
  );
}
