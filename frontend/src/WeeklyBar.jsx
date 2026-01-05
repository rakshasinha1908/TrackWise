import React, { useState } from "react";
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
  groupExpensesByWeekday,
  getWeekRangeFromDate,
} from "./utils";
import DashboardCard from "./components/DashboardCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklyBar({ expenses }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const { startOfWeek, endOfWeek, label } =
    getWeekRangeFromDate(selectedDate);

  const weeklyExpenses = expenses.filter((expense) => {
    const d = new Date(expense.date);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const { labels, totals } = groupExpensesByWeekday(weeklyExpenses);

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
      title="Weekly Spending"
      padding="p-2"
      actions={
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
      }
    >
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <Bar data={data} options={options} />
    </DashboardCard>
  );
}
