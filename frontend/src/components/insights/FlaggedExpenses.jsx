// import { useMemo, useState } from "react";
// import Card from "../ui/Card";

// // ─── constants ───────────────────────────────────────────────────────────────

// const FLAG_CONFIG = {
//   high_value: {
//     icon: "🔥",
//     label: "High Amount",
//     bg: "bg-red-50",
//     border: "border-red-100",
//     badgeBg: "bg-red-100",
//     badgeText: "text-red-600",
//   },
//   spike: {
//     icon: "🚀",
//     label: "Sudden Spike",
//     bg: "bg-orange-50",
//     border: "border-orange-100",
//     badgeBg: "bg-orange-100",
//     badgeText: "text-orange-600",
//   },
//   budget_impact: {
//     icon: "📈",
//     label: "Category Overuse",
//     bg: "bg-yellow-50",
//     border: "border-yellow-100",
//     badgeBg: "bg-yellow-100",
//     badgeText: "text-yellow-700",
//   },
//   unusual: {
//     icon: "⚠️",
//     label: "Unusual Spend",
//     bg: "bg-blue-50",
//     border: "border-blue-100",
//     badgeBg: "bg-blue-100",
//     badgeText: "text-blue-600",
//   },
// };

// const CATEGORY_EMOJI = {
//   Food: "🍔",
//   Shopping: "🛍️",
//   Transport: "🚗",
//   Bills: "📄",
//   Others: "📦",
// };

// const ACTION_HINTS = {
//   high_value: {
//     Food: "Watch for large one-off meal expenses.",
//     Shopping: "Review discretionary shopping purchases.",
//     Transport: "Check if this was a recurring or one-time trip.",
//     Bills: "Confirm this bill is accurate and expected.",
//     Others: "Review if this was a planned expense.",
//   },
//   spike: {
//     Food: "Try spacing out larger food expenses.",
//     Shopping: "Consider setting a per-transaction limit.",
//     Transport: "Look for cheaper alternatives for this route.",
//     Bills: "Verify this bill against previous months.",
//     Others: "Track what triggered this sudden spike.",
//   },
//   budget_impact: {
//     Food: "Limit high-value meals for the rest of the month.",
//     Shopping: "Pause non-essential shopping until next month.",
//     Transport: "Consider shared or cheaper transport options.",
//     Bills: "Review if all subscriptions are still needed.",
//     Others: "Identify and defer non-urgent expenses.",
//   },
//   unusual: {
//     Food: "Unusual for your Food pattern — keep an eye on it.",
//     Shopping: "This category rarely spikes — worth reviewing.",
//     Transport: "Uncommon spend for Transport — verify it.",
//     Bills: "Bills rarely change — confirm this is correct.",
//     Others: "Unfamiliar spend pattern detected here.",
//   },
// };

// // ─── helpers ─────────────────────────────────────────────────────────────────

// function fmt(n) {
//   return `₹${Math.round(n).toLocaleString("en-IN")}`;
// }

// function toDateOnly(dateStr) {
//   const [y, m, d] = dateStr.split("-").map(Number);
//   return new Date(y, m - 1, d);
// }

// function getDayLabel(dateStr) {
//   return toDateOnly(dateStr).toLocaleDateString("en-US", { weekday: "short" });
// }

// function getDateLabel(dateStr) {
//   return toDateOnly(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });
// }

// // ─── core flagging logic ──────────────────────────────────────────────────────

// function buildFlags(expenses, selectedMonth, selectedYear, budgets) {
//   const monthExpenses = expenses.filter((e) => {
//     const d = toDateOnly(e.date);
//     return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
//   });

//   if (!monthExpenses.length) return [];

//   // ── per-category averages (excluding the expense being evaluated) ──
//   const categoryAmounts = {};
//   monthExpenses.forEach((e) => {
//     if (!categoryAmounts[e.category]) categoryAmounts[e.category] = [];
//     categoryAmounts[e.category].push(e.amount);
//   });

//   const categoryAvg = {};
//   Object.entries(categoryAmounts).forEach(([cat, amounts]) => {
//     categoryAvg[cat] = amounts.reduce((s, a) => s + a, 0) / amounts.length;
//   });

//   // ── last-7-day max per category ──
//   const today = new Date();
//   const refDate =
//     today.getMonth() === selectedMonth && today.getFullYear() === selectedYear
//       ? today
//       : new Date(selectedYear, selectedMonth + 1, 0);

