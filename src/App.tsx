import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { CircleHelp, CreditCard, Headset, MessageSquareQuote, Smartphone, Sparkles } from "lucide-react";
import { Footer, MarqueeStrip, TopNav } from "@/components/ds";
import { NAV, scrollToId } from "@/lib/scroll";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { Intro } from "@/sections/Intro";
import { Demo } from "@/sections/Demo";
import { Reviews } from "@/sections/Reviews";
import { Pricing } from "@/sections/Pricing";
import { Faq } from "@/sections/Faq";
import { Final } from "@/sections/Final";
import { Survey } from "@/sections/Survey";
import { SurveyPopup } from "@/components/SurveyPopup";

const iconProps = { size: 18, strokeWidth: 1.75 };
const MENU_ICONS = {
  "서비스 소개": <Sparkles {...iconProps} />,
  "앱 미리보기": <Smartphone {...iconProps} />,
  "이용 후기": <MessageSquareQuote {...iconProps} />,
  "요금제": <CreditCard {...iconProps} />,
  "자주 묻는 질문": <CircleHelp {...iconProps} />,
};

function useCompact(max: number) {
  const [compact, setCompact] = useState(() => window.innerWidth < max);
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < max);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [max]);
  return compact;
}

export default function App() {
  const compact = useCompact(1100);
  return (
    <MotionConfig reducedMotion="user">
      <SurveyPopup />
      <TopNav
        brand="부치기 바치기"
        brandLogo={`${import.meta.env.BASE_URL}assets/logo-lockup.png`}
        links={Object.keys(NAV)}
        onNavigate={(l) => (l ? scrollToId(NAV[l]) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        signInLabel="로그인"
        secondaryLabel="상담 문의"
        primaryLabel="무료로 시작"
        onPrimary={() => scrollToId("pricing")}
        onSecondary={() => scrollToId("faq")}
        compact={compact}
        linkIcons={MENU_ICONS}
        secondaryIcon={<Headset {...iconProps} />}
        menuGroups={[["서비스 소개", "앱 미리보기", "이용 후기"], ["요금제", "자주 묻는 질문"]]}
        style={{ background: "#B9CEF0" }}
        secondaryStyle={{ borderRadius: 16 }}
        primaryStyle={{ borderRadius: 16 }}
      />
      <MarqueeStrip items={["추억 되새김 음성 대화", "가족 기념일 알림", "‘1년 전 오늘’ 추억 영상", "자녀에게 대화 기록 전달", "검사가 아닌 일상 대화", "앱 설치 없이 전화로"]} />
      <main>
        <Hero />
        <Problem />
        <Intro />
        <Demo />
        <Reviews />
        <Pricing />
        <Faq />
        <Final />
        <Survey />
      </main>
      <Footer
        brand="부치기 바치기"
        columns={[
          { title: "서비스", links: ["추억 대화", "기념일 알림", "1년 전 오늘"] },
          { title: "요금", links: ["체험", "가족", "가족 플러스"] },
          { title: "고객센터", links: ["자주 묻는 질문", "상담 문의", "개인정보 처리방침"] },
        ]}
        legal="© 2026 No Drop · 부치기 바치기는 의료 진단 서비스가 아닙니다."
      />
    </MotionConfig>
  );
}
