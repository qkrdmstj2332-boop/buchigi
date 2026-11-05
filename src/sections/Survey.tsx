import { useState } from "react";
import { motion } from "motion/react";
import { Button, ColorBlock } from "@/components/ds";
import { getSavedAnswer, saveAnswer, submitAnswer, type SurveyAnswer } from "@/lib/survey";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Survey() {
  const [answer, setAnswer] = useState<SurveyAnswer | null>(() => getSavedAnswer());

  const choose = (a: SurveyAnswer) => {
    saveAnswer(a);
    submitAnswer(a);
    setAnswer(a);
  };

  return (
    <section className="wrap sec" id="survey">
      <ColorBlock color="lilac" align="center" style={{ background: "#B9CEF0", padding: "80px var(--space-xxl)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", alignItems: "center", width: "100%", minWidth: 0 }}>
          <h2 className="survey-q">{answer ? "응답해 주셔서 감사합니다!" : "이런 어플이 출시된다면 참여하시겠어요?"}</h2>
          {answer && (
            <p className="t-subhead" style={{ margin: 0 }}>
              {answer === "yes" ? "출시 소식을 가장 먼저 전해드릴게요." : "소중한 의견, 서비스 개선에 참고할게요."}
            </p>
          )}
        </div>
        {answer ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="tertiary" onClick={() => setAnswer(null)}>응답 다시 하기</Button>
          </motion.div>
        ) : (
          <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={() => choose("no")} style={{ padding: "10px 28px" }}>아니요</Button>
            <Button onClick={() => choose("yes")} style={{ padding: "10px 28px" }}>네, 참여할게요</Button>
          </div>
        )}
      </ColorBlock>
    </section>
  );
}
