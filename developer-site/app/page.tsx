import Link from "next/link";

import { formatPostDate, getAllPosts } from "@/lib/blog";
import { tools } from "@/lib/tools";

const techStack = ["Java", "Spring Boot", "TypeScript", "React", "Next.js"];

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div>
      <section className="border-b border-slate-800">
        <div className="page-container grid gap-10 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Web Developer</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              안녕하세요.
              <br />
              개발자 <span className="text-violet-300">이정근</span>입니다.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              이해하기 쉽고 안정적인 웹 서비스를 만듭니다. 이곳에 개발 과정에서 배운 내용과 프로젝트,
              바로 사용할 수 있는 개발자 도구를 기록합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button-primary" href="/blog">
                글 읽기
              </Link>
              <Link className="button-secondary" href="/tools">
                도구 사용하기
              </Link>
            </div>
          </div>

          <aside className="content-card" aria-label="주요 기술 스택">
            <p className="text-sm font-semibold text-slate-400">Main stack</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <li className="tag" key={tech}>
                  {tech}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-slate-400">
              현재 저장소와 프로젝트 문서에서 확인된 기술을 기준으로 표시했습니다.
            </p>
          </aside>
        </div>
      </section>

      <section className="page-container">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Blog", "개발 중 마주친 문제와 해결 기준을 정리합니다.", "/blog"],
            ["Tools", "서버 전송 없이 브라우저에서 처리하는 무료 도구를 제공합니다.", "/tools"],
            ["Projects", "문제와 해결 방식 중심으로 프로젝트 경험을 기록합니다.", "/projects"],
          ].map(([title, description, href]) => (
            <Link className="content-card transition-colors hover:border-violet-500/60" href={href} key={title}>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="page-container">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recent posts</p>
              <h2 className="mt-2 text-2xl font-bold text-white">최근 블로그 글</h2>
            </div>
            <Link className="text-sm text-violet-300 hover:text-violet-200" href="/blog">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {recentPosts.map((post) => (
              <article className="content-card" key={post.slug}>
                <time className="text-xs text-slate-500" dateTime={post.date}>
                  {formatPostDate(post.date)}
                </time>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  <Link className="hover:text-violet-300" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{post.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container">
        <p className="eyebrow">Featured tools</p>
        <h2 className="mt-2 text-2xl font-bold text-white">주요 개발자 도구</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {tools.map((tool) => (
            <Link className="content-card transition-colors hover:border-violet-500/60" href={`/tools/${tool.slug}`} key={tool.slug}>
              <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{tool.description}</p>
              <p className="mt-5 text-sm font-medium text-violet-300">도구 열기 →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

