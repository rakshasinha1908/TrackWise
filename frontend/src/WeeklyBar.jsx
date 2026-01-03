import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  filterExpensesByCurrentWeek,
  groupExpensesByWeekday,
  getCurrentWeekRangeLabel,
} from "./utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklyBar({ expenses }) {
  const { labels, totals } = groupExpensesByWeekday(expenses);
  const weeklyExpenses = filterExpensesByCurrentWeek(expenses);
  const weekLabel = getCurrentWeekRangeLabel();

  const data = {
    labels,
    datasets: [
      {
        label: "Weekly Spend",
        data: totals,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Weekly Spending Pattern",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 700 }}>
      <h3 className="text-sm text-gray-500 mb-2">{weekLabel}</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
