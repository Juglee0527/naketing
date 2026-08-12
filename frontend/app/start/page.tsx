// app/start/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "시작하기",
    description: "Naketing이 해결하려는 문제와 앞으로 제공할 프로그램을 안내합니다.",
    alternates: { canonical: "/start" },
    openGraph: {
        title: "Naketing 시작하기",
        description: "Naketing이 해결하려는 문제와 앞으로 제공할 프로그램을 안내합니다.",
        url: "/start",
    },
};

export default function StartPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <h1 className="text-2xl font-bold">시작하기</h1>
            <p className="text-zinc-300">
                현재는 나케팅이 해결하려는 문제와 앞으로 제공할 프로그램을
                안내하고 있습니다.
            </p>
            <p className="text-zinc-400 text-sm">
                회원가입, 로그인, 말하기 기록, AI 분석과 분석 리포트는 아직 제공하지 않습니다.
                각 기능은 실제로 사용할 수 있는 상태가 된 뒤 이 화면에서 안내하겠습니다.
            </p>
        </div>
    );
}
