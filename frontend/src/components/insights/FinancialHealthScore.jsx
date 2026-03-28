import { useMemo, useEffect, useState, useRef } from "react";
import api from "../../api";
import Card from "../ui/Card";

// ─── helpers ────────────────────────────────────────────────────────────────

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function scoreColor(score) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

// ─── random message banks ────────────────────────────────────────────────────

// Overall score messages (5-6 per tier)
const SCORE_MESSAGES = {
  healthy: [
    "Your finances are in great shape — keep the momentum going and stay consistent.",
    "You're managing money wisely across all fronts. Small habits are clearly paying off.",
    "Everything looks balanced. Your spending patterns reflect good financial discipline.",
    "Strong savings, controlled spending, solid pacing — you're doing the right things.",
    "You're on track for a financially healthy month. Keep it up!",
    "Your financial behaviour this month is commendable — stay the course.",
  ],
  fair: [
    "You're in decent shape, but a few tweaks could make a meaningful difference.",
    "Overall okay, but there's clear room to tighten up spending in some areas.",
    "You're managing, but your savings or pacing could be stronger this month.",
    "Some categories are under control, others need a closer look before month-end.",
    "Not bad, but pushing a little harder on budget discipline could really help.",
    "You're halfway there — small corrections now can move you to a healthier score.",
  ],
  caution: [
    "Your spending patterns need attention before things get harder to course-correct.",
    "You're at a point where overspending in even one category could cause real stress.",
    "Tread carefully — your pace or savings gap is putting the month at risk.",
    "A few habits are working against you this month. Now is the time to act.",
    "Your financial health is fragile right now. Cut back where you can.",
    "This score suggests some category or pacing issue is draining your budget faster than expected.",
  ],
  atRisk: [
    "Urgent attention needed — your budget and savings are under serious pressure.",
    "Spending is significantly outpacing your plan. Without changes, month-end will be tough.",
    "Multiple signals are red this month. Review your biggest expense categories immediately.",
    "Your financial health score is low — savings may be at risk and overruns are likely.",
    "This is a warning sign. Immediate adjustments to spending can still help recover.",
    "Things are off track. Revisit your budget and cut discretionary spending right away.",
  ],
};


const INDICATOR_MESSAGES = {
  budgetPacing: {
    well: [
      "You're spending at a healthy rate.",
      "Pace looks good — unlikely to exceed budget.",
      "Daily spend is within range.",
    ],
    fair: [
      "Spending is slightly ahead of schedule.",
      "Pace is okay but watch daily spend.",
      "You're a bit ahead of ideal pace.",
    ],
    atRisk: [
      "You've spent far more than expected — slow down.",
      "At this rate, you'll exceed budget early.",
      "Spending pace is well ahead of plan.",
    ],
  },
  categoryBalance: {
    well: [
      "Spending is spread across categories.",
      "Category mix looks balanced — no red flags.",
      "No over-concentration in one area.",
    ],
    fair: [
      "One category is taking more share.",
      "Spend distribution is uneven — check balance.",
      "A dominant category needs watching.",
    ],
    atRisk: [
      "One category is consuming most of budget.",
      "Too much spend in one area — risky.",
      "Spending is heavily skewed this month.",
    ],
  },
  savingsDiscipline: {
    well: [
      "You're saving a healthy portion — great habit.",
      "Savings rate is strong — solid buffer.",
      "Setting aside savings shows discipline.",
    ],
    fair: [
      "Savings rate is okay but could improve.",
      "You're saving, but a bit more helps long-term.",
      "Savings are present but not optimal.",
    ],
    atRisk: [
      "Very little saved — concerning.",
      "Savings rate too low for cushion.",
      "Spending leaves almost no savings.",
    ],
  },
};

function getIndicatorMessage(key, score) {
  const bank = INDICATOR_MESSAGES[key];
  if (score >= 75) return pick(bank.well);
  if (score >= 50) return pick(bank.fair);
  return pick(bank.atRisk);
}

function getScoreMessage(score) {
  if (score >= 80) return pick(SCORE_MESSAGES.healthy);
  if (score >= 60) return pick(SCORE_MESSAGES.fair);
  if (score >= 40) return pick(SCORE_MESSAGES.caution);
  return pick(SCORE_MESSAGES.atRisk);
}

// ─── Tailwind classes per tier ───────────────────────────────────────────────

function scoreTailwind(score) {
  if (score >= 75) return {
    dot: "bg-emerald-400 shadow-[0_0_6px_#34d39988]",
    tag: "bg-emerald-50 text-emerald-600 border-emerald-200",
    label: "Well",
  };
  if (score >= 50) return {
    dot: "bg-amber-400 shadow-[0_0_6px_#fbbf2488]",
    tag: "bg-amber-50 text-amber-600 border-amber-200",
    label: "Fair",
  };
  return {
    dot: "bg-red-400 shadow-[0_0_6px_#f8717188]",
    tag: "bg-red-50 text-red-500 border-red-200",
    label: "At Risk",
  };
}

