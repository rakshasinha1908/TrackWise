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
import DashboardCard from "./components/DashboardCard";

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
    new Set(expenses.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState(
    years[0] || new Date().getFullYear()
  );

  const yearlyExpenses = expenses.filter(
    (e) => new Date(e.date).getFullYear() === selectedYear
  );

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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <DashboardCard
      title="Monthly Spending"
      actions={
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1 text-sm border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      }
    >
      <Line data={data} options={options} />
    </DashboardCard>
  );
}
