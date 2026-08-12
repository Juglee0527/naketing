import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[55vh] flex-col items-start justify-center">
      <p className="eyebrow">404</p>
      <h1 className="page-heading mt-3">페이지를 찾을 수 없습니다.</h1>
      <p className="page-description">주소가 올바른지 확인하거나 홈에서 다시 시작해 주세요.</p>
      <Link className="button-primary mt-8" href="/">
        홈으로 이동
      </Link>
    </div>
  );
}
