import React, { useState, useEffect, useRef } from "react";
import DashboardCard from "./DashboardCard";

const COLOR_MAP = {
  warning: {
    bg: "rgba(254, 242, 242, 0.8)",
    border: "#fecaca",
    badge: "#fee2e2",
    badgeText: "#dc2626",
    icon: "⚠️",
  },
  danger: {
    bg: "rgba(255, 247, 237, 0.8)",
    border: "#fed7aa",
    badge: "#ffedd5",
    badgeText: "#ea580c",
    icon: "🔥",
  },
  good: {
    bg: "rgba(240, 253, 244, 0.8)",
    border: "#bbf7d0",
    badge: "#dcfce7",
    badgeText: "#16a34a",
    icon: "✅",
  },
  info: {
    bg: "rgba(238, 242, 255, 0.8)",
    border: "#c7d2fe",
    badge: "#e0e7ff",
    badgeText: "#4f46e5",
    icon: "💡",
  },
};

const AUTOSLIDE_INTERVAL = 7500;

export default function SmartTips({ tips = [] }) {
  const safeTips = tips.length
    ? tips
    : [{ title: "No insights yet", msg: "Add budget to get insights.", type: "info" }];

  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null); // "left" | "right" | null
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const goTo = (nextIndex, dir) => {
    if (!visible) return;
    setVisible(false);
    setAnimDir(dir);
    setTimeout(() => {
      setIndex(nextIndex);
      setVisible(true);
    }, 280);
  };

  const next = () => goTo((index + 1) % safeTips.length, "left");
  const prev = () => goTo((index - 1 + safeTips.length) % safeTips.length, "right");

  // Auto-slide
  const resetTimer = () => {
    clearInterval(timerRef.current);
    if (safeTips.length > 1) {
      timerRef.current = setInterval(next, AUTOSLIDE_INTERVAL);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [index, safeTips.length]);

  const tip = safeTips[index];
  const theme = COLOR_MAP[tip.type] || COLOR_MAP.info;

  const slideStyle = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateX(0)"
      : animDir === "left"
      ? "translateX(-18px)"
      : "translateX(18px)",
    transition: "opacity 0.28s ease, transform 0.28s ease",
  };

  return (
    <DashboardCard
      title="Smart Tips"
      className="bg-white border border-gray-100 shadow-sm h-full"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 12 }}>

        {/* TIP CARD */}
        <div
          style={{
            flex: 1,
            borderRadius: 14,
            border: `1.5px solid ${theme.border}`,
            background: theme.bg,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            ...slideStyle,
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 13,
              background: theme.badge,
              color: theme.badgeText,
              borderRadius: 99,
              padding: "2px 10px",
              fontWeight: 600,
              letterSpacing: 0.2,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              {theme.icon} {tip.type?.charAt(0).toUpperCase() + tip.type?.slice(1) || "Info"}
            </span>
          </div>

          {/* Title */}
          <p style={{
            fontWeight: 700,
            fontSize: 14,
            color: "#1a1f36",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {tip.title}
          </p>

          {/* Message */}
          <p style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {tip.msg}
          </p>

          {/* Action button */}
          {tip.action && (
            <button style={{
              marginTop: "auto",
              background: "linear-gradient(110deg, #818cf8, #6366f1)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 3px 10px rgba(99,102,241,0.25)",
              transition: "opacity 0.2s",
            }}>
              {tip.action}
            </button>
          )}
        </div>

        {/* NAVIGATION ROW */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}>

          {/* Prev arrow */}
          <button
            onClick={() => { prev(); resetTimer(); }}
            disabled={safeTips.length <= 1}
            title="Previous"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1.5px solid #e2e8f0",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: safeTips.length <= 1 ? "default" : "pointer",
              opacity: safeTips.length <= 1 ? 0.35 : 1,
              transition: "background 0.18s, border-color 0.18s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {safeTips.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i, i > index ? "left" : "right"); resetTimer(); }}
                style={{
                  width: i === index ? 18 : 6,
                  height: 6,
                  borderRadius: 99,
                  border: "none",
                  background: i === index ? "#6366f1" : "#cbd5e1",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => { next(); resetTimer(); }}
            disabled={safeTips.length <= 1}
            title="Next"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1.5px solid #e2e8f0",
              background: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: safeTips.length <= 1 ? "default" : "pointer",
              opacity: safeTips.length <= 1 ? 0.35 : 1,
              transition: "background 0.18s, border-color 0.18s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>
    </DashboardCard>
  );
}