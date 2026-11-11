import { useState } from "react";
import { motion } from "motion/react";
import { Button, PillTabs, PricingCard } from "@/components/ds";
import { GlowCard } from "@/components/ui/spotlight-card";
import { openApp } from "@/lib/app";

// Same easing as the testimonials section so the two reveals feel like one system.
const EASE = [0.16, 1, 0.3, 1] as const;

export function Pricing() {
  const [period, setPeriod] = useState("월간 결제");
  const y = period !== "월간 결제";
  const plans = [
    { tier: "체험", price: "0원", cad: "/ 2주", d: "처음 시작하는 가족께", f: ["추억 대화 주 2회", "기념일 알림", "자녀 1명 기록 확인"], cta: "무료로 시작하기" },
    { tier: "가족", price: y ? "8,170원" : "9,800원", cad: "/ 월", d: y ? "연 98,000원 · 2개월 무료" : "부모님 한 분과 자녀를 위해", f: ["추억 대화 주 3회", "기념일·행사 알림", "‘1년 전 오늘’ 영상 월 2편", "월간 대화 기록 리포트", "자녀 2명까지 함께 보기"], cta: "가족 요금제 시작", hi: true },
    { tier: "가족 플러스", price: y ? "13,330원" : "16,000원", cad: "/ 월", d: y ? "연 160,000원 · 2개월 무료" : "두 분 부모님과 형제자매 모두", f: ["부모님 두 분 각각 대화", "‘1년 전 오늘’ 영상 매주", "자녀 5명까지 함께 보기", "변화가 보이면 전문 상담 연결"], cta: "플러스 시작" },
  ];
  return (
    <section className="wrap sec" id="pricing">
      <motion.div
        className="head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        viewport={{ once: true }}
      >
        <div className="t-eyebrow">요금제</div>
        <h2 className="t-display-lg">커피 두 잔 값으로 매주 안부를 전해요</h2>
        <p className="t-subhead">처음 2주는 무료. 마음에 들지 않으면 언제든 해지할 수 있어요.</p>
      </motion.div>
      <PillTabs options={["월간 결제", "연간 결제"]} value={period} onChange={setPeriod} style={{ marginBottom: "var(--space-xl)" }} />
      <div className="g3">
        {plans.map((t, i) => (
          <motion.div
            key={t.tier}
            className="flex"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <GlowCard customSize glowColor="blue" backdrop="var(--color-canvas)" radius={24} className="flex flex-1 rounded-[24px] p-0 shadow-none backdrop-blur-none">
            <PricingCard
              tier={t.tier}
              // Re-keying on the value replays the slide-in whenever 월간/연간 is switched.
              price={<motion.span key={t.price} className="inline-block" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>{t.price}</motion.span>}
              cadence={t.cad}
              description={<motion.span key={t.d} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>{t.d}</motion.span>}
              features={t.f}
              highlighted={t.hi}
              cta={<Button fullWidth variant={t.hi ? "primary" : "outline"} onClick={openApp}>{t.cta}</Button>}
              style={{ padding: "var(--space-xl)", flex: 1, borderRadius: 21 }}
            />
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
