import { useMemo } from "react";
import Card from "../ui/Card";

// ─── constants ───────────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  Food:      { emoji: "🍔", bg: "bg-orange-100",  text: "text-orange-500" },
  Shopping:  { emoji: "🛍️", bg: "bg-blue-100",    text: "text-blue-500"   },
  Transport: { emoji: "🚗", bg: "bg-yellow-100",  text: "text-yellow-500" },
  Bills:     { emoji: "📄", bg: "bg-purple-100",  text: "text-purple-500" },
  Others:    { emoji: "📦", bg: "bg-gray-100",    text: "text-gray-500"   },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dateStr) {
  const d = toDateOnly(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── analysis ────────────────────────────────────────────────────────────────

function buildHighlights(expenses, selectedMonth, selectedYear) {
  const monthExpenses = expenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  if (!monthExpenses.length) return null;

  // 1. Biggest single expense
  const biggest = monthExpenses.reduce(
    (max, e) => (e.amount > max.amount ? e : max),
    monthExpenses[0]
  );

  // 2. Highest spending day
  const dailyTotals = {};
  monthExpenses.forEach((e) => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });
  const highestDayEntry = Object.entries(dailyTotals).reduce(
    (max, [date, total]) => (total > max[1] ? [date, total] : max),
    ["", 0]
  );

  // 3. Longest no-spend streak
  const spendDates = new Set(Object.keys(dailyTotals));
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  let longestStreak = 0;
  let currentStreak = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (!spendDates.has(key)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    biggest,
    highestDay: { date: highestDayEntry[0], total: highestDayEntry[1] },
    noSpendStreak: longestStreak,
  };
}

// ─── Row component ────────────────────────────────────────────────────────────

function HighlightRow({ icon, label, sub, valueMain, valueSub, isLast }) {
  return (
    <div className={`flex items-center gap-4 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}>
      {/* Icon */}
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${icon.bg}`}>
        <span className="text-xl leading-none">{icon.emoji}</span>
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
        {sub && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            {sub.dot && (
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
            )}
            {sub.text}
          </p>
        )}
      </div>

      {/* Value */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">{valueMain}</p>
        {valueSub && <p className="text-xs text-gray-400 mt-0.5">{valueSub}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpendingHighlights({ expenses = [], selectedMonth, selectedYear }) {
  const highlights = useMemo(
    () => buildHighlights(expenses, selectedMonth, selectedYear),
    [expenses, selectedMonth, selectedYear]
  );

  if (!highlights) {
    return (
      <Card>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">
          Spending Highlights
        </h2>
        <p className="text-sm text-gray-400">No expenses found for this month.</p>
      </Card>
    );
  }

  const { biggest, highestDay, noSpendStreak } = highlights;
  const catConfig = CATEGORY_CONFIG[biggest.category] || CATEGORY_CONFIG.Others;

  const rows = [
    {
      icon: { emoji: "🧾", bg: "bg-orange-100" },
      label: "Biggest Expense",
      sub: { dot: true, text: biggest.category },
      valueMain: fmt(biggest.amount),
      valueSub: formatDate(biggest.date),
    },
    {
      icon: { emoji: "📅", bg: "bg-green-100" },
      label: "Highest Spending Day",
      sub: { dot: false, text: fmt(highestDay.total) + " spent" },
      valueMain: formatDate(highestDay.date),
      valueSub: null,
    },
    {
      icon: { emoji: "🔥", bg: "bg-purple-100" },
      label: "Longest No-Spend Streak",
      sub: { dot: false, text: noSpendStreak === 0 ? "No streak yet" : "consecutive days" },
      valueMain: noSpendStreak === 0 ? "—" : `${noSpendStreak} day${noSpendStreak !== 1 ? "s" : ""}`,
      valueSub: null,
    },
  ];

  return (
    <Card>
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
        Spending Highlights
      </h2>
      <p className="text-xs text-gray-400 mb-2">Notable moments from this month</p>

      <div>
        {rows.map((row, i) => (
          <HighlightRow key={i} {...row} isLast={i === rows.length - 1} />
        ))}
      </div>
    </Card>
  );
}