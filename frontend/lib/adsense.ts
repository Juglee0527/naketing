const publisherIdPattern = /^ca-pub-\d{16}$/;

export function getAdSensePublisherId(): string | null {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID?.trim();

  if (!publisherId) {
    return null;
  }

  if (!publisherIdPattern.test(publisherId)) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID는 ca-pub- 뒤에 숫자 16개가 오는 실제 AdSense publisher ID여야 합니다.",
    );
  }

  return publisherId;
}
