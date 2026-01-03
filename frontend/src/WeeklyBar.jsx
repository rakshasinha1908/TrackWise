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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-500">{label}</h3>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
