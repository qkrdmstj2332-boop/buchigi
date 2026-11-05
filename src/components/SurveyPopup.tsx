import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ds";
import { getSavedAnswer } from "@/lib/survey";
import { scrollToId } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1] as const;

// Shown once on load to visitors who haven't answered the survey yet.
export function SurveyPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getSavedAnswer()) return;
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scrim"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--color-overlay-scrim)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="survey-title"
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
                <span className="t-body-sm" style={{ fontWeight: 480 }}>부치기 바치기 수요 조사</span>
              </div>
              <button aria-label="닫기" onClick={() => setOpen(false)}
                style={{ all: "unset", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-ink)" }}>
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div style={{ padding: "28px 24px", minHeight: 150 }}>
              <p className="t-body-sm" style={{ margin: 0 }}>안녕하세요. 한양대학교 테크노경영 5조 NO DROP입니다.</p>
              <h2 id="survey-title" style={{ fontSize: 22, fontWeight: 540, lineHeight: 1.45, letterSpacing: "-0.26px", margin: "12px 0 0", wordBreak: "keep-all" }}>
                이 사이트를 배포해 수요 조사를 진행하고 있어요.<br />
                이와 같은 어플이 출시된다면 참여하시는지 궁금합니다.<br />
                스크롤을 내려서 투표해주세요
              </h2>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px 20px", borderTop: "1px solid var(--color-hairline-soft)" }}>
              <Button onClick={() => { setOpen(false); setTimeout(() => scrollToId("survey"), 50); }} iconEnd={<ArrowDown size={18} strokeWidth={1.75} />}>
                스크롤 내리기
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
