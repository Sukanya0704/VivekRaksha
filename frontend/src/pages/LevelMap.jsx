import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Smartphone,
  PhoneOff,
  Lock,
  Vault,
  BadgeCheck,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────── */
const LEVELS = [
  {
    id: 1,
    side: "left",
    titleKey: "level1Title",
    icon: Shield,
    color: "#FF9F1C",
    accent: "rgba(255,159,28,0.15)",
    glow: "rgba(255,159,28,0.35)",
    path: "/banking/upi-setup",
    badge: "PIN PROTECTOR",
    descKey: "level1Desc",
  },
  {
    id: 2,
    side: "right",
    titleKey: "level2Title",
    icon: Smartphone,
    color: "#10B981",
    accent: "rgba(16,185,129,0.15)",
    glow: "rgba(16,185,129,0.35)",
    path: "/banking/upi",
    badge: "PAYMENT GUARDIAN",
    descKey: "level2Desc",
  },
  {
    id: 3,
    side: "left",
    titleKey: "level3Title",
    icon: PhoneOff,
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.15)",
    glow: "rgba(245,158,11,0.35)",
    path: "/banking/fraud",
    badge: "SCAM BUSTER",
    descKey: "level3Desc",
  },
  {
    id: 4,
    side: "right",
    titleKey: "level4Title",
    icon: Lock,
    color: "#EF4444",
    accent: "rgba(239,68,68,0.15)",
    glow: "rgba(239,68,68,0.35)",
    path: "/banking/otp",
    badge: "OTP DEFENDER",
    descKey: "level4Desc",
  },
  {
    id: 5,
    side: "left",
    titleKey: "level5Title",
    icon: Vault,
    color: "#3B82F6",
    accent: "rgba(59,130,246,0.15)",
    glow: "rgba(59,130,246,0.35)",
    path: "/banking/netbanking",
    badge: "VAULT KEEPER",
    descKey: "level5Desc",
  },
  {
    id: 6,
    side: "right",
    titleKey: "level6Title",
    icon: BadgeCheck,
    color: "#8B5CF6",
    accent: "rgba(139,92,246,0.15)",
    glow: "rgba(139,92,246,0.35)",
    path: "/banking/deepfake",
    badge: "KYC MASTER",
    descKey: "level6Desc",
  },
];

