// src/MonthlyTrend.jsx
import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MonthlyTrend({ expenses }) {
  const { labels, totals } = groupExpensesByMonth(expenses);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Spend",
        data: totals,
        fill: false,
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
      <Line data={data} options={options} />
    </div>
  );
}




