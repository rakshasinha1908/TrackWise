// utils/insights.js

export function getMonthlyTotals(expenses, year, month) {
  const current = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const previous = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });

  const sum = arr => arr.reduce((t, e) => t + Number(e.amount), 0);

  return {
    currentTotal: sum(current),
    previousTotal: sum(previous),
  };
}


export function aggregateCategories(expenses, year, month) {
  const map = {};

  expenses.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    }
  });

  const labels = Object.keys(map);
  const totals = Object.values(map);

  return { labels, totals };
}


export function getTopCategory(labels, totals) {
  let max = 0;
  let top = null;

  totals.forEach((v, i) => {
    if (v > max) {
      max = v;
      top = labels[i];
    }
  });

  return { category: top, amount: max };
}


export function getCategoryPercentages(totals) {
  const total = totals.reduce((a, b) => a + b, 0);
  return totals.map(v =>
    total > 0 ? Math.round((v / total) * 100) : 0
  );
}


export function compareMonths(current, previous) {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}


export function generateSmartTips({
  foodPercent,
  growth,
  savings = 0,
}) {
  const tips = [];

  if (foodPercent > 40) {
    tips.push({
      type: "warning",
      title: "Consider setting a food budget",
      message: `Food makes up ${foodPercent}% of your spending this month.`,
      action: "Set Food Budget",
    });
  }

  if (growth > 20) {
    tips.push({
      type: "danger",
      title: "Spending is increasing",
      message: `Your spending is up ${growth}% compared to last month.`,
      action: "View report",
    });
  }

  if (savings < 2000) {
    tips.push({
      type: "good",
      title: "Build a savings habit",
      message: "Try setting aside some money as savings first.",
      action: "Add savings goal",
    });
  }

  if (tips.length === 0) {
    tips.push({
      type: "good",
      title: "Great job!",
      message: "Your spending looks balanced this month.",
    });
  }

  return tips;
}