//   const last7Start = new Date(refDate);
//   last7Start.setDate(refDate.getDate() - 6);
//   last7Start.setHours(0, 0, 0, 0);

//   const last7 = monthExpenses.filter((e) => {
//     const d = toDateOnly(e.date);
//     return d >= last7Start && d <= refDate;
//   });

//   const last7MaxByCategory = {};
//   last7.forEach((e) => {
//     last7MaxByCategory[e.category] = Math.max(
//       last7MaxByCategory[e.category] || 0,
//       e.amount
//     );
//   });

//   // ── category usage frequency (how many distinct days had a spend) ──
//   const categoryDays = {};
//   monthExpenses.forEach((e) => {
//     if (!categoryDays[e.category]) categoryDays[e.category] = new Set();
//     categoryDays[e.category].add(e.date);
//   });

//   const flagged = [];
//   const seen = new Set(); // dedupe: one flag per expense

//   monthExpenses.forEach((expense) => {
//     if (seen.has(expense.id)) return;

//     const { amount, category, date, id } = expense;
//     const avg = categoryAvg[category] || 0;
//     const budget = budgets?.[category] || 0;
//     const last7Max = last7MaxByCategory[category] || 0;
//     const dayCount = categoryDays[category]?.size || 1;
//     const totalDaysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
//     const usageRatio = dayCount / totalDaysInMonth;

//     let flag = null;

//     // 🔴 1. High Value — expense > 2x category average
//     if (avg > 0 && amount >= avg * 2) {
//       const multiple = (amount / avg).toFixed(1);
//       flag = {
//         type: "high_value",
//         reason: `${multiple}x higher than your average ${category} spend`,
//         context: { label: `Avg ${category} spend`, value: fmt(avg) },
//         actionHint: ACTION_HINTS.high_value[category] || ACTION_HINTS.high_value.Others,
//         score: amount / avg, // higher ratio = higher priority
//       };
//     }

//     // 🟠 2. Spike — highest in last 7 days AND notably large
//     if (
//       !flag &&
//       last7.some((e) => e.id === id) &&
//       amount >= last7Max &&
//       last7.filter((e) => e.category === category).length >= 2
//     ) {
//       const last7Avg =
//         last7
//           .filter((e) => e.category === category)
//           .reduce((s, e) => s + e.amount, 0) /
//         last7.filter((e) => e.category === category).length;

//       if (amount > last7Avg * 1.5) {
//         flag = {
//           type: "spike",
//           reason: `Highest ${category} expense in the last 7 days`,
//           context: { label: "7-day avg for this category", value: fmt(last7Avg) },
//           actionHint: ACTION_HINTS.spike[category] || ACTION_HINTS.spike.Others,
//           score: amount / Math.max(last7Avg, 1),
//         };
//       }
//     }

//     // 🟡 3. Budget Impact — single expense > 30% of category budget
//     if (!flag && budget > 0 && amount >= budget * 0.3) {
//       const pct = Math.round((amount / budget) * 100);
//       flag = {
//         type: "budget_impact",
//         reason: `This single expense is ${pct}% of your ${category} budget`,
//         context: { label: `${category} budget`, value: fmt(budget) },
//         actionHint:
//           ACTION_HINTS.budget_impact[category] || ACTION_HINTS.budget_impact.Others,
//         score: amount / budget,
//       };
//     }

//     // 🔵 4. Unusual — category rarely used but this spend is notably high
//     if (
//       !flag &&
//       usageRatio < 0.15 &&
//       avg > 0 &&
//       amount >= avg * 1.5
//     ) {
//       flag = {
//         type: "unusual",
//         reason: `${category} is rarely used — this stands out`,
//         context: { label: `Only ${dayCount} spend day${dayCount !== 1 ? "s" : ""} this month`, value: category },
//         actionHint: ACTION_HINTS.unusual[category] || ACTION_HINTS.unusual.Others,
//         score: amount / avg,
//       };
//     }

//     if (flag) {
//       seen.add(id);
//       flagged.push({
//         id,
//         amount,
//         category,
//         date,
//         ...flag,
//       });
//     }
//   });

//   // sort by score desc, return top 5
//   return flagged.sort((a, b) => b.score - a.score).slice(0, 5);
// }

