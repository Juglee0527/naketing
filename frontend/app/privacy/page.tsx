import type { Metadata } from "next";
import Link from "next/link";

import { sharedOpenGraphImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "Naketing의 개인정보와 광고 관련 처리 기준을 안내합니다.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Naketing 개인정보 처리방침",
    description: "Naketing의 개인정보와 광고 관련 처리 기준을 안내합니다.",
    url: "/privacy",
    images: [sharedOpenGraphImage],
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
          Naketing은 현재 브라우저에서 동작하는 자기소개 점검 프로그램과 무료 도구를 제공합니다.
          회원가입, 로그인, 문의 양식, 음성 저장, AI 분석과 Analytics는 운영하지 않습니다. 프로그램과
          도구에 입력한 원고는 서버로 전송하거나 저장하지 않습니다.
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
        <h2 className="text-xl font-semibold">Google AdSense 준비 상태와 적용 계획</h2>
        <p className="leading-7 text-zinc-300">
          현재 실제 광고 단위와 광고 노출 기능은 적용되어 있지 않습니다. 사이트 심사를 시작하면 실제
          게시자 ID로 Google AdSense 사이트 확인 스크립트가 로드될 수 있습니다. 향후 광고가 적용되면
          Google을 포함한 제3자 사업자가 광고 제공을 위해 쿠키를 사용할 수 있으며, Google과 파트너는
          이 사이트 또는 다른 사이트의 방문 기록을 활용할 수 있습니다.
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
