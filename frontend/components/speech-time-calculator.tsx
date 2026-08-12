"use client";

import { useState } from "react";

type SpeechPace = "slow" | "normal" | "fast";

interface PaceDefinition {
  label: string;
  charactersPerMinute: number;
}

interface SpeechTimeResult {
  characterCount: number;
  wordCount: number;
  totalSeconds: number;
}

const paceDefinitions: Record<SpeechPace, PaceDefinition> = {
  slow: { label: "느리게", charactersPerMinute: 240 },
  normal: { label: "보통", charactersPerMinute: 300 },
  fast: { label: "빠르게", charactersPerMinute: 360 },
};

function countCharacters(value: string): number {
  return Array.from(value.replace(/\s/g, "")).length;
}

function countWords(value: string): number {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue.split(/\s+/).length : 0;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}

export function SpeechTimeCalculator() {
  const [script, setScript] = useState("");
  const [pace, setPace] = useState<SpeechPace>("normal");
  const [result, setResult] = useState<SpeechTimeResult | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function calculateSpeechTime() {
    setMessage("");
    const characterCount = countCharacters(script);

    if (characterCount === 0) {
      setResult(null);
      setError("계산할 원고를 입력해 주세요.");
      return;
    }

    const { charactersPerMinute } = paceDefinitions[pace];
    const totalSeconds = Math.max(1, Math.round((characterCount / charactersPerMinute) * 60));

    setResult({
      characterCount,
      wordCount: countWords(script),
      totalSeconds,
    });
    setError("");
  }

  async function copyResult() {
    if (!result) {
      setError("먼저 말하기 시간을 계산해 주세요.");
      return;
    }

    const paceDefinition = paceDefinitions[pace];
    const output = [
      `예상 말하기 시간: ${formatDuration(result.totalSeconds)}`,
      `공백 제외 글자 수: ${result.characterCount}자`,
      `단어 수: ${result.wordCount}개`,
      `계산 기준: 분당 ${paceDefinition.charactersPerMinute}자 (${paceDefinition.label})`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(output);
      setMessage("계산 결과를 클립보드에 복사했습니다.");
      setError("");
    } catch {
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function clearCalculator() {
    setScript("");
    setPace("normal");
    setResult(null);
    setError("");
    setMessage("");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-200" htmlFor="speech-script">
          말할 원고
        </label>
        <textarea
          id="speech-script"
          className="min-h-64 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-7 text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          value={script}
          onChange={(event) => {
            setScript(event.target.value);
            setResult(null);
            setError("");
            setMessage("");
          }}
          placeholder="발표나 자기소개 원고를 입력해 주세요."
          maxLength={20000}
        />
        <p className="mt-2 text-right text-xs text-zinc-600">최대 20,000자</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-200" htmlFor="speech-pace">
          발화 속도
        </label>
        <select
          id="speech-pace"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:max-w-xs"
          value={pace}
          onChange={(event) => {
            setPace(event.target.value as SpeechPace);
            setResult(null);
            setError("");
            setMessage("");
          }}
        >
          {Object.entries(paceDefinitions).map(([value, definition]) => (
            <option value={value} key={value}>
              {definition.label} · 분당 {definition.charactersPerMinute}자
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
          type="button"
          onClick={calculateSpeechTime}
        >
          계산하기
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
          onClick={clearCalculator}
        >
          초기화
        </button>
      </div>

      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>

      {result && (
        <section className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-5" aria-label="계산 결과">
          <p className="text-sm text-violet-200">예상 말하기 시간</p>
          <p className="mt-2 text-3xl font-bold text-white">{formatDuration(result.totalSeconds)}</p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-500">공백 제외 글자 수</dt>
              <dd className="mt-1 font-semibold text-zinc-200">{result.characterCount}자</dd>
            </div>
            <div>
              <dt className="text-zinc-500">단어 수</dt>
              <dd className="mt-1 font-semibold text-zinc-200">{result.wordCount}개</dd>
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
        결과는 공백을 제외한 글자 수를 기준으로 계산한 추정치입니다. 문장 사이의 쉼, 강조,
        청중 반응과 개인의 발음 습관에 따라 실제 시간은 달라질 수 있습니다.
      </p>
    </div>
  );
}