/* ────────────────────────────────────────────────────────────
   PIPE CONNECTOR
──────────────────────────────────────────────────────────── */
const Pipe = ({ fromSide, isLit, litColor }) => {
  const dirLeft = fromSide === "left";
  return (
    <div style={{
      position: "relative",
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      flexShrink: 0,
      width: "100%",
    }}>
      <svg viewBox="0 0 600 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id={`pipeGrad-${fromSide}-${isLit}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isLit ? litColor : "#555555"} />
            <stop offset="100%" stopColor={isLit ? litColor : "#444444"} />
          </linearGradient>
          <filter id="pipeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path
          d={dirLeft ? "M 120 0 L 120 40 L 480 40 L 480 80" : "M 480 0 L 480 40 L 120 40 L 120 80"}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={dirLeft ? "M 120 0 L 120 40 L 480 40 L 480 80" : "M 480 0 L 480 40 L 120 40 L 120 80"}
          fill="none"
          stroke={`url(#pipeGrad-${fromSide}-${isLit})`}
          strokeWidth={isLit ? 16 : 12}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={isLit ? "url(#pipeGlow)" : ""}
          opacity={isLit ? 1 : 0.8}
        />
        <path
          d={dirLeft ? "M 120 0 L 120 40 L 480 40 L 480 80" : "M 480 0 L 480 40 L 120 40 L 120 80"}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          strokeDasharray="10 16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   LEVEL CARD
──────────────────────────────────────────────────────────── */
const LevelCard = ({ level, state, onSelect, t }) => {
  const Icon = level.icon;
  const isCompleted = state === "completed";
  const isActive = state === "active";
  const isAvailable = state === "unlocked";
  const isLocked = state === "locked";

  const displayColor = isCompleted ? "#4CAF50" : (isActive || isAvailable) ? level.color : "rgba(255,255,255,0.1)";
  const displayAccent = isCompleted ? "rgba(76,175,80,0.15)" : (isActive || isAvailable) ? level.accent : "transparent";
  const displayGlow = isCompleted ? "rgba(76,175,80,0.35)" : (isActive || isAvailable) ? level.glow : "transparent";
  const borderColor = isCompleted ? "#4CAF50" : (isActive || isAvailable) ? level.color : "rgba(255,255,255,0.1)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level.id * 0.08, duration: 0.45, ease: "easeOut" }}
      style={{
        alignSelf: level.side === "left" ? "flex-start" : "flex-end",
        width: "40%",
        minWidth: 260,
        position: "relative",
        opacity: isLocked ? 0.58 : 1,
        cursor: isLocked ? "not-allowed" : "pointer",
      }}
      onClick={() => !isLocked && onSelect(level)}
      whileHover={!isLocked ? { scale: 1.03, y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      {isActive && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: -4, borderRadius: 22, background: displayGlow, filter: "blur(12px)", zIndex: 0 }}
        />
      )}
      <div style={{
        position: "relative", zIndex: 1, background: "rgba(10,10,10,0.85)", backdropFilter: "blur(14px)", border: `2px solid ${borderColor}`,
        borderRadius: 20, padding: "1.4rem 1.5rem", boxShadow: isActive ? `0 0 28px ${displayGlow}, 0 8px 32px rgba(0,0,0,0.5)` : isCompleted ? "0 0 18px rgba(76,175,80,0.25), 0 8px 24px rgba(0,0,0,0.4)" : "0 6px 24px rgba(0,0,0,0.35)",
        transition: "box-shadow 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: isLocked ? "rgba(255,255,255,0.05)" : displayAccent, border: `1.5px solid ${isLocked ? "rgba(255,255,255,0.08)" : borderColor + "66"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isLocked ? <LockSVG /> : <Icon size={22} color={borderColor} />}
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", lineHeight: 1, color: isLocked ? "rgba(255,255,255,0.2)" : borderColor }}>{level.id}</span>
          </div>
          {isCompleted && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(76,175,80,0.18)", border: "1px solid #4CAF5066", borderRadius: 99, padding: "4px 10px", fontSize: "0.72rem", fontWeight: 700, color: "#4CAF50", letterSpacing: 0.6 }}>
              <CheckCircle2 size={12} /> {t('levelStatusCompleted')}
            </span>
          )}
          {isActive && (
            <motion.span animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: "flex", alignItems: "center", gap: 5, background: displayAccent, border: `1px solid ${displayColor}66`, borderRadius: 99, padding: "4px 10px", fontSize: "0.72rem", fontWeight: 700, color: displayColor, letterSpacing: 0.6 }}>▶ {t('levelStatusCurrent') || 'CURRENT'}</motion.span>
          )}
          {isAvailable && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: displayAccent, border: `1px solid ${displayColor}66`, borderRadius: 99, padding: "4px 10px", fontSize: "0.72rem", fontWeight: 700, color: displayColor, letterSpacing: 0.6 }}>Not Completed</span>
          )}
          {isLocked && (
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: 0.6 }}>🔒 {t('levelStatusLocked')}</span>
          )}
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: isLocked ? "rgba(255,255,255,0.3)" : "#EAEAEA", margin: "0 0 0.4rem 0", lineHeight: 1.25 }}>{t(level.titleKey)}</h3>
        {!isLocked && <p style={{ fontSize: "0.88rem", color: "rgba(234,234,234,0.65)", margin: 0, lineHeight: 1.55 }}>{t(level.descKey)}</p>}
        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <button style={{ flex: 1, background: displayColor, color: "#1E1E1E", border: "none", borderRadius: 12, padding: "11px 16px", fontSize: "0.95rem", fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "filter 0.2s" }} onClick={(e) => { e.stopPropagation(); onSelect(level); }} onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.12)")} onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}>
            {(t('levelBtnStart') && t('levelBtnStart') !== 'levelBtnStart') ? t('levelBtnStart') : (isCompleted ? 'Review Simulation' : 'Start Training')} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────────
   INSTRUCTOR GUIDE
