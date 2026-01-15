import React, { useState, useEffect, useMemo } from "react";
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
  Filler,
} from "chart.js";
import DashboardCard from "./components/DashboardCard";
import { buildBiYearlyMonthlyTrend } from "./utils";



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthlyTrend({
  expenses,
  selectedYear,
  selectedMonth,
}) {

  const [half, setHalf] = useState("H1");
  useEffect(() => {
  setHalf(selectedMonth <= 5 ? "H1" : "H2");
}, [selectedMonth]);


  const primaryYear = selectedYear;
  const secondaryYear = selectedYear - 1;

  const createGradient = (chart) => {
    const { ctx, chartArea } = chart;

    if (!chartArea) {
      return null;
    }

    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );

    gradient.addColorStop(0, "rgba(97, 112, 243, 0.18)");
    gradient.addColorStop(0.6, "rgba(97, 112, 243, 0.08)");
    gradient.addColorStop(1, "rgba(97, 112, 243, 0)");

    return gradient;
  };

  const chartData = useMemo(() => {
    const primary = buildBiYearlyMonthlyTrend(expenses, primaryYear, half);
    const secondary = buildBiYearlyMonthlyTrend(expenses, secondaryYear, half);

    const hasSecondaryData = secondary.primaryTotals.some((v) => v > 0);

    return {
      labels: primary.labels,
      datasets: [
        {
          label: `${primaryYear}`,
          data: primary.primaryTotals,
          tension: 0.45,
          cubicInterpolationMode: "monotone",
          borderWidth: 3,
          borderCapStyle: "round",
          borderJoinStyle: "round",
          borderDash: [],
          borderColor: "#6170f3",
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            return createGradient(chart);
          },
        },
        {
          label: `${secondaryYear}`,
          data: secondary.primaryTotals,
          tension: 0.45,
          cubicInterpolationMode: "monotone",
          borderWidth: 1.5,
          borderDash: [4, 6],
          pointHoverRadius: 0,
          borderColor: "rgba(121, 132, 245, 0.45)",
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  }, [expenses, primaryYear, secondaryYear, half]);

  


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        padding: 10,
        cornerRadius: 8,
        caretSize: 0,
        displayColors: false,
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (item) => {
            return `₹${item.formattedValue}`;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          maxTicksLimit: 4,
          font: {
            size: 12,
          },
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <DashboardCard
      title="Monthly Spending"
      padding="p-4"
      className="bg-white"
    >
      <div className="relative">
  <Line data={chartData} options={options} />
</div>

    </DashboardCard>
  );
}


