export function buildOverrunPredictions(expenses, budgets) {
  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  const categoryMap = {};

  // current month expenses
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    }
  });

  const result = [];

  Object.keys(budgets).forEach((cat) => {
    const currentSpent = categoryMap[cat] || 0;
    const budget = budgets[cat] || 0;

    if (budget === 0) return;

    const dailyAvg = currentSpent / currentDay;
    const predicted = dailyAvg * totalDays;
    const overrun = predicted - budget;

    result.push({
      category: cat,
      currentSpent,
      budget,
      predicted,
      overrun,
    });
  });

  // 👉 only risky categories
  return result
    .filter((r) => r.overrun > 0)
    .sort((a, b) => b.overrun - a.overrun);
}