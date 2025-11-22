// app/start/page.tsx
export default function StartPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <h1 className="text-2xl font-bold">시작하기</h1>
            <p className="text-zinc-300">
                나케팅을 어떻게 사용할지, 앞으로 어떤 흐름으로 기능을 추가할지
                안내하는 공간입니다.
            </p>
            <p className="text-zinc-400 text-sm">
                추후에는 회원가입 / 로그인 / 말하기 기록 / 분석 리포트 등
                실제 서비스 진입 화면으로 발전시킬 예정입니다.
            </p>
        </div>
    );
}
