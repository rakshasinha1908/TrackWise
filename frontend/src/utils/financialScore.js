// export function calculateFinancialHealth({
//   expenses,
//   budgets,
//   income = 0,
//   savings = 0,
// }) {
//   if (!expenses?.length || !budgets || Object.keys(budgets).length === 0)
//   return null;

//   const now = new Date();
//   const currentDay = now.getDate();
//   const totalDays = new Date(
//     now.getFullYear(),
//     now.getMonth() + 1,
//     0
//   ).getDate();

//   // ---------- TOTAL SPENT ----------
//   const totalSpent = expenses.reduce(
//     (sum, e) => sum + Number(e.amount || 0),
//     0
//   );

//   // ---------- 1. SAVINGS SCORE ----------
//   const allowedSpend = income - savings;

// let savingsScore = 100;

// if (totalSpent > allowedSpend) {
//   const overspend = totalSpent - allowedSpend;

//   // smoother penalty instead of killing score
//   const penalty = (overspend / (allowedSpend || 1)) * 50;

//   savingsScore = 100 - penalty;
//   savingsScore = Math.max(0, Math.min(100, savingsScore));
// }

//   // ---------- 2. BUDGET ADHERENCE ----------
//   let withinBudgetCount = 0;
//   let totalCategories = Object.keys(budgets).length;

//   Object.entries(budgets).forEach(([cat, budget]) => {
//     const spent = expenses
//       .filter((e) => e.category === cat)
//       .reduce((sum, e) => sum + Number(e.amount || 0), 0);

//     if (spent <= budget) withinBudgetCount++;
//   });

//   const budgetScore =
//     (withinBudgetCount / totalCategories) * 100;

//   // ---------- 3. SPENDING PACE ----------
//   const spentPercent =
//     totalSpent /
//     Object.values(budgets).reduce((a, b) => a + b, 0);

//   const expectedPercent = currentDay / totalDays;

//   let paceScore = 100 - Math.max(0, (spentPercent - expectedPercent) * 100);
//   paceScore = Math.max(0, Math.min(100, paceScore));

//   // ---------- 4. CATEGORY BALANCE ----------
//   const categoryTotals = {};

//   expenses.forEach((e) => {
//     categoryTotals[e.category] =
//       (categoryTotals[e.category] || 0) + Number(e.amount);
//   });

//   const maxCategory = Math.max(...Object.values(categoryTotals), 0);
//   const balanceRatio = maxCategory / (totalSpent || 1);

//   let balanceScore = 100 - balanceRatio * 100;
//   balanceScore = Math.max(0, balanceScore);

//   // ---------- FINAL SCORE ----------
//   const finalScore =
//     savingsScore * 0.25 +
//     budgetScore * 0.25 +
//     paceScore * 0.25 +
//     balanceScore * 0.25;

//   return {
//     score: Math.round(finalScore),
//     breakdown: {
//       savingsScore,
//       budgetScore,
//       paceScore,
//       balanceScore,
//     },
//   };
// }


export function calculateFinancialHealth({
  expenses,
  budgets,
  income = 0,
  savings = 0,
}) {
  if (!expenses?.length || !budgets || Object.keys(budgets).length === 0) {
    return null;
  }

  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();

  // ---------- TOTAL SPENT ----------
  const totalSpent = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  // ---------- 1. SAVINGS SCORE ----------
  const allowedSpend = income - savings;

  let savingsScore = 100;

  if (allowedSpend <= 0) {
    savingsScore = 0;
  } else if (totalSpent > allowedSpend) {
    const overspend = totalSpent - allowedSpend;

    // smoother + stable penalty
    const penalty = (overspend / (income || 1)) * 100;

    savingsScore = 100 - penalty;
    savingsScore = Math.max(0, Math.min(100, savingsScore));
  }

  // ---------- SAVINGS INSIGHT ----------
  let savingsInsight = "";

  if (allowedSpend <= 0) {
    savingsInsight = "Savings goal exceeds income";
  } else if (totalSpent > allowedSpend) {
    savingsInsight = `Overspent by ₹${Math.round(
      totalSpent - allowedSpend
    )}`;
  } else {
    savingsInsight = `₹${Math.round(
      allowedSpend - totalSpent
    )} left within savings goal`;
  }

  // ---------- 2. BUDGET ADHERENCE ----------
  let withinBudgetCount = 0;
  let totalCategories = Object.keys(budgets).length;

  Object.entries(budgets).forEach(([cat, budget]) => {
    const spent = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    if (spent <= budget) {
      withinBudgetCount += 1;
    } else if (spent <= budget * 1.2) {
      withinBudgetCount += 0.5; // mild overspend
    }
  });

  const budgetScore =
    (withinBudgetCount / totalCategories) * 100;

  // ---------- 3. SPENDING PACE ----------
  const totalBudget = Object.values(budgets).reduce(
    (a, b) => a + b,
    0
  );

  const spentPercent = totalSpent / (totalBudget || 1);
  const expectedPercent = currentDay / totalDays;

  let paceScore =
    100 - Math.max(0, (spentPercent - expectedPercent) * 100);

  paceScore = Math.max(0, Math.min(100, paceScore));

  // ---------- 4. CATEGORY BALANCE ----------
  const categoryTotals = {};

  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const maxCategory = Math.max(
    ...Object.values(categoryTotals),
    0
  );

  const balanceRatio = maxCategory / (totalSpent || 1);

  let balanceScore = 100 - balanceRatio * 100;
  balanceScore = Math.max(0, balanceScore);

  // ---------- FINAL SCORE ----------
  const finalScore =
    savingsScore * 0.25 +
    budgetScore * 0.25 +
    paceScore * 0.25 +
    balanceScore * 0.25;

  return {
    score: Math.round(finalScore),
    breakdown: {
      savingsScore,
      budgetScore,
      paceScore,
      balanceScore,
    },
    insights: {
      savings: savingsInsight,
    },
  };
}