// // ─── FlagCard ─────────────────────────────────────────────────────────────────

// function FlagCard({ item, isLast }) {
//   const cfg = FLAG_CONFIG[item.type];

//   return (
//     <div
//       className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border} ${
//         !isLast ? "mb-3" : ""
//       }`}
//     >
//       {/* Top row: badge + amount/category/date */}
//       <div className="flex items-start justify-between gap-3 mb-2">
//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Flag badge */}
//           <span
//             className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}
//           >
//             <span className="text-sm leading-none">{cfg.icon}</span>
//             {cfg.label}
//           </span>
//           {/* Category pill */}
//           <span className="text-[11px] text-gray-400 font-medium">
//             {CATEGORY_EMOJI[item.category] || "📦"} {item.category}
//           </span>
//         </div>

//         {/* Amount + date */}
//         <div className="text-right flex-shrink-0">
//           <p className="text-base font-bold text-gray-800 leading-none">
//             {fmt(item.amount)}
//           </p>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {getDayLabel(item.date)}, {getDateLabel(item.date)}
//           </p>
//         </div>
//       </div>

//       {/* Reason */}
//       <p className="text-sm text-gray-700 font-medium leading-snug mb-2">
//         {item.reason}
//       </p>

//       {/* Context comparison */}
//       <div className="flex items-center gap-1.5 mb-3">
//         <span className="text-xs text-gray-400">{item.context.label}:</span>
//         <span className="text-xs font-semibold text-gray-600">
//           {item.context.value}
//         </span>
//       </div>

