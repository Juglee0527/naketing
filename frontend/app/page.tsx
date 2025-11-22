// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
      // main이 flex 컨테이너이기 때문에 m-auto 한 줄로
      // 가로/세로 둘 다 가운데 정렬됩니다.
      <div className="m-auto max-w-2xl px-4 text-center space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1 text-xs text-violet-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          AI 기반 말하기 & 퍼스널 브랜딩 코치
        </p>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          말을 바꾸면
          <br />
          <span className="text-violet-400">나를 바꿀 수 있습니다.</span>
        </h1>

        <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
          나케팅은 말하기·표현력·브랜딩 역량을 AI로 분석하고 코칭하는
          서비스입니다.{" "}
          <span className="text-violet-300">
          “나를 어떻게 설명할 것인가”
        </span>
          에 집중하여, 개발자 이정근이 직접 설계하고 만드는 플랫폼입니다.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <Link
              href="/start"
              className="rounded-xl bg-violet-600 px-6 py-3 text-sm md:text-base font-medium text-white hover:bg-violet-700"
          >
            시작하기
          </Link>

          <Link
              href="/program"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm md:text-base text-zinc-200 hover:bg-zinc-900"
          >
            나케팅 소개 보기
          </Link>
        </div>
      </div>
  );
}