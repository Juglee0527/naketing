import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "Naketing의 개인정보와 광고 관련 처리 기준을 안내합니다.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Naketing 개인정보 처리방침",
    description: "Naketing의 개인정보와 광고 관련 처리 기준을 안내합니다.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-violet-300">Privacy</p>
        <h1 className="text-3xl font-bold">개인정보 처리방침</h1>
        <p className="text-sm text-zinc-500">시행일: 2026년 8월 12일</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">현재 제공 상태</h2>
        <p className="leading-7 text-zinc-300">
          Naketing은 현재 서비스 소개 페이지를 제공하며 회원가입, 로그인, 문의 양식, 음성 저장,
          AI 분석, Analytics와 광고 기능을 운영하지 않습니다. 사용자가 사이트 화면에 직접 입력하거나
          제출하는 개인정보를 수집하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">호스팅 과정에서 처리될 수 있는 정보</h2>
        <p className="leading-7 text-zinc-300">
          사이트 제공과 보안 과정에서 호스팅 사업자가 IP 주소, 브라우저 정보, 요청 시각과 같은
          접속 정보를 처리할 수 있습니다. 해당 정보의 처리는 호스팅 사업자의 정책과 적용되는 법령을
          따릅니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Google AdSense 적용 계획</h2>
        <p className="leading-7 text-zinc-300">
          현재 Google AdSense 광고 코드는 적용되어 있지 않습니다. 향후 광고가 적용되면 Google을
          포함한 제3자 사업자가 이전 방문 기록을 바탕으로 광고를 제공하기 위해 쿠키를 사용할 수
          있으며, Google과 파트너는 이 사이트 또는 다른 사이트 방문 기록을 활용할 수 있습니다.
        </p>
        <p className="leading-7 text-zinc-300">
          사용자는 Google의 광고 설정에서 맞춤 광고 사용 여부를 관리할 수 있습니다. 실제 광고 적용
          전에 필요한 동의 관리 기능과 이 방침을 다시 검토하고 변경 사항을 반영합니다.
        </p>
        <Link
          className="inline-flex text-sm font-medium text-violet-300 hover:text-violet-200"
          href="https://myadcenter.google.com/"
          target="_blank"
          rel="noreferrer"
        >
          Google 광고 설정 열기 →
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">문의</h2>
        <p className="leading-7 text-zinc-300">
          개인정보와 서비스 운영에 관한 문의 방법은 문의 페이지에서 확인할 수 있습니다.
        </p>
        <Link className="inline-flex text-sm font-medium text-violet-300 hover:text-violet-200" href="/contact">
          문의 방법 확인 →
        </Link>
      </section>
    </div>
  );
}
