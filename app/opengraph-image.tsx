import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Stephan Malobeka — Computer Systems Engineer & Full-Stack Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b0e14 0%, #10241c 55%, #0b0e14 100%)",
          color: "#f4f6f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 32,
            color: "#45fe84",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              backgroundColor: "#45fe84",
            }}
          />
          Open to opportunities — Ndola, Zambia
        </div>

        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
          Stephan Malobeka
        </div>

        <div style={{ fontSize: 40, color: "#9aa4a0", marginTop: 20 }}>
          Computer Systems Engineer &amp; Full-Stack Developer
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 48,
            fontSize: 28,
            color: "#45fe84",
          }}
        >
          <span>React</span>
          <span>Node.js</span>
          <span>Telecom &amp; Networking</span>
          <span>IoT</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
