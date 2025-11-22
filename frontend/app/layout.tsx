// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
    title: "Naketing - 나케팅",
    description: "나를 마케팅하다",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body className="bg-zinc-950 text-white">
        <div className="flex min-h-screen flex-col">
            {/* NAVBAR */}
            <header className="border-b border-zinc-800 bg-zinc-950/90">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
                    {/* 로고 */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-violet-500 flex items-center justify-center text-xs font-bold">
                            N
                        </div>
                        <div className="flex flex-col leading-none">
                  <span className="font-semibold text-sm md:text-base">
                    Naketing
                  </span>
                            <span className="text-[11px] text-zinc-400 md:text-xs">
                    나를 마케팅하다
                  </span>
                        </div>
                    </Link>

                    {/* 메뉴 */}
                    <div className="flex items-center gap-5 text-sm text-zinc-300">
                        <Link href="/start" className="hover:text-violet-300">
                            시작하기
                        </Link>
                        <Link href="/about" className="hover:text-violet-300">
                            회사소개
                        </Link>
                        <Link href="/founder" className="hover:text-violet-300">
                            대표소개
                        </Link>
                        <Link href="/program" className="hover:text-violet-300">
                            프로그램 소개
                        </Link>
                    </div>
                </nav>
            </header>

            {/* 본문: 남은 높이를 전부 차지 + flex 컨테이너 */}
            <main className="flex flex-1">
                {children}
            </main>

            {/* 푸터 */}
            <footer className="border-t border-zinc-800 bg-zinc-950/80">
                <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500 md:px-6">
                    © {new Date().getFullYear()} Naketing. Made by Junggeun Lee.
                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}