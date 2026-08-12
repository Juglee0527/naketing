import Script from "next/script";

import { getAdSensePublisherId } from "@/lib/adsense";

export function AdSenseSiteScript() {
  const publisherId = getAdSensePublisherId();

  if (!publisherId) {
    return null;
  }

  return (
    <Script
      id="naketing-adsense-site-script"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
    />
  );
}
