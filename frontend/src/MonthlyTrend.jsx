// src/MonthlyTrend.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { groupExpensesByMonth } from "./utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyTrend({ expenses }) {
  // derive available years from expenses
  const years = Array.from(
    new Set(
      expenses.map((e) => new Date(e.date).getFullYear())
    )
  ).sort((a, b) => b - a); // latest year first

  // selected year state
  const [selectedYear, setSelectedYear] = useState(
    years[0] || new Date().getFullYear()
  );

  // filter expenses by selected year
  const yearlyExpenses = expenses.filter(
    (e) => new Date(e.date).getFullYear() === selectedYear
  );

  // group ONLY filtered data
  const { labels, totals } = groupExpensesByMonth(yearlyExpenses);

  const data = {
    labels,
    datasets: [
      {
        label: `Monthly Spend (${selectedYear})`,
        data: totals,
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Spending" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 900, marginBottom: 20 }}>
      {/* Year selector */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="mb-4 px-3 py-1 border rounded"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <Line data={data} options={options} />
    </div>
  );
}
