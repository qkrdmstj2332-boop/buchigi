import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button, ColorBlock } from "@/components/ds";
import {
  DETAIL_QUESTIONS, getDetailsDone, getSavedAnswer, saveAnswer, submitAnswer, submitDetails,
  type SurveyAnswer, type SurveyDetails,
} from "@/lib/survey";

const EASE = [0.16, 1, 0.3, 1] as const;

// Variants take the direction through `custom`, so the leaving card also slides the right way when going back.
const SLIDE = {
  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
};

export function Survey() {
  const [answer, setAnswer] = useState<SurveyAnswer | null>(() => getSavedAnswer());
  // A "yes" from an earlier visit that never finished the follow-up questions resumes them.
  const [detailsDone, setDetailsDone] = useState(() => getDetailsDone());

  const choose = (a: SurveyAnswer) => {
    saveAnswer(a);
    submitAnswer(a);
    setAnswer(a);
    if (a === "yes") setDetailsDone(false);
  };

  const finishDetails = (d: SurveyDetails) => {
    submitDetails(d);
    setDetailsDone(true);
  };

  const asking = answer === "yes" && !detailsDone;
  const thanked = answer === "no" || (answer === "yes" && detailsDone);

  return (
    <section className="wrap sec" id="survey">
      <ColorBlock color="lilac" align="center" style={{ background: "#B9CEF0", padding: "80px var(--space-xxl)" }}>
        {asking ? (
          <DetailSteps onDone={finishDetails} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", alignItems: "center", width: "100%", minWidth: 0 }}>
              <h2 className="survey-q">{thanked ? "응답해 주셔서 감사합니다!" : "이런 어플이 출시된다면 참여하시겠어요?"}</h2>
              {thanked && (
                <p className="t-subhead" style={{ margin: 0 }}>
                  {answer === "yes" ? "출시 소식을 가장 먼저 전해드릴게요." : "소중한 의견, 서비스 개선에 참고할게요."}
                </p>
              )}
            </div>
            {thanked ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="tertiary" onClick={() => setAnswer(null)}>응답 다시 하기</Button>
              </motion.div>
            ) : (
              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="secondary" onClick={() => choose("no")} style={{ padding: "10px 28px" }}>아니요</Button>
                <Button onClick={() => choose("yes")} style={{ padding: "10px 28px" }}>네, 참여할게요</Button>
              </div>
            )}
          </>
        )}
      </ColorBlock>
    </section>
  );
}

// Three follow-up questions shown one at a time; picking an option slides to the next.
function DetailSteps({ onDone }: { onDone: (d: SurveyDetails) => void }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [picked, setPicked] = useState<Partial<SurveyDetails>>({});
  const q = DETAIL_QUESTIONS[step];
  const total = DETAIL_QUESTIONS.length;

  const pick = (option: string) => {
    const next = { ...picked, [q.key]: option };
    setPicked(next);
    if (step + 1 < total) {
      setDir(1);
      setStep(step + 1);
    } else {
      onDone(next as SurveyDetails);
    }
  };

  const back = () => {
    setDir(-1);
    setStep(step - 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-lg)", width: "100%", minWidth: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label={`${total}개 중 ${step + 1}번째 질문`}>
        {DETAIL_QUESTIONS.map((d, i) => (
          <span key={d.key} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 999, background: i <= step ? "var(--color-ink)" : "rgba(0,0,0,.18)", transition: "width var(--duration-base) var(--ease-standard), background var(--duration-base)" }} />
        ))}
        <span className="t-body-sm" style={{ marginLeft: 6, fontWeight: 480 }}>{step + 1} / {total}</span>
      </div>

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.div
          key={q.key}
          custom={dir}
          variants={SLIDE}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-lg)", width: "100%", minWidth: 0 }}
        >
          <h2 className="survey-q">{q.question}</h2>
          <div role="group" aria-label={q.question} style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap", maxWidth: 720 }}>
            {q.options.map((o) => {
              const sel = picked[q.key] === o;
              return (
                <Button key={o} variant={sel ? "primary" : "secondary"} aria-pressed={sel} onClick={() => pick(o)} style={{ padding: "10px 22px" }}>
                  {o}
                </Button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ minHeight: 44 }}>
        {step > 0 && (
          <Button variant="tertiary" onClick={back} iconStart={<ArrowLeft size={18} strokeWidth={1.75} />}>이전</Button>
        )}
      </div>
    </div>
  );
}
