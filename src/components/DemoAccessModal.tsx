import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ds";
import { DEMO_CODE, DEMO_SERVER, demoAppLink } from "@/lib/demo";

const EASE = [0.16, 1, 0.3, 1] as const;

// Opened by "무료로 시작": shows the shared demo server address and family code, and opens the child app with them.
export function DemoAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="demo-scrim"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--color-overlay-scrim)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ width: "100%", maxWidth: 520, background: "var(--color-canvas)", borderRadius: 24, boxShadow: "var(--elevation-3)", overflow: "hidden", fontFamily: "var(--font-sans)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "20px 24px", borderBottom: "1px solid var(--color-hairline-soft)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#B9CEF0", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)" }} />
                <span className="t-body-sm" style={{ fontWeight: 480 }}>체험용 가족 계정</span>
              </div>
              <button aria-label="닫기" onClick={onClose}
                style={{ all: "unset", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-ink)" }}>
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 id="demo-title" style={{ fontSize: 22, fontWeight: 540, lineHeight: 1.45, letterSpacing: "-0.26px", margin: 0, wordBreak: "keep-all" }}>
                우리 가족코드 발급 완료!
              </h2>
              <CopyField label="서버 주소" value={DEMO_SERVER} emptyText="서버 준비 중이에요" />
              <CopyField label="가족 코드" value={DEMO_CODE} mono />
              <p className="t-body-sm" style={{ margin: 0, opacity: 0.6 }}>*배포용 코드입니다</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px 20px", borderTop: "1px solid var(--color-hairline-soft)" }}>
              <Button variant="outline" onClick={onClose}>닫기</Button>
              <Button onClick={() => window.open(demoAppLink(), "_blank", "noopener")} iconEnd={<ExternalLink size={18} strokeWidth={1.75} />}>
                앱 열기
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CopyField({ label, value, emptyText, mono = false }: { label: string; value: string; emptyText?: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt(`${label}를 복사해 주세요`, value);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="t-body-sm" style={{ fontWeight: 540 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-surface-soft)", borderRadius: 14, padding: "10px 10px 10px 16px", minHeight: 52 }}>
        <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere", fontFamily: mono ? "var(--font-mono)" : undefined, fontSize: mono ? 18 : 16, fontWeight: mono ? 500 : 400, letterSpacing: mono ? "0.5px" : undefined, opacity: value ? 1 : 0.5 }}>
          {value || emptyText}
        </span>
        {value && (
          <button onClick={copy} aria-label={`${label} 복사`}
            style={{ all: "unset", cursor: "pointer", flex: "none", display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: "var(--color-canvas)", boxShadow: "inset 0 0 0 1px var(--color-hairline)", fontSize: 14, fontWeight: 480 }}>
            {copied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={1.75} />}
            {copied ? "복사됨" : "복사"}
          </button>
        )}
      </div>
    </div>
  );
}
