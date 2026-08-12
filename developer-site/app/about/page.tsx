import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Web Developer 이정근의 기술 관심사와 프로젝트 경험을 소개합니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "이정근 | Web Developer",
    description: "기술 관심사와 프로젝트 경험을 소개합니다.",
    url: "/about",
  },
};

const skills = ["Java", "Spring Boot", "JPA", "QueryDSL", "TypeScript", "React", "Next.js"];

export default function AboutPage() {
  return (
    <div className="page-container max-w-4xl">
      <p className="eyebrow">About</p>
      <h1 className="page-heading mt-3">이정근</h1>
      <p className="page-description">
        Web Developer로서 읽기 쉽고 안정적으로 동작하는 웹 서비스를 만드는 데 관심이 있습니다.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="content-card">
          <h2 className="text-lg font-semibold text-white">기술 스택</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li className="tag" key={skill}>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="content-card">
          <h2 className="text-lg font-semibold text-white">링크</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">GitHub</dt>
              <dd className="mt-1">
                <Link
                  className="text-violet-300 hover:text-violet-200"
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/Juglee0527
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">연락처</dt>
              <dd className="mt-1 text-slate-300">TODO: 공개할 연락처를 입력해 주세요.</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 content-card">
        <h2 className="text-lg font-semibold text-white">경력과 경험</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          TODO: 공개 가능한 경력과 담당 역할, 주요 성과를 확인한 뒤 추가해 주세요.
        </p>
      </section>
    </div>
  );
}

