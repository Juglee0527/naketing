"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";

import {
  getIntroductionActions,
  type IntroductionAnalysisResult,
  type LengthStatus,
  type PhraseFinding,
} from "@/lib/introduction-analysis";
import type { IntroductionComparison } from "@/lib/introduction-comparison";
import { formatSpeechDuration } from "@/lib/speech-time";

interface IntroductionProgramResultProps {
  comparison: IntroductionComparison | null;
  result: IntroductionAnalysisResult;
  script: string;
  targetLabel: string;
  onEdit: () => void;
  onReset: () => void;
}

interface ComparisonMetricProps {
  label: string;
  difference: number;
  unit: string;
  lowerIsBetter?: boolean;
}

interface HighlightRange {
  start: number;
  end: number;
  phrase: string;
}

const lengthStatusLabels: Record<LengthStatus, string> = {
  short: "목표보다 짧습니다",
  appropriate: "목표 시간에 적절합니다",
  long: "목표보다 깁니다",
};

const lengthStatusColors: Record<LengthStatus, string> = {
  short: "text-amber-300",
  appropriate: "text-emerald-300",
  long: "text-red-300",
};

function createHighlightRanges(findings: PhraseFinding[]): HighlightRange[] {
  return findings
    .flatMap((finding) =>
      finding.indices.map((start) => ({
        start,
        end: start + finding.phrase.length,
        phrase: finding.phrase,
      })),
    )
    .sort((left, right) => left.start - right.start || right.end - left.end)
    .filter((range, index, ranges) => index === 0 || range.start >= ranges[index - 1].end);
}

function renderHighlightedScript(script: string, findings: PhraseFinding[]): ReactNode[] {
  const ranges = createHighlightRanges(findings);
  if (ranges.length === 0) {
    return [script];
  }

  const blocks: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (range.start > cursor) {
      blocks.push(<Fragment key={`text-${index}`}>{script.slice(cursor, range.start)}</Fragment>);
    }
    blocks.push(
      <mark
        className="rounded bg-amber-300/20 px-0.5 text-amber-100"
        title={`점검 후보 표현: ${range.phrase}`}
        key={`mark-${range.start}-${range.end}`}
      >
        {script.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });

  if (cursor < script.length) {
    blocks.push(<Fragment key="text-last">{script.slice(cursor)}</Fragment>);
  }

  return blocks;
}

function ComparisonMetric({ label, difference, unit, lowerIsBetter = false }: ComparisonMetricProps) {
  const isImproved = lowerIsBetter && difference < 0;
  const isWorse = lowerIsBetter && difference > 0;
  const differenceLabel = difference === 0 ? "변화 없음" : `${difference > 0 ? "+" : ""}${difference}${unit}`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`mt-2 text-lg font-semibold ${
          isImproved ? "text-emerald-300" : isWorse ? "text-amber-300" : "text-zinc-200"
        }`}
      >
        {differenceLabel}
      </p>
    </div>
  );
}

