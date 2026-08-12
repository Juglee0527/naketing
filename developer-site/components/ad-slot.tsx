interface AdSlotProps {
  placement: "blog-bottom" | "tool-bottom";
}

export function AdSlot({ placement }: AdSlotProps) {
  // AdSense 승인 후 이 경계에서 실제 광고 컴포넌트로 교체합니다.
  return <div className="ad-slot" data-ad-placement={placement} aria-hidden="true" />;
}

