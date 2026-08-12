import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideContent } from "@/components/guide-content";
import { formatGuideDate, getAllGuides, getGuideBySlug } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "가이드를 찾을 수 없습니다" };
  }

  const canonicalPath = `/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.tags,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: canonicalPath,
      publishedTime: `${guide.date}T00:00:00+09:00`,
      tags: guide.tags,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    author: { "@type": "Organization", name: "Naketing" },
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
  };

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link className="text-sm font-medium text-violet-300 hover:text-violet-200" href="/guides">
        ← 가이드 목록
      </Link>
      <header className="mt-8 border-b border-zinc-800 pb-8">
        <time className="text-sm text-zinc-500" dateTime={guide.date}>
          {formatGuideDate(guide.date)}
        </time>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">{guide.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="태그">
          {guide.tags.map((tag) => (
            <li className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </header>
      <GuideContent content={guide.content} />
    </article>
  );
}
