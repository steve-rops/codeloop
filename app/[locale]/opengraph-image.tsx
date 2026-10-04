import { ImageResponse } from "next/og";

export const alt = "codeloop — web design & development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The default share card for every page that doesn't bring its own image: the
// loop mark and the wordmark on the dark ground the footer uses.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0f0f0f",
          color: "#fafafa",
        }}
      >
        <svg viewBox="0 0 200 100" width="280" height="140">
          <defs>
            <linearGradient id="loop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d="M 100 50 C 130 5, 190 5, 190 50 C 190 95, 130 95, 100 50 C 70 5, 10 5, 10 50 C 10 95, 70 95, 100 50 Z"
            fill="none"
            stroke="url(#loop)"
            strokeWidth="9"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, letterSpacing: -5, lineHeight: 1 }}>
            codeloop
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#949494",
            }}
          >
            Web design & development
          </div>
        </div>
      </div>
    ),
    size,
  );
}