──────────────────────────────────────────────────────────── */
const InstructorGuide = ({ onDismiss, t }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 800, width: "92%", maxWidth: 440 }}>
    <div style={{ background: "rgba(28,28,28,0.97)", border: "1.5px solid rgba(255,159,28,0.55)", borderRadius: 20, padding: "1.2rem 1.4rem", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", background: "linear-gradient(135deg, #FF9F1C, #D64545)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2.5px solid rgba(255,159,28,0.7)", boxShadow: "0 0 18px rgba(255,159,28,0.35)" }}>👮</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 3px", fontSize: "0.72rem", color: "#FF9F1C", fontWeight: 700, letterSpacing: 1 }}>{t('levelInstructorTitle')}</p>
        <p style={{ margin: "0 0 0.8rem", fontSize: "0.97rem", color: "#EAEAEA", lineHeight: 1.55 }}>{t('levelInstructorWelcome')}</p>
        <button onClick={onDismiss} style={{ background: "linear-gradient(135deg, #FF9F1C, #D64545)", color: "#1E1E1E", border: "none", borderRadius: 10, padding: "8px 18px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", float: "right", display: "flex", alignItems: "center", gap: 5 }}>{t('levelInstructorBtn')} <ChevronRight size={14} /></button>
      </div>
    </div>
  </motion.div>
);

/* ────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────── */
const LevelMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [progress, setProgress] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("vivekRaksha_mapState"));
      if (s && typeof s === "object") return s;
    } catch {}
    return { highestUnlocked: 1, completed: [] };
  });

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("vivekRaksha_mapState"));
      if (s && typeof s === "object") setProgress(s);
    } catch {}
    if (location?.state?.justCompleted) {
      window.history.replaceState({}, "");
    }
  }, [location?.state?.justCompleted]);

  const [showGuide, setShowGuide] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("vivekRaksha_mapGuideSeen");
    if (!seen) {
      setTimeout(() => setShowGuide(true), 600);
      localStorage.setItem("vivekRaksha_mapGuideSeen", "1");
    }
  }, []);

  const isCompleted = (id) => progress.completed.includes(id);
  const isActive = (id) => !isCompleted(id) && id === progress.highestUnlocked;
  const isLocked = (id) => false; // Enforce unlocked for all modules

  const getState = (id) => isCompleted(id) ? "completed" : isActive(id) ? "active" : "unlocked";

  const handleSelect = (level) => {
    if (isLocked(level.id)) return;
    navigate(level.path);
  };

  const pct = Math.round((progress.completed.length / 6) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>
      <header className="glass-nav" style={{ padding: "0.75rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 300 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button className="btn btn-outline" onClick={() => navigate("/dashboard")} style={{ padding: "6px 14px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 5 }}><ArrowLeft size={15} /> {t('back')}</button>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.15rem", fontFamily: "var(--font-heading)", color: "var(--color-warning-orange)" }}>{t('levelMapTitle')}</h2>
            <p style={{ margin: 0, fontSize: "0.74rem", opacity: 0.55, color: "var(--text-primary)" }}>{t('levelMapProgress', { completed: progress.completed.length, total: 6 })}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 110, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #FF9F1C, #4CAF50)" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
            </div>
            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--color-warning-orange)", minWidth: 30 }}>{pct}%</span>
          </div>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(255,159,28,0.3) transparent" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem 4rem", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.4rem" }}>{t('levelMapMainTitle')}</h1>
            <p style={{ fontSize: "1rem", color: "var(--text-primary)", opacity: 0.55, margin: 0 }}>{t('levelMapSubtitle')}</p>
          </div>
          {LEVELS.map((level, idx) => (
            <React.Fragment key={level.id}>
              <LevelCard level={level} state={getState(level.id)} onSelect={handleSelect} t={t} />
              {idx < LEVELS.length - 1 && <Pipe fromSide={level.side} isLit={isCompleted(level.id)} litColor={LEVELS[idx + 1].color} />}
            </React.Fragment>
          ))}
          {progress.completed.length === 6 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: "2rem", textAlign: "center", padding: "2rem", borderRadius: 20, background: "rgba(76,175,80,0.12)", border: "2px solid rgba(76,175,80,0.4)" }}>
              <div style={{ fontSize: 56 }}>🏆</div>
              <h2 style={{ fontFamily: "var(--font-heading)", color: "#4CAF50", margin: "0.6rem 0 0.4rem", fontSize: "1.5rem" }}>{t('levelPathCompleteTitle')}</h2>
              <p style={{ color: "rgba(234,234,234,0.7)", fontSize: "1rem", margin: 0 }}>{t('levelPathCompleteText')}</p>
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>{showGuide && <InstructorGuide onDismiss={() => setShowGuide(false)} t={t} />}</AnimatePresence>
    </div>
  );
};

const LockSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default LevelMap;
