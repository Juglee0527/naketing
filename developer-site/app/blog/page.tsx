import type { Metadata } from "next";
import Link from "next/link";

import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "개발 과정에서 배운 내용과 문제 해결 기준을 정리한 이정근의 개발 블로그입니다.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "개발 블로그",
    description: "개발 과정에서 배운 내용과 문제 해결 기준을 기록합니다.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="page-container">
      <p className="eyebrow">Blog</p>
      <h1 className="page-heading mt-3">개발 기록</h1>
      <p className="page-description">
        기술 자체보다 왜 그 방식을 선택했는지, 어떤 경계에서 문제가 생기는지를 중심으로 정리합니다.
      </p>

      <div className="mt-10 space-y-5">
        {posts.length === 0 ? (
          <p className="content-card text-slate-400">아직 작성된 글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <article className="content-card" key={post.slug}>
              <time className="text-xs text-slate-500" dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>
              <h2 className="mt-3 text-xl font-semibold text-white">
                <Link className="hover:text-violet-300" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 leading-7 text-slate-400">{post.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="태그">
                {post.tags.map((tag) => (
                  <li className="tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

