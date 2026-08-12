import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { JsonFormatter } from "@/components/json-formatter";
import { JwtDecoder } from "@/components/jwt-decoder";
import { TimestampConverter } from "@/components/timestamp-converter";
import { getTool, tools, type ToolSlug } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}

function renderTool(toolSlug: ToolSlug) {
  switch (toolSlug) {
    case "json-formatter":
      return <JsonFormatter />;
    case "jwt-decoder":
      return <JwtDecoder />;
    case "timestamp-converter":
      return <TimestampConverter />;
  }
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return { title: "도구를 찾을 수 없습니다" };
  }

  const canonicalPath = `/tools/${tool.slug}`;
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url: canonicalPath,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="page-container">
      <Link className="text-sm text-violet-300 hover:text-violet-200" href="/tools">
        ← 도구 목록
      </Link>
      <div className="mt-8">
        <p className="eyebrow">Browser-only tool</p>
        <h1 className="page-heading mt-3">{tool.name}</h1>
        <p className="page-description">{tool.description}</p>
        <p className="mt-3 text-sm text-emerald-300">{tool.privacyNote}</p>
      </div>

      {tool.slug === "jwt-decoder" && (
        <aside className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          이 도구는 JWT의 내용을 디코딩할 뿐 서명을 검증하지 않습니다. 인증 또는 보안 판단에 사용하지 마세요.
        </aside>
      )}

      <div className="mt-8">{renderTool(tool.slug)}</div>
      <AdSlot placement="tool-bottom" />
    </div>
  );
}
