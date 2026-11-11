import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface TopNavProps {
  brand?: string;
  /** Image shown instead of the brand text (alt text = brand). */
  brandLogo?: string;
  links?: string[];
  active?: string;
  onNavigate?: (link: string | null) => void;
  signInLabel?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
  onSecondary?: () => void;
  onPrimary?: () => void;
  secondaryStyle?: CSSProperties;
  primaryStyle?: CSSProperties;
  compact?: boolean;
  /** Icon shown before each link in the compact dropdown menu, keyed by link label. */
  linkIcons?: Record<string, ReactNode>;
  /** Groups of link labels in the compact dropdown; a divider is drawn between groups. Defaults to one group. */
  menuGroups?: string[][];
  /** Icon for the secondary action, which moves from the bar into the dropdown on narrow screens. */
  secondaryIcon?: ReactNode;
  style?: CSSProperties;
}

const bar: CSSProperties = { width: 16, height: 1.5, background: "#000" };
const separator: CSSProperties = { height: 1, background: "var(--color-hairline-soft)", margin: "8px 0" };

function MenuRow({ icon, label, onClick }: { icon?: ReactNode; label: string; onClick: () => void }) {
  return (
    <button role="menuitem" onClick={onClick}
      className="flex w-full items-center gap-[14px] px-5 text-left transition-colors hover:bg-[var(--color-surface-soft)] focus-visible:bg-[var(--color-surface-soft)] focus-visible:outline-none"
      style={{ height: 44, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 400, letterSpacing: "-0.1px", color: "var(--color-ink)" }}>
      <span aria-hidden="true" className="flex w-5 flex-none items-center justify-center opacity-80">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight aria-hidden="true" size={16} strokeWidth={1.75} className="flex-none opacity-50" />
    </button>
  );
}

export function TopNav({
  brand = "Blockpaper", brandLogo, links = [], active, onNavigate,
  signInLabel = "Log in", secondaryLabel = "Contact sales", primaryLabel = "Get started for free",
  onSecondary, onPrimary, secondaryStyle, primaryStyle, compact = false, linkIcons, menuGroups, secondaryIcon, style,
}: TopNavProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const go = (l: string | null) => { setOpen(false); onNavigate?.(l); };

  // Close the dropdown on an outside click or Escape, like a browser menu.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => { if (!compact) setOpen(false); }, [compact]);

  const groups = menuGroups ?? [links];

  return (
    <header ref={headerRef} style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--color-canvas)", ...style }}>
      {/* Below 560px the bar tightens and the secondary button moves into the dropdown so everything fits on one row. */}
      <div className="flex items-center gap-6 px-6 max-[560px]:gap-3 max-[560px]:px-4" style={{ height: "var(--nav-height)" }}>
        <a onClick={() => go(null)} style={{ fontSize: 22, fontWeight: 540, letterSpacing: "-0.6px", textDecoration: "none", cursor: "pointer", color: "var(--color-ink)", whiteSpace: "nowrap", flex: "none", display: "flex", alignItems: "center" }}>
          {brandLogo ? <img src={brandLogo} alt={brand} style={{ height: 40, width: "auto", display: "block" }} /> : brand}
        </a>
        {compact ? (
          <div style={{ flex: 1 }} />
        ) : (
          <nav style={{ display: "flex", gap: 2, flex: 1 }}>
            {links.map((l) => (
              <Button key={l} variant="tertiary" size="sm" onClick={() => go(l)}
                style={{ fontWeight: active === l ? 540 : 330, textDecoration: active === l ? "underline" : "none" }}>{l}</Button>
            ))}
          </nav>
        )}
        {!compact && <Button variant="tertiary" size="sm" style={{ fontWeight: 330 }}>{signInLabel}</Button>}
        <Button variant="outline" size="sm" onClick={onSecondary} style={secondaryStyle} className={compact ? "max-[560px]:!hidden" : undefined}>{secondaryLabel}</Button>
        <Button variant="primary" size="sm" onClick={onPrimary} style={{ flex: "none", ...primaryStyle }}>{primaryLabel}</Button>
        {compact && (
          <button aria-label="Menu" aria-haspopup="menu" aria-expanded={open} aria-controls="topnav-menu" onClick={() => setOpen(!open)}
            style={{ width: 40, height: 40, flex: "none", border: "none", background: open ? "var(--color-hairline)" : "var(--color-surface-soft)", borderRadius: "var(--radius-full)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "background var(--duration-base)" }}>
            <span style={bar} /><span style={bar} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {compact && open && (
          <motion.div
            id="topnav-menu"
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            style={{
              position: "absolute", top: "calc(var(--nav-height) + 6px)", right: 16,
              width: "min(320px, calc(100vw - 32px))", transformOrigin: "top right",
              background: "var(--color-canvas)", borderRadius: 16, padding: "8px 0",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.16)",
            }}
          >
            {groups.map((group, gi) => (
              <Fragment key={gi}>
                {gi > 0 && <div role="separator" style={separator} />}
                {group.map((l) => <MenuRow key={l} icon={linkIcons?.[l]} label={l} onClick={() => go(l)} />)}
              </Fragment>
            ))}
            {/* Only on narrow screens, where the secondary button is hidden from the bar. */}
            <div className="hidden max-[560px]:block">
              <div role="separator" style={separator} />
              <MenuRow icon={secondaryIcon} label={secondaryLabel} onClick={() => { setOpen(false); onSecondary?.(); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
