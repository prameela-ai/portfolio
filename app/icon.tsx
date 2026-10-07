import { ImageResponse } from "next/og";

// Favicon: her initials "GP" on navy.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e2a4a",
          color: "#f5f1e8",
          borderRadius: 14,
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        GP
      </div>
    ),
    size,
  );
}
