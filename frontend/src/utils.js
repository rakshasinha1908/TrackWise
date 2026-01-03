// src/utils.js
export function groupExpensesByMonth(expenses) {
  // returns { labels: ['08/2025', ...], totals: [1200, ...] } sorted by month
  const map = {};
  expenses.forEach((e) => {
    const date = e.date ? new Date(e.date) : new Date();
    if (isNaN(date)) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    const amt = Number(e.amount) || 0;
    map[key] = (map[key] || 0) + amt;
  });

  const keys = Object.keys(map).sort(); // sorted YYYY-MM
  const labels = keys.map((k) => {
    const [y, m] = k.split("-");
    return `${m}/${y}`; // MM/YYYY
  });
  const totals = keys.map((k) => map[k]);
  return { labels, totals };
}

export function aggregateByCategory(expenses) {
  // returns { labels: ['Food','Transport'], totals: [1200, 300] }
  const map = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    const amt = Number(e.amount) || 0;
    map[cat] = (map[cat] || 0) + amt;
  });
  const labels = Object.keys(map);
  const totals = labels.map((l) => map[l]);
  return { labels, totals };
}

export function groupExpensesByWeekday(expenses) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalsMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  expenses.forEach((e) => {
    const dayIndex = new Date(e.date).getDay(); // 0–6
    const day = days[dayIndex];
    totalsMap[day] += Number(e.amount);
  });

  return {
    labels: days,
    totals: days.map((d) => totalsMap[d]),
  };
}


export function filterExpensesByCurrentMonth(expenses) {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0–11
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
}


export function filterExpensesByCurrentWeek(expenses) {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
  });
}

export function getCurrentWeekRangeLabel() {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const format = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  return `This week: ${format(startOfWeek)} – ${format(endOfWeek)}`;
}

export function filterExpensesByYear(expenses, year) {
  return expenses.filter((expense) => {
    const expenseYear = new Date(expense.date).getFullYear();
    return expenseYear === year;
  });
}

export function getWeekRangeFromDate(dateInput) {
  const date = new Date(dateInput);

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const format = (d) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  return {
    startOfWeek,
    endOfWeek,
    label: `This week: ${format(startOfWeek)} – ${format(endOfWeek)}`,
  };
}