function scoreLabel(score) {
  if (score >= 80) return { label: "Healthy",  sub: "Great job!" };
  if (score >= 60) return { label: "Fair",     sub: "Room to improve" };
  if (score >= 40) return { label: "Caution",  sub: "Watch your spend" };
  return              { label: "At Risk",   sub: "Take action now" };
}

// ─── scorers ────────────────────────────────────────────────────────────────

function scoreSavingsRatio(budget) {
  if (!budget || !budget.income || budget.income <= 0) return 50;
  const ratio = budget.savings / budget.income;
  if (ratio >= 0.30) return 100;
  if (ratio >= 0.20) return 70 + (ratio - 0.20) / 0.10 * 20;
  if (ratio >= 0.10) return 50 + (ratio - 0.10) / 0.10 * 20;
  return clamp(ratio / 0.10 * 50, 0, 50);
}

function scoreBudgetAdherence(expenses, budget) {
  if (!budget) return 50;
  const cats = { Food: budget.food, Shopping: budget.shopping,
                 Transport: budget.transport, Bills: budget.bills,
                 Others: budget.others };
  const keys = Object.keys(cats).filter(k => cats[k] > 0);
  if (!keys.length) return 50;
  const spend = {};
  expenses.forEach(e => { spend[e.category] = (spend[e.category] || 0) + e.amount; });
  let totalSeverity = 0;
  keys.forEach(k => {
    const over = Math.max(0, (spend[k] || 0) - cats[k]);
    totalSeverity += over / cats[k];
  });
  return clamp(100 - (totalSeverity / keys.length) * 120, 0, 100);
}

function scoreSpendingPace(expenses, budget, selectedMonth, selectedYear) {
  if (!budget) return 50;
  const cats = { Food: budget.food, Shopping: budget.shopping,
                 Transport: budget.transport, Bills: budget.bills,
                 Others: budget.others };
  const totalBudget = Object.values(cats).reduce((a, b) => a + b, 0);
  if (!totalBudget) return 50;
  const totalSpend = expenses.reduce((a, e) => a + e.amount, 0);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === selectedYear;
  const daysPassed = isCurrentMonth ? today.getDate() : daysInMonth(selectedYear, selectedMonth);
  const expected = totalBudget * (daysPassed / daysInMonth(selectedYear, selectedMonth));
  if (totalSpend <= expected * 0.85) return 100;
  if (totalSpend <= expected) return 80;
  return clamp(80 - ((totalSpend - expected) / expected) * 120, 0, 80);
}

function scoreCategoryBalance(expenses) {
  const total = expenses.reduce((a, e) => a + e.amount, 0);
  if (!total) return 50;
  const spend = {};
  expenses.forEach(e => { spend[e.category] = (spend[e.category] || 0) + e.amount; });
  const maxShare = Math.max(...Object.values(spend)) / total;
  if (maxShare <= 0.40) return 100;
  if (maxShare <= 0.55) return 75;
  if (maxShare <= 0.70) return 50;
  return clamp(100 - maxShare * 100, 0, 40);
}

function scoreConsistency(expenses, selectedMonth, selectedYear) {
  const days = daysInMonth(selectedYear, selectedMonth);
  const daily = Array(days).fill(0);
  expenses.forEach(e => {
    const d = new Date(e.date).getDate() - 1;
    if (d >= 0 && d < days) daily[d] += e.amount;
  });
  const nonZero = daily.filter(v => v > 0);
  if (nonZero.length < 2) return 60;
  const mean = nonZero.reduce((a, b) => a + b, 0) / nonZero.length;
  const variance = nonZero.reduce((a, b) => a + (b - mean) ** 2, 0) / nonZero.length;
  const cv = Math.sqrt(variance) / mean;
  if (cv <= 0.5) return 100;
  if (cv <= 1.0) return 75;
  if (cv <= 1.5) return 50;
  return clamp(100 - cv * 35, 0, 40);
}

function scoreOverrunSeverity(expenses, budget) {
  if (!budget) return 50;
  const cats = { Food: budget.food, Shopping: budget.shopping,
                 Transport: budget.transport, Bills: budget.bills,
                 Others: budget.others };
  const totalBudget = Object.values(cats).reduce((a, b) => a + b, 0);
  if (!totalBudget) return 50;
  const spend = {};
  expenses.forEach(e => { spend[e.category] = (spend[e.category] || 0) + e.amount; });
  const totalOverrun = Object.keys(cats).reduce((a, k) => a + Math.max(0, (spend[k] || 0) - cats[k]), 0);
  const severity = totalOverrun / totalBudget;
  if (severity === 0)   return 100;
  if (severity <= 0.05) return 85;
  if (severity <= 0.15) return 65;
  if (severity <= 0.30) return 40;
  return clamp(100 - severity * 150, 0, 30);
}

