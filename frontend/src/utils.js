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
