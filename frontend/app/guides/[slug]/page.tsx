import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideContent } from "@/components/guide-content";
import { formatGuideDate, getAllGuides, getGuideBySlug, getRelatedGuides } from "@/lib/guides";
import { absoluteUrl, sharedOpenGraphImage, siteConfig } from "@/lib/site";
import { getRelatedToolForGuide } from "@/lib/tools";

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
      authors: [siteConfig.author.name],
      images: [sharedOpenGraphImage],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = getRelatedGuides(guide, 2);
  const relatedTool = getRelatedToolForGuide(guide.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.date,
        author: { "@type": "Person", name: siteConfig.author.name },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "가이드", item: absoluteUrl("/guides") },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: absoluteUrl(`/guides/${guide.slug}`),
          },
        ],
      },
    ],
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
        <p className="text-sm text-zinc-500">
          <span>작성 {siteConfig.author.name}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={guide.date}>{formatGuideDate(guide.date)}</time>
        </p>
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

      <aside className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <p className="text-sm font-semibold text-violet-300">작성자</p>
        <p className="mt-2 text-lg font-semibold text-zinc-100">{siteConfig.author.name}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{siteConfig.author.description}</p>
      </aside>

      <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="guide-next-action-heading">
        <p className="text-sm font-medium text-emerald-300">다음 단계</p>
        <h2 className="mt-2 text-2xl font-bold" id="guide-next-action-heading">
          읽은 내용을 직접 점검해 보세요
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-5 hover:border-violet-400" href="/program">
            <span className="text-xs font-semibold text-violet-300">Program</span>
            <span className="mt-2 block font-semibold text-zinc-100">자기소개 점검 프로그램</span>
            <span className="mt-2 block text-sm leading-6 text-zinc-400">
              상황과 목표 시간을 정하고 원고의 분량, 표현과 구조를 한 번에 점검합니다.
            </span>
          </Link>
          <Link
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 hover:border-zinc-600"
            href={`/tools/${relatedTool.slug}`}
          >
            <span className="text-xs font-semibold text-violet-300">Related tool</span>
            <span className="mt-2 block font-semibold text-zinc-100">{relatedTool.name}</span>
            <span className="mt-2 block text-sm leading-6 text-zinc-400">{relatedTool.description}</span>
          </Link>
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="related-guides-heading">
          <p className="text-sm font-medium text-violet-300">Related guides</p>
          <h2 className="mt-2 text-2xl font-bold" id="related-guides-heading">
            이어서 읽을 가이드
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((relatedGuide) => (
              <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5" key={relatedGuide.slug}>
                <time className="text-xs text-zinc-500" dateTime={relatedGuide.date}>
                  {formatGuideDate(relatedGuide.date)}
                </time>
                <h3 className="mt-3 font-semibold leading-6">
                  <Link className="hover:text-violet-300" href={`/guides/${relatedGuide.slug}`}>
                    {relatedGuide.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{relatedGuide.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
