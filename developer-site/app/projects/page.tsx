import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description: "이정근이 만들고 개선하는 개발 프로젝트를 문제와 해결 방식 중심으로 소개합니다.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "개발 프로젝트",
    description: "문제와 해결 방식 중심으로 프로젝트 경험을 기록합니다.",
    url: "/projects",
  },
};

interface Project {
  name: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  href: string;
  linkLabel: string;
}

const projects: Project[] = [
  {
    name: "Naketing",
    description: "말하기, 표현력, 브랜딩 역량을 다루는 퍼스널 브랜딩 서비스입니다.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    problem: "자신을 명확하게 설명하고 표현하는 능력을 어떻게 지원할지 탐색합니다.",
    solution: "현재는 핵심 가치와 서비스 방향을 전달하는 정적 웹 인터페이스를 운영합니다.",
    href: "https://www.naketing.co.kr/",
    linkLabel: "Naketing 방문",
  },
  {
    name: "Developer Tools",
    description: "설치나 로그인 없이 즉시 사용할 수 있는 브라우저 기반 개발자 도구 모음입니다.",
    technologies: ["Next.js", "TypeScript", "Web APIs"],
    problem: "개발 중 반복되는 간단한 변환 작업에도 외부 서비스나 별도 프로그램이 필요합니다.",
    solution: "입력값을 서버로 보내지 않고 브라우저 안에서 처리하는 작은 도구부터 제공합니다.",
    href: "/tools",
    linkLabel: "도구 보기",
  },
];

export default function ProjectsPage() {
  return (
    <div className="page-container">
      <p className="eyebrow">Projects</p>
      <h1 className="page-heading mt-3">프로젝트</h1>
      <p className="page-description">
        확인 가능한 현재 범위만 기록했습니다. 프로젝트가 진행되면 결과와 기술적 판단을 보완합니다.
      </p>

      <div className="mt-10 space-y-6">
        {projects.map((project) => (
          <article className="content-card" key={project.name}>
            <h2 className="text-2xl font-semibold text-white">{project.name}</h2>
            <p className="mt-3 leading-7 text-slate-300">{project.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="주요 기술">
              {project.technologies.map((technology) => (
                <li className="tag" key={technology}>
                  {technology}
                </li>
              ))}
            </ul>
            <dl className="mt-7 grid gap-5 md:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-200">문제</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-400">{project.problem}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-200">해결 방식</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-400">{project.solution}</dd>
              </div>
            </dl>
            <Link
              className="mt-7 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200"
              href={project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              rel={project.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {project.linkLabel} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

