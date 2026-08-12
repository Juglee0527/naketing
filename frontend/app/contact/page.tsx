import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "문의",
  description: "Naketing 서비스 관련 문의 방법을 안내합니다.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Naketing 문의",
    description: "Naketing 서비스 관련 문의 방법을 안내합니다.",
    url: "/contact",
  },
};

const githubUrl = "https://github.com/Juglee0527";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
      <div className="space-y-3">
        <p className="text-sm font-medium text-violet-300">Contact</p>
        <h1 className="text-3xl font-bold">문의</h1>
        <p className="max-w-2xl leading-7 text-zinc-300">
          Naketing의 서비스 방향, 콘텐츠 또는 오류에 관한 의견은 아래 GitHub 프로필을 통해
          전달해 주세요.
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-lg font-semibold">공개 문의 채널</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          현재 별도의 문의 양식이나 공개 이메일은 운영하지 않습니다. GitHub 프로필에서 공개된
          연락 방법만 사용합니다.
        </p>
        <Link
          className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub 프로필 열기
        </Link>
      </section>
    </div>
  );
}
