"use client";

import { useState } from "react";

type TimestampUnit = "seconds" | "milliseconds";

interface ConversionResult {
  utcText: string;
  koreaText: string;
}

const koreaDateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "full",
  timeStyle: "long",
  timeZone: "Asia/Seoul",
  hour12: false,
});

function convertToDate(value: string, unit: TimestampUnit): Date {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    throw new Error("변환할 timestamp를 입력해 주세요.");
  }
  if (!/^-?\d+$/.test(normalizedValue)) {
    throw new Error("timestamp는 정수로 입력해 주세요.");
  }

  const timestamp = Number(normalizedValue);
  if (!Number.isSafeInteger(timestamp)) {
    throw new Error("안전하게 변환할 수 있는 정수 범위를 벗어났습니다.");
  }

  const timestampInMilliseconds = unit === "seconds" ? timestamp * 1000 : timestamp;
  const date = new Date(timestampInMilliseconds);
  if (Number.isNaN(date.getTime())) {
    throw new Error("JavaScript Date가 지원하는 날짜 범위를 벗어났습니다.");
  }

  return date;
}

export function TimestampConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function convertTimestamp(inputValue = value, inputUnit = unit) {
    setMessage("");

    try {
      const date = convertToDate(inputValue, inputUnit);
      setResult({
        utcText: date.toISOString(),
        koreaText: koreaDateTimeFormatter.format(date),
      });
      setError("");
    } catch (conversionError) {
      setResult(null);
      setError(conversionError instanceof Error ? conversionError.message : "timestamp를 변환할 수 없습니다.");
    }
  }

  function useCurrentTime() {
    const now = Date.now();
    const currentTimestamp = unit === "seconds" ? Math.floor(now / 1000) : now;
    const currentValue = String(currentTimestamp);
    setValue(currentValue);
    convertTimestamp(currentValue, unit);
  }

  async function copyResult() {
    if (!result) {
      setError("먼저 timestamp를 변환해 주세요.");
      return;
    }

    const output = `UTC: ${result.utcText}\nKorea: ${result.koreaText}`;
    try {
      await navigator.clipboard.writeText(output);
      setMessage("변환 결과를 클립보드에 복사했습니다.");
      setError("");
    } catch {
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function clearValue() {
    setValue("");
    setUnit("seconds");
    setResult(null);
    setError("");
    setMessage("");
  }

  return (
    <div className="tool-panel space-y-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div>
          <label className="tool-label" htmlFor="timestamp-input">
            Unix timestamp
          </label>
          <input
            id="timestamp-input"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setResult(null);
              setError("");
              setMessage("");
            }}
            placeholder="1723420800"
            inputMode="numeric"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="tool-label" htmlFor="timestamp-unit">
            단위
          </label>
          <select
            id="timestamp-unit"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            value={unit}
            onChange={(event) => {
              setUnit(event.target.value as TimestampUnit);
              setResult(null);
              setError("");
              setMessage("");
            }}
          >
            <option value="seconds">Seconds</option>
            <option value="milliseconds">Milliseconds</option>
          </select>
        </div>
      </div>

      <div className="tool-actions">
        <button className="button-primary" type="button" onClick={() => convertTimestamp()}>
          Convert
        </button>
        <button className="button-secondary" type="button" onClick={useCurrentTime}>
          Current time
        </button>
        <button className="button-secondary" type="button" onClick={copyResult}>
          Copy
        </button>
        <button className="button-ghost" type="button" onClick={clearValue}>
          Clear
        </button>
      </div>

      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>

      {result && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section>
            <h2 className="tool-result-title">UTC (ISO 8601)</h2>
            <p className="tool-result break-all">{result.utcText}</p>
          </section>
          <section>
            <h2 className="tool-result-title">Korea (Asia/Seoul)</h2>
            <p className="tool-result break-all">{result.koreaText}</p>
          </section>
        </div>
      )}
    </div>
  );
}
