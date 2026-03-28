import { jsPDF } from "jspdf";

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n) {
  return `Rs.${Math.round(n).toLocaleString("en-IN")}`;
}

function monthName(monthIndex) {
  return [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ][monthIndex];
}

function toDateOnly(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dateStr) {
  return toDateOnly(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(dateStr) {
  return toDateOnly(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ─── color palette ────────────────────────────────────────────────────────────

const C = {
  primary:    [79,  70,  229],
  primaryLight:[224, 231, 255],
  text:       [17,  24,  39],
  muted:      [107, 114, 128],
  light:      [243, 244, 246],
  border:     [229, 231, 235],
  white:      [255, 255, 255],
  red:        [239, 68,  68],
  redLight:   [254, 226, 226],
  green:      [16,  185, 129],
  greenLight: [209, 250, 229],
  amber:      [245, 158, 11],
  amberLight: [254, 243, 199],
  blue:       [59,  130, 246],
  purple:     [139, 92,  246],
  purpleLight:[237, 233, 254],
  orange:     [249, 115,  22],
  orangeLight:[255, 237, 213],
};

// ─── drawing primitives ───────────────────────────────────────────────────────

function setFont(doc, size, style = "normal", color = C.text) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
}

function drawRect(doc, x, y, w, h, fillColor, strokeColor = null) {
  doc.setFillColor(...fillColor);
  if (strokeColor) {
    doc.setDrawColor(...strokeColor);
    doc.roundedRect(x, y, w, h, 2, 2, "FD");
  } else {
    doc.roundedRect(x, y, w, h, 2, 2, "F");
  }
}

function drawLine(doc, x1, y1, x2, y2, color = C.border) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  doc.line(x1, y1, x2, y2);
}

// ─── section header ───────────────────────────────────────────────────────────

function sectionHeader(doc, title, y, pageW, margins) {
  doc.setFillColor(...C.primary);
  doc.rect(margins.left, y, 3, 5, "F");
  setFont(doc, 11, "bold", C.text);
  doc.text(title, margins.left + 6, y + 4);
  drawLine(doc, margins.left, y + 7, pageW - margins.right, y + 7, C.border);
  return y + 12;
}

// ─── page break check ─────────────────────────────────────────────────────────

function checkPageBreak(doc, y, needed, pageH, margins, addHeaderFn) {
  if (y + needed > pageH - margins.bottom) {
    doc.addPage();
    return addHeaderFn(doc, margins);
  }
  return y;
}

// ─── Financial Health scorers (pure JS, copied from FinancialHealthScore.jsx) ─

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
  const cats = {
    Food: budget.food, Shopping: budget.shopping,
    Transport: budget.transport, Bills: budget.bills, Others: budget.others,
  };
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
  const cats = {
    Food: budget.food, Shopping: budget.shopping,
    Transport: budget.transport, Bills: budget.bills, Others: budget.others,
  };
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
  const cats = {
    Food: budget.food, Shopping: budget.shopping,
    Transport: budget.transport, Bills: budget.bills, Others: budget.others,
  };
  const totalBudget = Object.values(cats).reduce((a, b) => a + b, 0);
  if (!totalBudget) return 50;
  const spend = {};
  expenses.forEach(e => { spend[e.category] = (spend[e.category] || 0) + e.amount; });
  const totalOverrun = Object.keys(cats).reduce(
    (a, k) => a + Math.max(0, (spend[k] || 0) - cats[k]), 0
  );
  const severity = totalOverrun / totalBudget;
  if (severity === 0)   return 100;
  if (severity <= 0.05) return 85;
  if (severity <= 0.15) return 65;
  if (severity <= 0.30) return 40;
  return clamp(100 - severity * 150, 0, 30);
}

function computeHealthScore(expenses, budgetFull, selectedMonth, selectedYear) {
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
}

function scoreLabel(score) {
  if (score >= 80) return { label: "Healthy",  color: C.green,  bgColor: C.greenLight };
  if (score >= 60) return { label: "Fair",     color: C.amber,  bgColor: C.amberLight };
  if (score >= 40) return { label: "Caution",  color: C.orange, bgColor: C.orangeLight };
  return              { label: "At Risk",   color: C.red,    bgColor: C.redLight   };
}

function indicatorTier(score) {
  if (score >= 75) return { label: "Well",     color: C.green,  bgColor: C.greenLight };
  if (score >= 50) return { label: "Fair",     color: C.amber,  bgColor: C.amberLight };
  return              { label: "At Risk",   color: C.red,    bgColor: C.redLight   };
}

// ─── Spending Highlights builder (mirrors SpendingHighlights.jsx logic) ────────

function buildHighlights(expenses, selectedMonth, selectedYear) {
  const monthExpenses = expenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });
  if (!monthExpenses.length) return null;

  const biggest = monthExpenses.reduce(
    (max, e) => (e.amount > max.amount ? e : max),
    monthExpenses[0]
  );

  const dailyTotals = {};
  monthExpenses.forEach((e) => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  const highestDayEntry = Object.entries(dailyTotals).reduce(
    (max, [date, total]) => (total > max[1] ? [date, total] : max),
    ["", 0]
  );

  const spendDates = new Set(Object.keys(dailyTotals));
  const days = daysInMonth(selectedYear, selectedMonth);
  let longestStreak = 0, currentStreak = 0;
  for (let day = 1; day <= days; day++) {
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

// ─── main export ─────────────────────────────────────────────────────────────

export function generateReport({ expenses = [], budgets = {}, budgetFull = null, selectedMonth, selectedYear }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW   = doc.internal.pageSize.getWidth();
  const pageH   = doc.internal.pageSize.getHeight();
  const margins = { left: 16, right: 16, top: 16, bottom: 16 };
  const contentW = pageW - margins.left - margins.right;

  const label = `${monthName(selectedMonth)} ${selectedYear}`;

  const monthExpenses = expenses.filter((e) => {
    const d = toDateOnly(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // ── derived data ──────────────────────────────────────────────────────────

  const catTotals = {};
  monthExpenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const totalSpend  = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = Object.values(budgets || {}).reduce((s, v) => s + (v || 0), 0);
  const txnCount    = monthExpenses.length;
  const avgPerDay   = totalSpend / daysInMonth(selectedYear, selectedMonth);
  const sorted      = [...monthExpenses].sort((a, b) => toDateOnly(b.date) - toDateOnly(a.date));

  // ── page header helper ────────────────────────────────────────────────────

  let pageNum = 1;

  function addPageHeader(doc, margins) {
    doc.setFillColor(...C.primary);
    doc.rect(0, 0, pageW, 12, "F");
    setFont(doc, 9, "bold", C.white);
    doc.text("Trackwise — Expense Report", margins.left, 8);
    setFont(doc, 8, "normal", [199, 210, 254]);
    doc.text(label, pageW - margins.right, 8, { align: "right" });
    setFont(doc, 7, "normal", C.muted);
    doc.text(`Page ${pageNum}`, pageW / 2, pageH - 5, { align: "center" });
    pageNum++;
    return margins.top + 12 + 4;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1
  // ══════════════════════════════════════════════════════════════════════════

  let y = addPageHeader(doc, margins);

  // ── Report title ──────────────────────────────────────────────────────────

  setFont(doc, 18, "bold", C.text);
  doc.text("Monthly Expense Report", margins.left, y + 8);
  setFont(doc, 10, "normal", C.muted);
  doc.text(label, margins.left, y + 15);
  setFont(doc, 8, "normal", C.muted);
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    pageW - margins.right, y + 8, { align: "right" }
  );
  y += 22;
  drawLine(doc, margins.left, y, pageW - margins.right, y);
  y += 8;

  // ── KPI row ───────────────────────────────────────────────────────────────

  const kpis = [
    { label: "Total Spend",  value: fmt(totalSpend) },
    { label: "Transactions", value: String(txnCount) },
    { label: "Avg / Day",    value: fmt(avgPerDay) },
    { label: "Budget",       value: totalBudget > 0 ? fmt(totalBudget) : "—" },
    { label: "Budget Used",  value: totalBudget > 0 ? `${Math.round((totalSpend / totalBudget) * 100)}%` : "—" },
  ];

  const kpiW = contentW / kpis.length;
  kpis.forEach((k, i) => {
    const kx = margins.left + i * kpiW;
    drawRect(doc, kx + 1, y, kpiW - 2, 18, C.light);
    setFont(doc, 7, "normal", C.muted);
    doc.text(k.label, kx + kpiW / 2, y + 6, { align: "center" });
    setFont(doc, 11, "bold", C.text);
    doc.text(k.value, kx + kpiW / 2, y + 13, { align: "center" });
  });
  y += 24;

  // ── Category Summary ──────────────────────────────────────────────────────

  y = sectionHeader(doc, "Category Summary", y, pageW, margins);

  const cats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const maxCatSpend = cats[0]?.[1] || 1;
  const barTrackW = 60;
  const colW = contentW / 2 - 4;

  cats.forEach(([cat, spent], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx  = margins.left + col * (colW + 8);
    const cy  = y + row * 22;

    const budget  = budgets?.[cat] || 0;
    const barFill = budget > 0
      ? spent > budget ? C.red : spent / budget > 0.8 ? C.amber : C.green
      : C.primary;

    drawRect(doc, cx, cy, colW, 19, C.light);

    setFont(doc, 8, "bold", C.text);
    doc.text(cat, cx + 4, cy + 6);

    setFont(doc, 7, "normal", C.muted);
    const budgetText = budget > 0 ? ` / ${fmt(budget)}` : "";
    doc.text(`${fmt(spent)}${budgetText}`, cx + colW - 4, cy + 6, { align: "right" });

    drawRect(doc, cx + 4, cy + 10, barTrackW, 3, C.border);
    const fillW = budget > 0
      ? Math.min((spent / budget) * barTrackW, barTrackW)
      : (spent / maxCatSpend) * barTrackW;
    if (fillW > 0) {
      doc.setFillColor(...barFill);
      doc.roundedRect(cx + 4, cy + 10, fillW, 3, 1, 1, "F");
    }

    if (budget > 0) {
      const pct = (spent / budget) * 100;
      setFont(doc, 6.5, "normal", pct > 100 ? C.red : C.muted);
      doc.text(
        `${Math.round(pct)}%${pct > 100 ? " (Over)" : " used"}`,
        cx + 4, cy + 17
      );
    }
  });

  y += Math.ceil(cats.length / 2) * 22 + 6;

  // ── Budget vs Actual table ────────────────────────────────────────────────

  if (totalBudget > 0) {
    y = checkPageBreak(doc, y, 50, pageH, margins, addPageHeader);
    y = sectionHeader(doc, "Budget vs Actual", y, pageW, margins);

    const cols = { cat: 40, budget: 35, actual: 35, diff: 35, status: 30 };
    const headers = ["Category", "Budget", "Actual", "Difference", "Status"];
    const colXs = [
      margins.left,
      margins.left + cols.cat,
      margins.left + cols.cat + cols.budget,
      margins.left + cols.cat + cols.budget + cols.actual,
      margins.left + cols.cat + cols.budget + cols.actual + cols.diff,
    ];

    drawRect(doc, margins.left, y, contentW, 7, C.primary);
    headers.forEach((h, i) => {
      setFont(doc, 7.5, "bold", C.white);
      doc.text(h, colXs[i] + 2, y + 5);
    });
    y += 7;

    const allCats = ["Food", "Shopping", "Transport", "Bills", "Others"];
    allCats.forEach((cat, idx) => {
      const bgt   = budgets?.[cat] || 0;
      const spent = catTotals[cat] || 0;
      const diff  = bgt - spent;
      const isOver = diff < 0;
      const rowBg  = idx % 2 === 0 ? C.white : C.light;

      drawRect(doc, margins.left, y, contentW, 7, rowBg);
      drawLine(doc, margins.left, y + 7, margins.left + contentW, y + 7, C.border);

      setFont(doc, 7.5, "normal", C.text);
      doc.text(cat, colXs[0] + 2, y + 5);
      doc.text(bgt > 0 ? fmt(bgt) : "—", colXs[1] + 2, y + 5);
      doc.text(fmt(spent), colXs[2] + 2, y + 5);

      setFont(doc, 7.5, "bold", isOver ? C.red : C.green);
      doc.text(
        isOver ? `-${fmt(Math.abs(diff))}` : `+${fmt(diff)}`,
        colXs[3] + 2, y + 5
      );

      setFont(doc, 6.5, "bold", isOver ? C.red : spent / Math.max(bgt, 1) > 0.8 ? C.amber : C.green);
      doc.text(
        isOver ? "Over budget" : spent / Math.max(bgt, 1) > 0.8 ? "High" : "On track",
        colXs[4] + 2, y + 5
      );

      y += 7;
    });

    drawRect(doc, margins.left, y, contentW, 8, C.primaryLight);
    setFont(doc, 8, "bold", C.primary);
    doc.text("Total", colXs[0] + 2, y + 5.5);
    doc.text(fmt(totalBudget), colXs[1] + 2, y + 5.5);
    doc.text(fmt(totalSpend),  colXs[2] + 2, y + 5.5);
    const totalDiff = totalBudget - totalSpend;
    setFont(doc, 8, "bold", totalDiff < 0 ? C.red : C.green);
    doc.text(
      totalDiff < 0 ? `-${fmt(Math.abs(totalDiff))}` : `+${fmt(totalDiff)}`,
      colXs[3] + 2, y + 5.5
    );
    y += 14;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SPENDING HIGHLIGHTS
  // ══════════════════════════════════════════════════════════════════════════

  y = checkPageBreak(doc, y, 55, pageH, margins, addPageHeader);
  y = sectionHeader(doc, "Spending Highlights", y, pageW, margins);

  const highlights = buildHighlights(expenses, selectedMonth, selectedYear);

  if (!highlights) {
    setFont(doc, 8, "normal", C.muted);
    doc.text("No expenses found for this month.", margins.left, y + 5);
    y += 14;
  } else {
    const { biggest, highestDay, noSpendStreak } = highlights;

    const hlRows = [
      {
        emoji: "🧾",
        emojiLabel: "TX",
        bgColor: C.orangeLight,
        accentColor: C.orange,
        label: "Biggest Expense",
        sub: biggest.category,
        valueMain: fmt(biggest.amount),
        valueSub: formatDateShort(biggest.date),
      },
      {
        emoji: "📅",
        emojiLabel: "DY",
        bgColor: C.greenLight,
        accentColor: C.green,
        label: "Highest Spending Day",
        sub: `${fmt(highestDay.total)} spent`,
        valueMain: highestDay.date ? formatDateShort(highestDay.date) : "—",
        valueSub: null,
      },
      {
        emoji: "🔥",
        emojiLabel: "SK",
        bgColor: C.purpleLight,
        accentColor: C.purple,
        label: "Longest No-Spend Streak",
        sub: noSpendStreak === 0 ? "No streak yet" : "consecutive days",
        valueMain: noSpendStreak === 0 ? "—" : `${noSpendStreak} day${noSpendStreak !== 1 ? "s" : ""}`,
        valueSub: null,
      },
    ];

    const rowH = 26;               // taller card so label + value don't collide
    const gap  = 3;                 // gap between cards
    const hlColW = (contentW - gap * 2) / 3;  // three equal columns

    hlRows.forEach((row, i) => {
      const rx = margins.left + i * (hlColW + gap);
      const ry = y;

      // card background
      drawRect(doc, rx, ry, hlColW, rowH, C.light);

      // accent top strip instead of left strip — avoids squishing text
      doc.setFillColor(...row.accentColor);
      doc.roundedRect(rx, ry, hlColW, 3, 1, 1, "F");

      // icon circle — sits left, vertically centred in lower area
      const iconCX = rx + 8;
      const iconCY = ry + 15;
      doc.setFillColor(...row.bgColor);
      doc.circle(iconCX, iconCY, 4, "F");
      setFont(doc, 5.5, "bold", row.accentColor);
      doc.text(row.emojiLabel, iconCX, iconCY + 1.5, { align: "center" });

      // label — top-left, below the accent strip
      setFont(doc, 7, "bold", C.text);
      doc.text(row.label, rx + 3, ry + 9);

      // sub — below label
      setFont(doc, 6, "normal", C.muted);
      doc.text(row.sub, rx + 15, ry + 21);

      // value — large, right-aligned, on its own row
      setFont(doc, 10, "bold", row.accentColor);
      doc.text(row.valueMain, rx + hlColW - 3, ry + 21, { align: "right" });

      // valueSub — smaller date below value if present
      if (row.valueSub) {
        setFont(doc, 6, "normal", C.muted);
        doc.text(row.valueSub, rx + hlColW - 3, ry + 25.5, { align: "right" });
      }
    });

    y += rowH + 8;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FINANCIAL HEALTH SCORE
  // ══════════════════════════════════════════════════════════════════════════

  y = checkPageBreak(doc, y, 70, pageH, margins, addPageHeader);
  y = sectionHeader(doc, "Financial Health Score", y, pageW, margins);

  const scores = computeHealthScore(monthExpenses, budgetFull, selectedMonth, selectedYear);
  const { label: scoreLabel_, color: scoreColor_, bgColor: scoreBg } = scoreLabel(scores.total);

  // ── Score display — left card ─────────────────────────────────────────────

  const scoreCardW = 55;
  const scoreCardH = 46;
  drawRect(doc, margins.left, y, scoreCardW, scoreCardH, C.light);

  // big score number
  setFont(doc, 28, "bold", scoreColor_);
  doc.text(String(scores.total), margins.left + scoreCardW / 2, y + 20, { align: "center" });

  // "/100" label
  setFont(doc, 8, "normal", C.muted);
  doc.text("/ 100", margins.left + scoreCardW / 2, y + 27, { align: "center" });

  // score arc bar (simple rectangle progress bar under the number)
  const arcX = margins.left + 6;
  const arcY = y + 31;
  const arcW = scoreCardW - 12;
  const arcH = 4;
  drawRect(doc, arcX, arcY, arcW, arcH, C.border);
  const fillPct = scores.total / 100;
  doc.setFillColor(...scoreColor_);
  doc.roundedRect(arcX, arcY, arcW * fillPct, arcH, 1, 1, "F");

  // label badge
  drawRect(doc, margins.left + 8, y + 38, scoreCardW - 16, 6, scoreBg);
  setFont(doc, 7.5, "bold", scoreColor_);
  doc.text(scoreLabel_, margins.left + scoreCardW / 2, y + 42.5, { align: "center" });

  // ── Indicators — right panel ──────────────────────────────────────────────

  const indX = margins.left + scoreCardW + 6;
  const indW = contentW - scoreCardW - 6;

  const indicators = [
    { label: "Budget Pacing",        score: scores.s3 },
    { label: "Category Balance",     score: scores.s4 },
    { label: "Savings Discipline",   score: scores.s1 },
    { label: "Budget Adherence",     score: scores.s2 },
    { label: "Spending Consistency", score: scores.s5 },
    { label: "Overrun Severity",     score: scores.s6 },
  ];

  const indRowH = scoreCardH / indicators.length;

  indicators.forEach((ind, i) => {
    const { label: tierLabel, color: tierColor, bgColor: tierBg } = indicatorTier(ind.score);
    const iy = y + i * indRowH;

    if (i > 0) drawLine(doc, indX, iy, indX + indW, iy, C.border);

    // dot
    doc.setFillColor(...tierColor);
    doc.circle(indX + 2.5, iy + indRowH / 2, 1.5, "F");

    // label
    setFont(doc, 7, "normal", C.text);
    doc.text(ind.label, indX + 7, iy + indRowH / 2 + 1);

    // mini bar
    const miniBarX = indX + 70;
    const miniBarW = 28;
    const miniBarH = 2.5;
    const miniBarY = iy + indRowH / 2 - 1;
    drawRect(doc, miniBarX, miniBarY, miniBarW, miniBarH, C.border);
    doc.setFillColor(...tierColor);
    doc.roundedRect(miniBarX, miniBarY, miniBarW * (ind.score / 100), miniBarH, 0.5, 0.5, "F");

    // score number
    setFont(doc, 6.5, "bold", tierColor);
    doc.text(`${Math.round(ind.score)}`, miniBarX + miniBarW + 3, iy + indRowH / 2 + 1);

    // tier badge
    drawRect(doc, miniBarX + miniBarW + 10, iy + indRowH / 2 - 2.5, 14, 5, tierBg);
    setFont(doc, 5.5, "bold", tierColor);
    doc.text(tierLabel, miniBarX + miniBarW + 17, iy + indRowH / 2 + 0.8, { align: "center" });
  });

  y += scoreCardH + 6;

  // ── no budget warning ─────────────────────────────────────────────────────

  if (!budgetFull) {
    drawRect(doc, margins.left, y, contentW, 8, C.amberLight);
    setFont(doc, 7, "normal", C.amber);
    doc.text(
      "⚠  No budget set for this month — some scores are estimated defaults.",
      margins.left + 3, y + 5
    );
    y += 12;
  } else {
    y += 4;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EXPENSE LIST (may span multiple pages)
  // ══════════════════════════════════════════════════════════════════════════

  y = checkPageBreak(doc, y, 30, pageH, margins, addPageHeader);
  y = sectionHeader(doc, "All Transactions", y, pageW, margins);

  const tCols = { date: 28, category: 34, note: 80, amount: 32 };
  const tXs   = [
    margins.left,
    margins.left + tCols.date,
    margins.left + tCols.date + tCols.category,
    margins.left + tCols.date + tCols.category + tCols.note,
  ];
  const tHeaders = ["Date", "Category", "Note", "Amount"];

  drawRect(doc, margins.left, y, contentW, 7, C.primary);
  tHeaders.forEach((h, i) => {
    setFont(doc, 7.5, "bold", C.white);
    const align = i === 3 ? "right" : "left";
    const tx = i === 3 ? tXs[i] + tCols.amount - 2 : tXs[i] + 2;
    doc.text(h, tx, y + 5, { align });
  });
  y += 7;

  sorted.forEach((e, idx) => {
    y = checkPageBreak(doc, y, 8, pageH, margins, (d, m) => {
      const ny = addPageHeader(d, m);
      drawRect(d, m.left, ny - 1, contentW, 7, C.primary);
      tHeaders.forEach((h, i) => {
        setFont(d, 7.5, "bold", C.white);
        const align = i === 3 ? "right" : "left";
        const tx = i === 3 ? tXs[i] + tCols.amount - 2 : tXs[i] + 2;
        d.text(h, tx, ny + 4, { align });
      });
      return ny + 6;
    });

    const rowBg = idx % 2 === 0 ? C.white : C.light;
    drawRect(doc, margins.left, y, contentW, 7, rowBg);
    drawLine(doc, margins.left, y + 7, margins.left + contentW, y + 7, C.border);

    const note = e.note
      ? (e.note.length > 38 ? e.note.slice(0, 35) + "..." : e.note)
      : "—";

    setFont(doc, 7, "normal", C.muted);
    doc.text(formatDate(e.date), tXs[0] + 2, y + 4.5);
    setFont(doc, 7, "normal", C.text);
    doc.text(e.category, tXs[1] + 2, y + 4.5);
    setFont(doc, 7, "normal", C.muted);
    doc.text(note, tXs[2] + 2, y + 4.5);
    setFont(doc, 7.5, "bold", C.text);
    doc.text(fmt(e.amount), tXs[3] + tCols.amount - 2, y + 4.5, { align: "right" });

    y += 7;
  });

  // grand total row
  y = checkPageBreak(doc, y, 10, pageH, margins, addPageHeader);
  drawRect(doc, margins.left, y, contentW, 8, C.primaryLight);
  setFont(doc, 8, "bold", C.primary);
  doc.text(`Total — ${txnCount} transactions`, tXs[0] + 2, y + 5.5);
  doc.text(fmt(totalSpend), tXs[3] + tCols.amount - 2, y + 5.5, { align: "right" });

  // ── save ──────────────────────────────────────────────────────────────────

  doc.save(`Trackwise_Report_${monthName(selectedMonth)}_${selectedYear}.pdf`);
}