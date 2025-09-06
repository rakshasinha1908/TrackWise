// src/CategoryDonut.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { aggregateByCategory } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonut({ expenses }) {
  const { labels, totals } = aggregateByCategory(expenses);

  const data = {
    labels,
    datasets: [
      {
        data: totals,
        // colors are decided by the chart automatically; we won't force colors now
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Spending by Category" },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 400, marginBottom: 20 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}





