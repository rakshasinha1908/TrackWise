import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { aggregateByCategory } from "./utils";
import DashboardCard from "./components/DashboardCard";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = [
  "#4f74f6", // Food
  "#f7b441", // Shopping
  "#22a378", // Bills
  "#fd615a",
  "#7c8cff",
  "#4fd1c5",
];

export default function CategoryDonut({ expenses, selectedYear, selectedMonth }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const filteredExpenses = expenses.filter((expense) => {
    const d = new Date(expense.date);
    return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
  });

  const { labels, totals } = aggregateByCategory(filteredExpenses);
  const hasData = labels.length > 0;

  const totalSpent = hasData
    ? totals.reduce((a, b) => a + b, 0)
    : 0;

  const activeValue =
    activeIndex !== null ? totals[activeIndex] : totalSpent;

  const activeLabel =
    activeIndex !== null ? labels[activeIndex] : "This month";

  const activePercent =
    activeIndex !== null && totalSpent > 0
      ? Math.round((activeValue / totalSpent) * 100)
      : null;

  const data = {
    labels: hasData ? labels : ["No data"],
    datasets: [
      {
        data: hasData ? totals : [1],
        backgroundColor: hasData
          ? labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length])
          : ["#E5E7EB"],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 8,  
    },
    onHover: (_, elements) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      } else {
        setActiveIndex(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        callbacks: {
          label: (ctx) =>
            hasData ? `₹${ctx.formattedValue}` : "No data for selected month",
        },
      },
    },
    cutout: "60%",
  };

  return (
    <DashboardCard title="Category Breakdown">
      <div className="h-[180px] flex items-center gap-3">

        {/* Donut */}
        <div className="relative w-[150px] h-[150px] flex items-center justify-center">
          <Doughnut data={data} options={options} />

          {hasData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {activeIndex !== null ? (
                <>
                  <p className="text-xl font-semibold text-gray-900">
                    {activePercent}%
                  </p>
                  <p className="text-sm text-gray-700">
                    ₹{activeValue.toLocaleString()}
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    {activeLabel}
                  </p> */}
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    This month
                  </p> */}
                </>
              )}
            </div>
          )}
        </div>

        {/* Legend (right side like prototype) */}
        {hasData && (
          <div className="flex flex-col gap-1.5 text-sm">
            {labels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  }}
                />
                <span className="text-gray-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
