import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IntroductionLengthChecker } from "@/components/introduction-length-checker";
import { SpeechTimeCalculator } from "@/components/speech-time-calculator";
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
    case "speech-time-calculator":
      return <SpeechTimeCalculator />;
    case "introduction-length-checker":
      return <IntroductionLengthChecker />;
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
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link className="text-sm font-medium text-violet-300 hover:text-violet-200" href="/tools">
        ← 도구 목록
      </Link>
      <header className="mt-8">
        <p className="text-sm font-medium text-violet-300">Browser-only tool</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{tool.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">{tool.description}</p>
        <p className="mt-3 text-sm leading-6 text-emerald-300">{tool.privacyNote}</p>
      </header>

      <div className="mt-8">{renderTool(tool.slug)}</div>
    </div>
  );
}
