import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Link-preview image (WhatsApp, LinkedIn, X): character on the right, name and role on the left.
export const alt = "Gogada Prameela – ECE Student, Software & Embedded";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const poster = await readFile(join(process.cwd(), "public/intro-poster.jpg"));
  const posterSrc = `data:image/jpeg;base64,${poster.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f5f1e8", color: "#1e2a4a" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 560 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#545b6b", fontWeight: 700 }}>B.TECH ECE · CLASS OF 2027</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, marginTop: 20 }}>Gogada Prameela</div>
          <div style={{ fontSize: 40, marginTop: 24, fontStyle: "italic" }}>Software & Embedded</div>
          <div style={{ fontSize: 24, marginTop: 28, color: "#545b6b" }}>C · Python · CAN bus · Raspberry Pi · ESP32</div>
        </div>
        {/* Character on the right, cropped from the 16:9 still. */}
        <div style={{ display: "flex", position: "relative", overflow: "hidden", width: 640, height: 630, background: "#ffffff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not a page */}
          <img src={posterSrc} alt="" width={1120} height={630} style={{ position: "absolute", left: -240, top: 0 }} />
        </div>
      </div>
    ),
    size,
  );
}