// ─── Indicator row ───────────────────────────────────────────────────────────

function Indicator({ label, score, message }) {
  const { dot, tag, label: tagLabel } = scoreTailwind(score);
  return (
    <div className="py-2">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        <span className="flex-1 text-xs font-medium text-gray-600">{label}</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tag}`}>
          {tagLabel}
        </span>
      </div>
      {message && (
        <p className="mt-1 text-[11px] text-gray-400 leading-snug pl-4">
          {message}
        </p>
      )}
    </div>
  );
}

// ─── Donut ───────────────────────────────────────────────────────────────────

function DonutScore({ score, color }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 900;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const r = 52, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const filled = (animated / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r}
        fill="none" stroke="#e5e7eb" strokeWidth="13"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke 0.4s" }}
      />
      <text x={cx} y={cy - 5} textAnchor="middle"
        fontSize="28" fontWeight="700" fill="#111827">
        {animated}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle"
        fontSize="11" fontWeight="500" fill="#9ca3af">
        / 100
      </text>
    </svg>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function FinancialHealthScore({ expenses, budgets, selectedMonth, selectedYear }) {
  const [budgetFull, setBudgetFull] = useState(null);

  useEffect(() => {
    const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    api.get(`/budget/${monthKey}`)
      .then(r => setBudgetFull(r.data))
      .catch(() => setBudgetFull(null));
  }, [selectedMonth, selectedYear]);

  const scores = useMemo(() => {
    const b = budgetFull;
    const budgetFlat = b ? {
      income:    b.income,
      savings:   b.savings,
      food:      b.categories?.Food      ?? 0,
      shopping:  b.categories?.Shopping  ?? 0,
      transport: b.categories?.Transport ?? 0,
      bills:     b.categories?.Bills     ?? 0,
      others:    b.categories?.Others    ?? 0,
    } : null;

    const s1 = scoreSavingsRatio(budgetFlat);
    const s2 = scoreBudgetAdherence(expenses, budgetFlat);
    const s3 = scoreSpendingPace(expenses, budgetFlat, selectedMonth, selectedYear);
    const s4 = scoreCategoryBalance(expenses);
    const s5 = scoreConsistency(expenses, selectedMonth, selectedYear);
    const s6 = scoreOverrunSeverity(expenses, budgetFlat);

    const total = Math.round(s1*0.25 + s2*0.20 + s3*0.20 + s4*0.15 + s5*0.10 + s6*0.10);
    return { s1, s2, s3, s4, s5, s6, total };
  }, [expenses, budgetFull, selectedMonth, selectedYear]);

  // Pick random messages once per score change (stable during re-renders)
  const messages = useMemo(() => ({
    scoreMsg:    getScoreMessage(scores.total),
    pacingMsg:   getIndicatorMessage("budgetPacing", scores.s3),
    balanceMsg:  getIndicatorMessage("categoryBalance", scores.s4),
    savingsMsg:  getIndicatorMessage("savingsDiscipline", scores.s1),
  }), [scores.total, scores.s3, scores.s4, scores.s1]);

  const color = scoreColor(scores.total);
  const { label, sub } = scoreLabel(scores.total);

  return (
    <Card>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Financial Health Score</h2>
      </div>

      {/* Donut left, 3 indicators right */}
      <div className="flex items-start gap-5">

        {/* Donut + label below */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <DonutScore score={scores.total} color={color} />
          <span className="text-sm font-bold leading-none" style={{ color }}>{label}</span>
          <span className="text-[11px] text-gray-400">{sub}</span>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-100" />

        {/* 3 indicators with messages */}
        <div className="flex-1 flex flex-col divide-y divide-gray-50">
          <Indicator
            label="Budget Pacing"
            score={scores.s3}
            message={messages.pacingMsg}
          />
          <Indicator
            label="Category Balance"
            score={scores.s4}
            message={messages.balanceMsg}
          />
          <Indicator
            label="Savings Discipline"
            score={scores.s1}
            message={messages.savingsMsg}
          />
        </div>
      </div>

      {/* Overall score message — bottom of card */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-600 leading-relaxed">
          {messages.scoreMsg}
        </p>
      </div>

      {/* No budget warning */}
      {!budgetFull && (
        <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ Set a budget for this month to get a full score
        </p>
      )}
    </Card>
  );
}