//       {/* Action hint */}
//       <div className="flex items-start gap-2 pt-3 border-t border-white/60">
//         <span className="text-sm leading-none mt-0.5 flex-shrink-0">🎯</span>
//         <p className="text-xs text-gray-500 italic leading-relaxed">
//           {item.actionHint}
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function FlaggedExpenses({
//   expenses = [],
//   selectedMonth,
//   selectedYear,
//   budgets = {},
// }) {
//   const [showAll, setShowAll] = useState(false);

//   const flags = useMemo(
//     () => buildFlags(expenses, selectedMonth, selectedYear, budgets),
//     [expenses, selectedMonth, selectedYear, budgets]
//   );

//   const visible = showAll ? flags : flags.slice(0, 3);

//   return (
//     <Card>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-1">
//         <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
//           Flagged Expenses
//         </h2>
//         {flags.length > 0 && (
//           <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-600">
//             {flags.length} flagged
//           </span>
//         )}
//       </div>
//       <p className="text-xs text-gray-400 mb-5">
//         Expenses that stand out from your usual patterns
//       </p>

//       {/* Empty state */}
//       {flags.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-10 text-center">
//           <span className="text-4xl mb-3">✅</span>
//           <p className="text-sm font-semibold text-gray-700">
//             No unusual expenses this month
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Everything looks within normal range — keep it up!
//           </p>
//         </div>
//       )}

//       {/* Flag list */}
//       {visible.map((item, i) => (
//         <FlagCard key={item.id} item={item} isLast={i === visible.length - 1} />
//       ))}

//       {/* Show more / less */}
//       {flags.length > 3 && (
//         <button
//           onClick={() => setShowAll((v) => !v)}
//           className="w-full mt-3 text-xs font-semibold text-gray-500 hover:text-gray-700 py-2 rounded-xl border border-gray-100 bg-gray-50 transition-colors"
//         >
//           {showAll ? "Show less ↑" : `Show ${flags.length - 3} more ↓`}
//         </button>
//       )}
//     </Card>
//   );
// }


import { useMemo, useState } from "react";
import Card from "../ui/Card";

// ─── constants ───────────────────────────────────────────────────────────────

const FLAG_CONFIG = {
  high_value: {
    icon: "🔥",
    label: "High Amount",
    bg: "bg-red-50",
    border: "border-red-100",
    badgeBg: "bg-red-100",
    badgeText: "text-red-600",
  },
  spike: {
    icon: "🚀",
    label: "Sudden Spike",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
  },
  budget_impact: {
    icon: "📈",
    label: "Category Overuse",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
  },
  unusual: {
    icon: "⚠️",
    label: "Unusual Spend",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
};

const CATEGORY_EMOJI = {
  Food: "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Bills: "📄",
  Others: "📦",
};

const ACTION_HINTS = {
  high_value: {
    Food: "Watch for large one-off meal expenses.",
    Shopping: "Review discretionary shopping purchases.",
    Transport: "Check if this was a recurring or one-time trip.",
    Bills: "Confirm this bill is accurate and expected.",
    Others: "Review if this was a planned expense.",
  },
  spike: {
    Food: "Try spacing out larger food expenses.",
    Shopping: "Consider setting a per-transaction limit.",
    Transport: "Look for cheaper alternatives for this route.",
    Bills: "Verify this bill against previous months.",
    Others: "Track what triggered this sudden spike.",
  },
  budget_impact: {
    Food: "Limit high-value meals for the rest of the month.",
    Shopping: "Pause non-essential shopping until next month.",
    Transport: "Consider shared or cheaper transport options.",
    Bills: "Review if all subscriptions are still needed.",
    Others: "Identify and defer non-urgent expenses.",
  },
  unusual: {
    Food: "Unusual for your Food pattern — keep an eye on it.",
    Shopping: "This category rarely spikes — worth reviewing.",
    Transport: "Uncommon spend for Transport — verify it.",
    Bills: "Bills rarely change — confirm this is correct.",
    Others: "Unfamiliar spend pattern detected here.",
  },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDayLabel(dateStr) {
  return toDateOnly(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

function getDateLabel(dateStr) {
  return toDateOnly(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── core flagging logic ──────────────────────────────────────────────────────

function buildFlags(expenses, selectedMonth, selectedYear, budgets) {
  const monthExpenses = expenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  if (!monthExpenses.length) return [];

  const categoryAmounts = {};
  monthExpenses.forEach((e) => {
    if (!categoryAmounts[e.category]) categoryAmounts[e.category] = [];
    categoryAmounts[e.category].push(e.amount);
  });

  const categoryAvg = {};
  Object.entries(categoryAmounts).forEach(([cat, amounts]) => {
    categoryAvg[cat] = amounts.reduce((s, a) => s + a, 0) / amounts.length;
  });

  const today = new Date();
  const refDate =
    today.getMonth() === selectedMonth && today.getFullYear() === selectedYear
      ? today
      : new Date(selectedYear, selectedMonth + 1, 0);

  const last7Start = new Date(refDate);
  last7Start.setDate(refDate.getDate() - 6);
  last7Start.setHours(0, 0, 0, 0);

  const last7 = monthExpenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d >= last7Start && d <= refDate;
  });

  const last7MaxByCategory = {};
  last7.forEach((e) => {
    last7MaxByCategory[e.category] = Math.max(
      last7MaxByCategory[e.category] || 0,
      e.amount
    );
  });

  const categoryDays = {};
  monthExpenses.forEach((e) => {
    if (!categoryDays[e.category]) categoryDays[e.category] = new Set();
    categoryDays[e.category].add(e.date);
  });

  const flagged = [];
  const seen = new Set();

  monthExpenses.forEach((expense) => {
    if (seen.has(expense.id)) return;

    const { amount, category, date, id } = expense;
    const avg = categoryAvg[category] || 0;
    const budget = budgets?.[category] || 0;
    const last7Max = last7MaxByCategory[category] || 0;
    const dayCount = categoryDays[category]?.size || 1;
    const totalDaysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const usageRatio = dayCount / totalDaysInMonth;

    let flag = null;

    if (avg > 0 && amount >= avg * 2) {
      const multiple = (amount / avg).toFixed(1);
      flag = {
        type: "high_value",
        reason: `${multiple}x higher than your average ${category} spend`,
        context: { label: `Avg ${category} spend`, value: fmt(avg) },
        actionHint: ACTION_HINTS.high_value[category] || ACTION_HINTS.high_value.Others,
        score: amount / avg,
      };
    }

    if (
      !flag &&
      last7.some((e) => e.id === id) &&
      amount >= last7Max &&
      last7.filter((e) => e.category === category).length >= 2
    ) {
      const last7Avg =
        last7.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0) /
        last7.filter((e) => e.category === category).length;

      if (amount > last7Avg * 1.5) {
        flag = {
          type: "spike",
          reason: `Highest ${category} expense in the last 7 days`,
          context: { label: "7-day avg for this category", value: fmt(last7Avg) },
          actionHint: ACTION_HINTS.spike[category] || ACTION_HINTS.spike.Others,
          score: amount / Math.max(last7Avg, 1),
        };
      }
    }

    if (!flag && budget > 0 && amount >= budget * 0.3) {
      const pct = Math.round((amount / budget) * 100);
      flag = {
        type: "budget_impact",
        reason: `This single expense is ${pct}% of your ${category} budget`,
        context: { label: `${category} budget`, value: fmt(budget) },
        actionHint: ACTION_HINTS.budget_impact[category] || ACTION_HINTS.budget_impact.Others,
        score: amount / budget,
      };
    }

    if (!flag && usageRatio < 0.15 && avg > 0 && amount >= avg * 1.5) {
      flag = {
        type: "unusual",
        reason: `${category} is rarely used — this stands out`,
        context: { label: `Only ${dayCount} spend day${dayCount !== 1 ? "s" : ""} this month`, value: category },
        actionHint: ACTION_HINTS.unusual[category] || ACTION_HINTS.unusual.Others,
        score: amount / avg,
      };
    }

    if (flag) {
      seen.add(id);
      flagged.push({ id, amount, category, date, ...flag });
    }
  });

  return flagged.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ─── FlagCard ─────────────────────────────────────────────────────────────────

function FlagCard({ item, isLast }) {
  const cfg = FLAG_CONFIG[item.type];

  return (
    <div
      className={`rounded-2xl border p-3 sm:p-4 ${cfg.bg} ${cfg.border} ${
        !isLast ? "mb-2 sm:mb-3" : ""
      }`}
    >
      {/* Top row: badge + amount/date */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">

        {/* Left: flag badge + category pill — wrap on very small screens */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          <span
            className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex-shrink-0 ${cfg.badgeBg} ${cfg.badgeText}`}
          >
            <span className="text-xs sm:text-sm leading-none">{cfg.icon}</span>
            {cfg.label}
          </span>
          <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
            {CATEGORY_EMOJI[item.category] || "📦"} {item.category}
          </span>
        </div>

        {/* Right: amount + date — never wraps */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm sm:text-base font-bold text-gray-800 leading-none">
            {fmt(item.amount)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
            {getDayLabel(item.date)}, {getDateLabel(item.date)}
          </p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs sm:text-sm text-gray-700 font-medium leading-snug mb-1.5 sm:mb-2">
        {item.reason}
      </p>

      {/* Context comparison */}
      <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs text-gray-400">{item.context.label}:</span>
        <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
          {item.context.value}
        </span>
      </div>

      {/* Action hint */}
      <div className="flex items-start gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-white/60">
        <span className="text-xs sm:text-sm leading-none mt-0.5 flex-shrink-0">🎯</span>
        <p className="text-[10px] sm:text-xs text-gray-500 italic leading-relaxed">
          {item.actionHint}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FlaggedExpenses({
  expenses = [],
  selectedMonth,
  selectedYear,
  budgets = {},
}) {
  const [showAll, setShowAll] = useState(false);

  const flags = useMemo(
    () => buildFlags(expenses, selectedMonth, selectedYear, budgets),
    [expenses, selectedMonth, selectedYear, budgets]
  );

  const visible = showAll ? flags : flags.slice(0, 3);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
          Flagged Expenses
        </h2>
        {flags.length > 0 && (
          <span className="text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
            {flags.length} flagged
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-4 sm:mb-5">
        Expenses that stand out from your usual patterns
      </p>

      {/* Empty state */}
      {flags.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
          <span className="text-3xl sm:text-4xl mb-2 sm:mb-3">✅</span>
          <p className="text-sm font-semibold text-gray-700">
            No unusual expenses this month
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Everything looks within normal range — keep it up!
          </p>
        </div>
      )}

      {/* Flag list */}
      {visible.map((item, i) => (
        <FlagCard key={item.id} item={item} isLast={i === visible.length - 1} />
      ))}

      {/* Show more / less */}
      {flags.length > 3 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full mt-2 sm:mt-3 text-xs font-semibold text-gray-500 hover:text-gray-700 py-2 rounded-xl border border-gray-100 bg-gray-50 transition-colors"
        >
          {showAll ? "Show less ↑" : `Show ${flags.length - 3} more ↓`}
        </button>
      )}
    </Card>
  );
}