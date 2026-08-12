import { ImageResponse } from "next/og";

import { siteConfig } from "./site";

export const socialImageSize = { width: 1200, height: 630 } as const;

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #27272a",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "64px",
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: "20px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#8b5cf6",
                borderRadius: "20px",
                display: "flex",
                fontSize: "34px",
                fontWeight: 800,
                height: "72px",
                justifyContent: "center",
                width: "72px",
              }}
            >
              N
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "34px", fontWeight: 700 }}>{siteConfig.name}</span>
              <span style={{ color: "#a1a1aa", fontSize: "20px" }}>MARKET YOURSELF</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
            <span style={{ color: "#c4b5fd", fontSize: "24px", fontWeight: 600 }}>
              SPEAKING · SELF INTRODUCTION · PERSONAL BRANDING
            </span>
            <span style={{ fontSize: "58px", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.2, marginTop: "20px" }}>
              Write it yourself. Make it clear.
            </span>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
