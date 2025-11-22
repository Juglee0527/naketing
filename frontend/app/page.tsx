export default function Home() {
  return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            나를 표현하는 기술, <span className="text-violet-400">나케팅</span>
          </h1>

          <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
            AI 시대, 말하기는 새로운 경쟁력입니다.
            나케팅은 당신의 <span className="text-violet-300">말하기 능력</span>과
            <span className="text-violet-300">브랜딩 역량</span>을
            AI 기반으로 성장시키는 개인 브랜딩 플랫폼입니다.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <button className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-medium text-sm md:text-base">
              시작하기 (Coming Soon)
            </button>

            <button className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-900 font-medium text-sm md:text-base">
              나케팅 소개 보기
            </button>
          </div>
        </div>
      </main>
  );
}
