import type { Metadata } from "next";
import Link from "next/link";

import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "서버 전송 없이 브라우저에서 사용할 수 있는 무료 개발자 도구입니다.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "무료 개발자 도구",
    description: "JSON Formatter와 JWT Decoder를 브라우저에서 안전하게 사용하세요.",
    url: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <div className="page-container">
      <p className="eyebrow">Tools</p>
      <h1 className="page-heading mt-3">무료 개발자 도구</h1>
      <p className="page-description">
        자주 필요한 작업을 빠르게 처리합니다. 현재 제공하는 도구는 입력값을 외부 서버로 전송하지 않습니다.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {tools.map((tool) => (
          <article className="content-card" key={tool.slug}>
            <h2 className="text-xl font-semibold text-white">{tool.name}</h2>
            <p className="mt-3 leading-7 text-slate-400">{tool.description}</p>
            <p className="mt-4 text-sm leading-6 text-emerald-300">{tool.privacyNote}</p>
            <Link className="button-primary mt-6 inline-block" href={`/tools/${tool.slug}`}>
              도구 열기
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