export function IntroductionProgramResult({
  comparison,
  result,
  script,
  targetLabel,
  onEdit,
  onReset,
}: IntroductionProgramResultProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const actions = useMemo(() => getIntroductionActions(result), [result]);

  async function copyToClipboard(value: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(successMessage);
      setError("");
    } catch {
      setMessage("");
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function copyResult() {
    const missingStructure = result.structureChecks.filter((check) => !check.met).map((check) => check.label);
    const output = [
      "Naketing 자기소개 점검 결과",
      `목표 시간: ${targetLabel}`,
      `예상 말하기 시간: ${formatSpeechDuration(result.totalSeconds)}`,
      `분량 판정: ${lengthStatusLabels[result.lengthStatus]}`,
      `공백 제외 글자 수: ${result.characterCount}자`,
      `문장 수: ${result.sentenceCount}개`,
      `평균 문장 길이: ${result.averageSentenceCharacters}자`,
      `점검 후보 표현: ${result.fillerPhrases.length > 0 ? result.fillerPhrases.map((finding) => `${finding.phrase} ${finding.count}회`).join(", ") : "없음"}`,
      `반복 단어: ${result.repeatedWords.length > 0 ? result.repeatedWords.map((finding) => `${finding.word} ${finding.count}회`).join(", ") : "없음"}`,
      `보완할 구조: ${missingStructure.length > 0 ? missingStructure.join(", ") : "없음"}`,
      "",
      "수정 순서",
      ...actions.map((action, index) => `${index + 1}. ${action.title} - ${action.description}`),
    ].join("\n");

    void copyToClipboard(output, "점검 결과와 수정 순서를 복사했습니다.");
  }

  return (
    <>
      <div className="mt-6 rounded-xl border border-violet-500/40 bg-violet-500/10 p-5 sm:p-6">
        <p className={`text-sm font-semibold ${lengthStatusColors[result.lengthStatus]}`}>
          {lengthStatusLabels[result.lengthStatus]}
        </p>
        <p className="mt-2 text-3xl font-bold">{formatSpeechDuration(result.totalSeconds)}</p>
        <p className="mt-2 text-sm text-zinc-400">
          목표 {targetLabel} · 적정 글자 수 {result.minimumCharacters}~{result.maximumCharacters}자
        </p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <dt className="text-xs text-zinc-500">공백 제외 글자 수</dt>
          <dd className="mt-2 text-xl font-semibold">{result.characterCount}자</dd>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <dt className="text-xs text-zinc-500">문장 수</dt>
          <dd className="mt-2 text-xl font-semibold">{result.sentenceCount}개</dd>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <dt className="text-xs text-zinc-500">평균 문장 길이</dt>
          <dd className="mt-2 text-xl font-semibold">{result.averageSentenceCharacters}자</dd>
        </div>
      </dl>

      {comparison && (
        <section className="mt-8" aria-labelledby="revision-comparison-heading">
          <p className="text-xs font-semibold text-emerald-300">첫 점검과 비교</p>
          <h3 className="mt-2 text-lg font-semibold" id="revision-comparison-heading">
            수정 후 달라진 내용
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ComparisonMetric label="공백 제외 글자 수" difference={comparison.characterDifference} unit="자" />
            <ComparisonMetric label="예상 말하기 시간" difference={comparison.durationDifference} unit="초" />
            <ComparisonMetric label="점검 후보 표현" difference={comparison.fillerDifference} unit="곳" lowerIsBetter />
            <ComparisonMetric label="55자 이상 문장" difference={comparison.longSentenceDifference} unit="개" lowerIsBetter />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-xs text-emerald-300">새로 확인된 구조</p>
              <p className="mt-2 text-sm text-zinc-300">
                {comparison.resolvedStructureLabels.length > 0
                  ? comparison.resolvedStructureLabels.join(", ")
                  : "변화 없음"}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-xs text-amber-300">수정 후 사라진 구조 단서</p>
              <p className="mt-2 text-sm text-zinc-300">
                {comparison.newlyMissingStructureLabels.length > 0
                  ? comparison.newlyMissingStructureLabels.join(", ")
                  : "없음"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            비교 기준은 이 브라우저 세션에서 처음 점검한 원고입니다. 종합 점수나 전달력 평가는 제공하지 않습니다.
          </p>
        </section>
      )}

      <section className="mt-8" aria-labelledby="expression-review-heading">
        <h3 className="text-lg font-semibold" id="expression-review-heading">
          표현 점검
        </h3>
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 text-sm leading-7 text-zinc-300">
          {renderHighlightedScript(script, result.fillerPhrases)}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-xs text-zinc-500">점검 후보 표현</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">
              {result.fillerPhrases.length > 0
                ? result.fillerPhrases.map((finding) => `${finding.phrase} ${finding.count}회`).join(", ")
                : "발견되지 않음"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-xs text-zinc-500">반복 단어</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">
              {result.repeatedWords.length > 0
                ? result.repeatedWords.map((finding) => `${finding.word} ${finding.count}회`).join(", ")
                : "발견되지 않음"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-xs text-zinc-500">55자 이상 문장</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">{result.longSentences.length}개</p>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="structure-review-heading">
        <h3 className="text-lg font-semibold" id="structure-review-heading">
          구조 점검
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {result.structureChecks.map((check) => (
            <li className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4" key={check.id}>
              <p className={`text-sm font-semibold ${check.met ? "text-emerald-300" : "text-amber-300"}`}>
                {check.met ? "✓ 확인됨" : "△ 보완 필요"} · {check.label}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {check.evidence ? `감지 근거: ${check.evidence}` : check.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="revision-actions-heading">
        <h3 className="text-lg font-semibold" id="revision-actions-heading">
          추천 수정 순서
        </h3>
        <ol className="mt-3 space-y-3">
          {actions.map((action, index) => (
            <li className="flex gap-4 rounded-xl border border-zinc-800 p-4" key={action.id}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-200">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-200">{action.title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{action.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          type="button"
          onClick={onEdit}
        >
          원고 수정하기
        </button>
        <button
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          type="button"
          onClick={() => void copyToClipboard(script, "원고를 클립보드에 복사했습니다.")}
        >
          원고 복사
        </button>
        <button
          className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          type="button"
          onClick={copyResult}
        >
          결과 복사
        </button>
        <button
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          type="button"
          onClick={onReset}
        >
          처음부터 다시 하기
        </button>
      </div>

      <p className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        이 결과는 문장과 표현을 규칙으로 확인한 참고 자료입니다. 의미, 사실관계나 전달력을 AI로 평가한 결과가 아닙니다.
      </p>
    </>
  );
}
