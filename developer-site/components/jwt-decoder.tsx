"use client";

import { useState } from "react";

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  expirationText: string | null;
  isExpired: boolean | null;
}

function decodeBase64Url(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJwtSection(segment: string, sectionName: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(decodeBase64Url(segment));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${sectionName}가 JSON 객체가 아닙니다.`);
  }
  return parsed as Record<string, unknown>;
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function decodeToken() {
    setMessage("");
    const segments = token.trim().split(".");
    if (segments.length !== 3 || segments.some((segment) => !segment)) {
      setDecoded(null);
      setError("JWT는 점(.)으로 구분된 Header, Payload, Signature 세 부분이어야 합니다.");
      return;
    }

    try {
      const header = parseJwtSection(segments[0], "Header");
      const payload = parseJwtSection(segments[1], "Payload");
      const exp = payload.exp;
      let expirationText: string | null = null;
      let isExpired: boolean | null = null;

      if (typeof exp === "number" && Number.isFinite(exp)) {
        const expirationDate = new Date(exp * 1000);
        expirationText = expirationDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
        isExpired = expirationDate.getTime() <= Date.now();
      }

      setDecoded({ header, payload, expirationText, isExpired });
      setError("");
    } catch (decodeError) {
      setDecoded(null);
      setError(decodeError instanceof Error ? decodeError.message : "JWT를 디코딩할 수 없습니다.");
    }
  }

  async function copyDecoded() {
    if (!decoded) {
      setError("먼저 JWT를 디코딩해 주세요.");
      return;
    }

    const output = JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2);
    try {
      await navigator.clipboard.writeText(output);
      setMessage("디코딩 결과를 클립보드에 복사했습니다.");
      setError("");
    } catch {
      setError("클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  }

  function clearToken() {
    setToken("");
    setDecoded(null);
    setError("");
    setMessage("");
  }

  return (
    <div className="tool-panel space-y-6">
      <div>
        <label className="tool-label" htmlFor="jwt-input">
          JWT 입력
        </label>
        <textarea
          id="jwt-input"
          className="tool-textarea min-h-36"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOi..."
          spellCheck={false}
        />
      </div>
      <div className="tool-actions">
        <button className="button-primary" type="button" onClick={decodeToken}>
          Decode
        </button>
        <button className="button-secondary" type="button" onClick={copyDecoded}>
          Copy
        </button>
        <button className="button-ghost" type="button" onClick={clearToken}>
          Clear
        </button>
      </div>
      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {error ? <span className="text-red-300">{error}</span> : <span className="text-emerald-300">{message}</span>}
      </p>

      {decoded && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section>
            <h2 className="tool-result-title">Header</h2>
            <pre className="tool-result">{JSON.stringify(decoded.header, null, 2)}</pre>
          </section>
          <section>
            <h2 className="tool-result-title">Payload</h2>
            <pre className="tool-result">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </section>
          <section className="rounded-lg border border-slate-700 bg-slate-950 p-4 lg:col-span-2">
            <h2 className="font-semibold text-white">만료 정보</h2>
            {decoded.expirationText ? (
              <p className="mt-2 text-sm text-slate-300">
                {decoded.expirationText} (한국 시간) ·{" "}
                <strong className={decoded.isExpired ? "text-red-300" : "text-emerald-300"}>
                  {decoded.isExpired ? "만료됨" : "유효 기간 내"}
                </strong>
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-400">Payload에 숫자 형식의 exp가 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
