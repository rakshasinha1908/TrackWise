import Card from "../ui/Card";

export default function CategoryHeatmap({
  expenses,
  budgets,
  selectedMonth,
  selectedYear,
}) {
  /* ---------------- CATEGORY SPEND ---------------- */
  const formatCurrency = (num) =>
    Number(num || 0).toLocaleString("en-IN");

  const getCategorySpend = () => {
    if (!expenses || expenses.length === 0) return {};

    const totals = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);

      if (
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      ) {
        const cat = e.category || "Others";
        totals[cat] = (totals[cat] || 0) + Number(e.amount);
      }
    });

    return totals;
  };

  const categorySpend = getCategorySpend();

  /* ---------------- COLOR LOGIC ---------------- */
  const getHeatmapColor = (percent) => {
    const today = new Date().getDate();

    if (percent > 100) return "bg-red-600"; // over budget
    if (percent >= 75 && today < 20) return "bg-red-500"; // early warning
    if (percent >= 75) return "bg-red-400";
    if (percent >= 60) return "bg-yellow-400";

    return "bg-green-500";
  };

  /* ---------------- LABEL LOGIC ---------------- */
  const getStatusLabel = (percent) => {
    if (percent > 100) return "Over";
    if (percent >= 75) return "High";
    if (percent >= 60) return "Watch";
    return "Safe";
  };

  /* ---------------- SAFE BUDGET ---------------- */
  const safeBudgets = budgets || {};

  return (
    <Card>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">Category Heatmap</h2>
        <span className="text-sm text-gray-500">Budget % Spent</span>
      </div>

      {/* Empty state */}
      {Object.keys(safeBudgets).length === 0 ? (
        <p className="text-sm text-gray-500">
          No budget data available.
        </p>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
          {Object.keys(safeBudgets).map((cat) => {
            const budget = safeBudgets[cat] || 0;
            const spent = categorySpend[cat] || 0;

            const percent = budget > 0 ? (spent / budget) * 100 : 0;
            const percentValue = Math.round(percent);
            const isOver = percentValue > 100;
            const cappedWidth = Math.min(percentValue, 100);

            const color = getHeatmapColor(percentValue);
            const label = getStatusLabel(percentValue);

            return (
              <div key={cat} className="px-5 py-1.5">
                {/* Top Row */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        isOver
                          ? "text-red-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {cat}
                    </span>
                    {isOver && (
                      <span className="text-red-700 text-sm">⚠️</span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    ₹{formatCurrency(spent)} / ₹{formatCurrency(budget)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all ${
                      isOver ? "shadow-md shadow-red-300" : ""
                    }`}
                    style={{ width: `${cappedWidth}%` }}
                  />
                  {/* Status label inside bar (optional UX boost) */}
                  {percentValue >= 60 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white">
                      {label}
                    </span>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {percentValue > 100
                      ? `${percentValue}% (Over)`
                      : `${percentValue}% used`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}