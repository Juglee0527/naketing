import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const alt = "Naketing - 나를 설명하는 말을 직접 쓰고 점검하는 서비스";
export const size = socialImageSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialImage();
}
