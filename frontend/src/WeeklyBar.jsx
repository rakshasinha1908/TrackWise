//  import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   groupExpensesByWeekday,
//   getCurrentWeekRangeLabel,
// } from "./utils";

// import DashboardCard from "./components/DashboardCard";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function WeeklyBar({ expenses }) {
//   const label = getCurrentWeekRangeLabel();

//   const now = new Date();
//   const startOfWeek = new Date(now);
//   startOfWeek.setDate(now.getDate() - now.getDay());
//   startOfWeek.setHours(0, 0, 0, 0);

//   const endOfWeek = new Date(startOfWeek);
//   endOfWeek.setDate(startOfWeek.getDate() + 6);
//   endOfWeek.setHours(23, 59, 59, 999);

//   const weeklyExpenses = expenses.filter((expense) => {
//     const d = new Date(expense.date);
//     return d >= startOfWeek && d <= endOfWeek;
//   });

//   const { labels, totals } = groupExpensesByWeekday(weeklyExpenses);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Weekly Spend",
//         data: totals,

//         /* ===== VISUAL POLISH ===== */
//         barThickness: 28,
//         borderRadius: 6,
//         borderSkipped: false,
//         categoryPercentage: 0.6,
//         barPercentage: 0.8,

// backgroundColor: (context) => {
//   const { ctx, chartArea } = context.chart;
//   if (!chartArea) return null;

//   const gradient = ctx.createLinearGradient(
//     0,
//     chartArea.top,
//     0,
//     chartArea.bottom
//   );

//   // Top: strong
//   gradient.addColorStop(0, "rgba(99, 102, 241, 1)");

//   // Middle: soft fade
//   gradient.addColorStop(0.6, "rgba(99, 102, 241, 0.7)");

//   // Bottom: still visible (not washed out)
//   gradient.addColorStop(1, "rgba(99, 102, 241, 0.45)");

//   return gradient;
// }


//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: "rgba(17, 24, 39, 0.95)",
//         titleColor: "#F9FAFB",
//         bodyColor: "#F9FAFB",
//         padding: 10,
//         cornerRadius: 8,
//         displayColors: false,
//         callbacks: {
//           label: (item) => `₹${item.formattedValue}`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//           drawBorder: false,
//         },
//         ticks: {
//           color: "#9CA3AF",
//           font: { size: 12 },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: "rgba(0,0,0,0.04)",
//           drawBorder: false,
//         },
//         ticks: {
//           color: "#9CA3AF",
//           font: { size: 12 },
//           callback: (v) => `₹${v}`,
//         },
//       },
//     },
//   };

//   return (
//     <DashboardCard
//       title="Weekly Spending"
//       padding="px-4"
//     >
//       <p className="text-xs text-gray-500 mb-2">{label}</p>

//       <div className="h-full">
//         <Bar data={data} options={options} />
//       </div>
//     </DashboardCard>
//   );
// }




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
  getCurrentWeekRangeLabel,
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
  const label = getCurrentWeekRangeLabel();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

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

        /* ===== VISUAL POLISH ===== */
        barThickness: 28,
        borderRadius: 5,
        borderSkipped: false,
        categoryPercentage: 0.6,
        barPercentage: 0.8,

        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          // Top: strong
          gradient.addColorStop(0, "rgba(99, 102, 241, 1)");

          // Middle: soft fade
          gradient.addColorStop(0.7, "rgba(139, 92, 246, 1)");

          // Bottom: still visible (not washed out)
          gradient.addColorStop(1, "rgba(91, 33, 182, 0.6)");

          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (item) => `₹${item.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.04)",
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: { size: 12 },
          callback: (v) => `₹${v}`,
        },
      },
    },
  };

  return (
    <DashboardCard title="Weekly Spending" padding="px-4">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="h-full">
        <Bar data={data} options={options} />
      </div>
    </DashboardCard>
  );
}