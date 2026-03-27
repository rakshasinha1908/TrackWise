export function getSpendingPersonality(expenses, month, year) {
  if (!expenses || expenses.length === 0) return null;

  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  console.log("Selected:", month, year);
  console.log("Expenses:", expenses);
  console.log("Filtered:", filtered);

  if (filtered.length === 0) return null;

  let total = 0;
  let weekendSpend = 0;
  let startSpend = 0;
  let endSpend = 0;

  filtered.forEach((e) => {
    const d = new Date(e.date);
    const amount = Number(e.amount);
    const day = d.getDay();
    const date = d.getDate();

    total += amount;

    if (day === 5 || day === 6 || day === 0) {
      weekendSpend += amount;
    }

    if (date <= 7) {
      startSpend += amount;
    }

    if (date >= 24) {
      endSpend += amount;
    }
  });

  const weekendRatio = weekendSpend / total;
  const startRatio = startSpend / total;
  const endRatio = endSpend / total;

  if (weekendRatio >= 0.55) {
    return {
      type: "Weekend Spender",
      description:
        "You tend to spend higher amounts on weekends. Plan ahead to avoid impulsive purchases.",
    };
  }

  if (startRatio >= 0.5) {
    return {
      type: "Month Starter",
      description:
        "You spend heavily at the beginning of the month. Try pacing your expenses.",
    };
  }

  if (endRatio >= 0.5) {
    return {
      type: "Month End Splurger",
      description:
        "You save early but spend heavily at the end of the month.",
    };
  }

  return {
  type: "Balanced Spender",
  description:
    "Your spending is well distributed throughout the month. Great job!",
  };
}