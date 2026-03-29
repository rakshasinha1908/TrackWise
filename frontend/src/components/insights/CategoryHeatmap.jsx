import Card from "../ui/Card";

export default function CategoryHeatmap({ expenses, budgets, selectedMonth, selectedYear }) {
  const formatCurrency = (num) => Number(num || 0).toLocaleString("en-IN");

  const getCategorySpend = () => {
    if (!expenses || expenses.length === 0) return {};
    const totals = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
        const cat = e.category || "Others";
        totals[cat] = (totals[cat] || 0) + Number(e.amount);
      }
    });
    return totals;
  };

  const categorySpend = getCategorySpend();

  const getHeatmapColor = (percent) => {
    const today = new Date().getDate();
    if (percent > 100) return "bg-red-600";
    if (percent >= 75 && today < 20) return "bg-red-500";
    if (percent >= 75) return "bg-red-400";
    if (percent >= 60) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStatusLabel = (percent) => {
    if (percent > 100) return "Over";
    if (percent >= 75) return "High";
    if (percent >= 60) return "Watch";
    return "Safe";
  };

  const safeBudgets = budgets || {};

  return (
    <Card>
      {/* Header */}
      <div className="flex justify-between items-center mb-2 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">Category Heatmap</h2>
        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">Budget % Spent</span>
      </div>

      {Object.keys(safeBudgets).length === 0 ? (
        <p className="text-sm text-gray-500">No budget data available.</p>
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
              <div key={cat} className="px-3 sm:px-6 md:px-8 py-1.5 sm:py-2">

                {/* Top Row */}
                <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`truncate ${isOver ? "text-red-700 font-semibold" : "text-gray-700"}`}>
                      {cat}
                    </span>
                    {isOver && <span className="text-red-700 flex-shrink-0">⚠️</span>}
                  </div>
                  {/* On very small screens show condensed amounts */}
                  <span className="text-gray-500 flex-shrink-0 text-right">
                    <span className="hidden sm:inline">
                      ₹{formatCurrency(spent)} / ₹{formatCurrency(budget)}
                    </span>
                    <span className="sm:hidden">
                      ₹{formatCurrency(spent)}
                    </span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full ${color} rounded-full transition-all ${isOver ? "shadow-md shadow-red-300" : ""}`}
                    style={{ width: `${cappedWidth}%` }}
                  />
                  {percentValue >= 60 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-semibold text-white leading-none">
                      {label}
                    </span>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  <span>
                    {percentValue > 100 ? `${percentValue}% (Over)` : `${percentValue}% used`}
                  </span>
                  {/* Show budget on mobile since we hid the top amount */}
                  <span className="sm:hidden text-gray-400">of ₹{formatCurrency(budget)}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}