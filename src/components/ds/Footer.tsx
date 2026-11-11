import type { CSSProperties } from "react";

interface FooterProps {
  brand?: string;
  columns?: { title: string; links: string[] }[];
  legal?: string;
  style?: CSSProperties;
}

export function Footer({ brand = "Blockpaper", columns = [], legal, style }: FooterProps) {
  return (
    <footer style={{ background: "var(--color-canvas)", color: "var(--color-ink)", padding: "var(--space-section) var(--space-xl)", ...style }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-xl)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: "var(--weight-display)", letterSpacing: "-1px", lineHeight: 1 }}>{brand}</div>
        {columns.map((c) => (
          <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <div className="t-caption" style={{ marginBottom: 4 }}>{c.title}</div>
            {c.links.map((l) => <a key={l} className="t-body-sm" style={{ textDecoration: "none", cursor: "pointer" }}>{l}</a>)}
          </div>
        ))}
      </div>
      {legal && (
        <div className="t-caption" style={{ maxWidth: "var(--container-max)", margin: "var(--space-xxl) auto 0", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--color-hairline-soft)" }}>{legal}</div>
      )}
    </footer>
  );
}
