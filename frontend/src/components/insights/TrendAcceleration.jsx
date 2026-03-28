import { useMemo } from "react";
import Card from "../ui/Card";

// ─── constants ───────────────────────────────────────────────────────────────

const CATEGORY_EMOJI = {
  Food: "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Bills: "📄",
  Others: "📦",
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtCompact(n) {
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${Math.round(n)}`;
}

function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a, b) {
  return Math.round(Math.abs(b - a) / 86400000);
}

// ─── core analysis ───────────────────────────────────────────────────────────

function buildAnalysis(expenses, selectedMonth, selectedYear) {
  const monthExpenses = expenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  if (!monthExpenses.length) return null;

  const sorted = [...monthExpenses].sort(
    (a, b) => toDateOnly(a.date) - toDateOnly(b.date)
  );

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
  const refDate = isCurrentMonth
    ? today
    : new Date(selectedYear, selectedMonth + 1, 0);

  const daily = {};
  sorted.forEach((e) => {
    daily[e.date] = (daily[e.date] || 0) + e.amount;
  });

  const last7Start = new Date(refDate);
  last7Start.setDate(refDate.getDate() - 6);
  last7Start.setHours(0, 0, 0, 0);

  const prev7Start = new Date(last7Start);
  prev7Start.setDate(last7Start.getDate() - 7);

  const last7 = sorted.filter((e) => {
    const d = toDateOnly(e.date);
    return d >= last7Start && d <= refDate;
  });
  const prev7 = sorted.filter((e) => {
    const d = toDateOnly(e.date);
    return d >= prev7Start && d < last7Start;
  });

  const last7Total = last7.reduce((s, e) => s + e.amount, 0);
  const prev7Total = prev7.reduce((s, e) => s + e.amount, 0);
  const last7Days = Math.max(daysBetween(last7Start, refDate) + 1, last7.length > 0 ? 1 : 0);
  const currentAvg = last7Total / Math.max(last7Days, 1);
  const previousAvg = prev7Total / 7;

  let accelPct = 0;
  if (previousAvg > 0) accelPct = ((currentAvg - previousAvg) / previousAvg) * 100;
  else if (currentAvg > 0) accelPct = 100;

  let status =
    last7.length === 0 && prev7.length === 0 ? "nodata"
    : accelPct > 20 ? "spike"
    : accelPct < -10 ? "improved"
    : "stable";

  // category driver
  const catLast7 = {}, catPrev7 = {};
  last7.forEach((e) => { catLast7[e.category] = (catLast7[e.category] || 0) + e.amount; });
  prev7.forEach((e) => { catPrev7[e.category] = (catPrev7[e.category] || 0) + e.amount; });
  let topDriver = null, topDriverDelta = 0;
  Object.entries(catLast7).forEach(([cat, val]) => {
    const delta = val - (catPrev7[cat] || 0);
    if (delta > topDriverDelta) { topDriverDelta = delta; topDriver = cat; }
  });

  // behavioral insight
  const weekendExp = sorted.filter((e) => { const d = toDateOnly(e.date).getDay(); return d === 0 || d === 6; });
  const weekdayExp = sorted.filter((e) => { const d = toDateOnly(e.date).getDay(); return d > 0 && d < 6; });
  const weekendAvg = weekendExp.reduce((s, e) => s + e.amount, 0) / Math.max(weekendExp.length, 1);
  const weekdayAvg = weekdayExp.reduce((s, e) => s + e.amount, 0) / Math.max(weekdayExp.length, 1);

  let behaviorInsight = null;
  if (weekendExp.length >= 2 && weekdayExp.length >= 2) {
    const ratio = weekendAvg / Math.max(weekdayAvg, 1);
    if (ratio > 1.4) behaviorInsight = `Weekend spending is ${Math.round((ratio - 1) * 100)}% higher than weekdays — a pattern worth watching.`;
    else if (ratio < 0.7) behaviorInsight = "You spend more on weekdays than weekends — mostly routine expenses.";
  }
  if (!behaviorInsight) {
    const firstHalf = sorted.filter((e) => toDateOnly(e.date).getDate() <= 15);
    const secondHalf = sorted.filter((e) => toDateOnly(e.date).getDate() > 15);
    const fAvg = firstHalf.reduce((s, e) => s + e.amount, 0) / Math.max(firstHalf.length, 1);
    const sAvg = secondHalf.reduce((s, e) => s + e.amount, 0) / Math.max(secondHalf.length, 1);
    if (secondHalf.length >= 3 && sAvg > fAvg * 1.5)
      behaviorInsight = "Spending tends to accelerate in the second half of the month — plan ahead.";
  }
  if (!behaviorInsight) behaviorInsight = "No strong behavioural pattern detected yet.";

  // action + daysLeft
  const daysLeft = isCurrentMonth
    ? new Date(selectedYear, selectedMonth + 1, 0).getDate() - today.getDate()
    : 0;
  const safeDaily = previousAvg > 0 ? Math.round(previousAvg * 0.9) : null;

  let action = null;
  if (status === "spike" && daysLeft > 0 && safeDaily)
    action = { text: `Try limiting daily spend to ${fmt(safeDaily)} for the next ${daysLeft} day${daysLeft !== 1 ? "s" : ""} to course-correct.`, cta: "Limit Spending" };
  else if (status === "improved")
    action = { text: "You're trending in the right direction — maintain this pace to finish the month strong.", cta: "Keep it up" };
  else if (status === "stable")
    action = { text: "Spending is steady. Stay consistent and keep an eye on upcoming large expenses.", cta: null };
  else
    action = { text: "Add more expenses to unlock trend detection.", cta: null };

  // sparkline — last 7 days
  const sparkDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    sparkDays.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3),
      value: daily[key] || 0,
    });
  }

  // top spend days for the right panel (sorted by value desc, non-zero only)
  const topDays = [...sparkDays]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return {
    status,
    accelPct: Math.round(accelPct),
    currentAvg: Math.round(currentAvg),
    previousAvg: Math.round(previousAvg),
    last7Total: Math.round(last7Total),
    prev7Total: Math.round(prev7Total),
    totalDelta: Math.round(last7Total - prev7Total),
    topDriver,
    topDriverDelta: Math.round(topDriverDelta),
    behaviorInsight,
    action,
    sparkDays,
    topDays,
    daysLeft,
  };
}

// ─── status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  spike: {
    icon: "🚨",
    headline: "Spending has accelerated",
    sub: "vs previous 7 days",
    badge: "Spike",
    badgeStyle: { background: "linear-gradient(135deg,#ff6b8a,#ff9a7c)", color: "#fff", border: "none" },
    accentColor: "#f43f5e",
    accentLight: "rgba(244,63,94,0.06)",
    accentBorder: "rgba(244,63,94,0.13)",
    accentDivider: "rgba(244,63,94,0.15)",
    arrowSymbol: "↗",
    changePrefix: "+",
    barGradient: ["#ffb3b3", "#ff6b8a", "#f43f5e"],
  },
  stable: {
    icon: "⚖️",
    headline: "Spending is stable",
    sub: "vs previous 7 days",
    badge: "Stable",
    badgeStyle: { background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#fff", border: "none" },
    accentColor: "#f59e0b",
    accentLight: "rgba(245,158,11,0.06)",
    accentBorder: "rgba(245,158,11,0.13)",
    accentDivider: "rgba(245,158,11,0.15)",
    arrowSymbol: "→",
    changePrefix: "",
    barGradient: ["#fde68a", "#fbbf24", "#f59e0b"],
  },
  improved: {
    icon: "📉",
    headline: "Spending has slowed down",
    sub: "vs previous 7 days",
    badge: "Improving",
    badgeStyle: { background: "linear-gradient(135deg,#34d399,#10b981)", color: "#fff", border: "none" },
    accentColor: "#10b981",
    accentLight: "rgba(16,185,129,0.06)",
    accentBorder: "rgba(16,185,129,0.13)",
    accentDivider: "rgba(16,185,129,0.15)",
    arrowSymbol: "↘",
    changePrefix: "",
    barGradient: ["#a7f3d0", "#34d399", "#10b981"],
  },
  nodata: {
    icon: "📊",
    headline: "Not enough data yet",
    sub: "Add expenses to get insights",
    badge: "Pending",
    badgeStyle: { background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb" },
    accentColor: "#9ca3af",
    accentLight: "rgba(156,163,175,0.06)",
    accentBorder: "rgba(156,163,175,0.13)",
    accentDivider: "rgba(156,163,175,0.15)",
    arrowSymbol: "–",
    changePrefix: "",
    barGradient: ["#e5e7eb", "#d1d5db", "#9ca3af"],
  },
};

// ─── GradientSparkline (horizontal, fills available space) ───────────────────

function GradientSparkline({ days, gradientColors }) {
  const max = Math.max(...days.map((d) => d.value), 1);
  const [c1, c2, c3] = gradientColors;
  const weekTotal = days.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
        Daily spend — last 7 days
      </p>
      <div className="flex items-end gap-[3px]" style={{ height: "60px" }}>
        {days.map((d, i) => {
          const heightPct = d.value > 0 ? Math.max((d.value / max) * 100, 10) : 3;
          const intensity = i / (days.length - 1);
          const barColor = d.value > 0
            ? intensity < 0.33 ? c1 : intensity < 0.66 ? c2 : c3
            : "#f3f4f6";
          const amtLabel = d.value > 0 ? fmtCompact(d.value) : null;

          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0 h-full justify-end">
              <div
                className="w-full rounded-t-[3px] rounded-b-[2px] transition-all duration-700"
                style={{
                  height: `${heightPct}%`,
                  background: d.value > 0 ? barColor : "#f3f4f6",
                  opacity: d.value > 0 ? 1 : 0.4,
                }}
              />
              <span className="text-[9px] text-gray-400 leading-none font-medium">{d.label}</span>
              {amtLabel ? (
                <span className="text-[8px] text-gray-600 leading-none">{amtLabel}</span>
              ) : (
                <span className="text-[8px] leading-none opacity-0">–</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanel({ analysis, cfg }) {
  const weekTotal = analysis.last7Total;

  return (
    <div className="lg:w-48 flex-shrink-0 rounded-2xl p-4 flex flex-col gap-3 bg-gray-50 border border-gray-100">
      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
        Last 7 Days
      </p>

      {/* Week totals */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">This week</span>
          <span className="text-base font-bold text-gray-800">{fmt(analysis.last7Total)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Last week</span>
          <span className="text-base font-bold text-gray-800">{fmt(analysis.prev7Total)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Top spend days with mini progress bars */}
      {analysis.topDays.length > 0 && (
        <>
          <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">
            Top spend days
          </p>
          <div className="space-y-3">
            {analysis.topDays.map((d, i) => {
              const barPct = Math.round((d.value / analysis.topDays[0].value) * 100);
              const sharePct = Math.round((d.value / Math.max(weekTotal, 1)) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500">{d.label}</span>
                    <span className="text-xs font-semibold text-gray-700">{fmt(d.value)}</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-[3px] w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background: `linear-gradient(90deg, ${cfg.barGradient[0]}, ${cfg.barGradient[2]})`,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400">{sharePct}% of this week</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrendAcceleration({ expenses = [], selectedMonth, selectedYear }) {
  const analysis = useMemo(
    () => buildAnalysis(expenses, selectedMonth, selectedYear),
    [expenses, selectedMonth, selectedYear]
  );

  if (!analysis) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Trend Acceleration</h2>
        </div>
        <p className="text-sm text-gray-400">No expenses found for this month.</p>
      </Card>
    );
  }

  const cfg = STATUS_CONFIG[analysis.status];

  return (
    <Card>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Trend Acceleration
        </h2>
        <span
          className="text-xs font-bold px-4 py-1.5 rounded-full"
          style={cfg.badgeStyle}
        >
          {cfg.badge}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ════ LEFT column ════ */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* 1. Status headline */}
          <div className="flex items-center gap-3">
            <span className="text-xl leading-none">{cfg.icon}</span>
            <div>
              <p className="text-lg font-semibold text-gray-800 leading-tight">
                {cfg.headline}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{cfg.sub}</p>
            </div>
          </div>

          {/* 2. Proof box — week stats + full-width sparkline side by side */}
          {analysis.status !== "nodata" && (
            <div
              className="rounded-2xl p-4"
              style={{
                background: cfg.accentLight,
                border: `1px solid ${cfg.accentBorder}`,
              }}
            >
              {/* Top row: stats left, sparkline right */}
              <div className="flex items-stretch gap-4 mb-0">
                {/* Week stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                      This week
                    </p>
                    <p className="text-xl font-bold text-gray-800 leading-none">
                      {fmt(analysis.currentAvg)}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">/day</span>
                    </p>
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: cfg.accentColor }}
                    >
                      {cfg.arrowSymbol} {analysis.accelPct > 0 ? "+" : ""}{analysis.accelPct}%
                    </p>
                  </div>

                  <span className="text-base font-bold" style={{ color: cfg.accentColor }}>
                    →
                  </span>

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                      Last week
                    </p>
                    <p className="text-xl font-bold text-gray-800 leading-none">
                      {fmt(analysis.previousAvg)}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">/day</span>
                    </p>
                  </div>
                </div>

                {/* Sparkline fills remaining width */}
                <GradientSparkline
                  days={analysis.sparkDays}
                  gradientColors={cfg.barGradient}
                />
              </div>

              {/* Delta line */}
              {analysis.totalDelta !== 0 && (
                <p
                  className="text-xs text-gray-500 mt-3 pt-3"
                  style={{ borderTop: `0.5px solid ${cfg.accentDivider}` }}
                >
                  {analysis.totalDelta > 0 ? "Increased" : "Decreased"} by{" "}
                  <span className="font-semibold" style={{ color: cfg.accentColor }}>
                    {fmt(Math.abs(analysis.totalDelta))}
                  </span>{" "}
                  compared to last week
                </p>
              )}
            </div>
          )}

          {/* 3. Category driver */}
          {analysis.topDriver && analysis.topDriverDelta > 0 && (
            <div className="flex items-start gap-2.5">
              <span className="text-base leading-none mt-0.5">
                {CATEGORY_EMOJI[analysis.topDriver] || "📦"}
              </span>
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-gray-800">{analysis.topDriver}</span>
                {" "}is the main driver —{" "}
                <span className="font-semibold" style={{ color: cfg.accentColor }}>
                  {fmt(analysis.topDriverDelta)} more
                </span>
                {" "}than last week.
              </p>
            </div>
          )}

          {/* 4. Behavioral insight */}
          <div className="flex items-start gap-2.5">
            <span className="text-base leading-none mt-0.5">💬</span>
            <p className="text-xs text-gray-500 italic leading-relaxed">
              {analysis.behaviorInsight}
            </p>
          </div>

          {/* 5. Action suggestion — pushed to bottom */}
          {analysis.action && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 mt-auto">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="text-base leading-none mt-0.5 flex-shrink-0">🎯</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {analysis.action.text.split(/(₹[\d,]+)/).map((part, i) =>
                    part.startsWith("₹") ? (
                      <span key={i} className="font-bold text-gray-900">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              </div>
              {analysis.action.cta && (
                <button
                  className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl text-white whitespace-nowrap"
                  style={{
                    background: `linear-gradient(135deg, ${cfg.barGradient[1]}, ${cfg.barGradient[2]})`,
                    boxShadow: `0 4px 12px ${cfg.accentColor}44`,
                  }}
                >
                  {analysis.action.cta}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ════ RIGHT column ════ */}
        <RightPanel analysis={analysis} cfg={cfg} />
      </div>
    </Card>
  );
}