"use client";

import { useState } from "react";

export function JsonFormatter() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function transformJson(spaces?: number) {
    setMessage("");
    if (!value.trim()) {
      setError("JSON을 입력해 주세요.");
      return;
    }

    try {
      const parsed: unknown = JSON.parse(value);
      setValue(JSON.stringify(parsed, null, spaces));
      setError("");
    } catch {
      setError("올바른 JSON 형식이 아닙니다. 따옴표, 쉼표, 괄호를 확인해 주세요.");
    }
  }

  async function copyValue() {
    if (!value) {
      setError("복사할 JSON이 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setMessage("클립보드에 복사했습니다.");
      setError("");
    } catch {
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function clearValue() {
    setValue("");
    setError("");
    setMessage("");
  }

  return (
    <div className="tool-panel">
      <label className="tool-label" htmlFor="json-input">
        JSON 입력
      </label>
      <textarea
        id="json-input"
        className="tool-textarea min-h-80"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={'{"name":"naketing","active":true}'}
        spellCheck={false}
      />
      <div className="tool-actions">
        <button className="button-primary" type="button" onClick={() => transformJson(2)}>
          Pretty Print
        </button>
        <button className="button-secondary" type="button" onClick={() => transformJson()}>
          Minify
        </button>
        <button className="button-secondary" type="button" onClick={copyValue}>
          Copy
        </button>
        <button className="button-ghost" type="button" onClick={clearValue}>
          Clear
        </button>
      </div>
      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>
    </div>
  );
}

