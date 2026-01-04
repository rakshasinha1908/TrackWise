// // src/CategoryDonut.jsx
// import React, { useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { aggregateByCategory } from "./utils";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function CategoryDonut({ expenses }) {

//   console.log(
//     "CategoryDonut years:",
//     expenses.map(e => new Date(e.date).getFullYear())
//   );
  
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth();

//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);

//   const filteredExpenses = expenses.filter((expense) => {
//     const d = new Date(expense.date);
//     return (
//       d.getFullYear() === selectedYear &&
//       d.getMonth() === selectedMonth
//     );
//   });

//   const { labels, totals } = aggregateByCategory(filteredExpenses);

//   const data = {
//     labels,
//     datasets: [{ data: totals }],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "bottom" },
//       title: { display: true, text: "Spending by Category" },
//     },
//   };

//   const months = [
//     "Jan","Feb","Mar","Apr","May","Jun",
//     "Jul","Aug","Sep","Oct","Nov","Dec",
//   ];

//   const years = [...new Set(
//     expenses.map(e => new Date(e.date).getFullYear())
//   )].sort();

//   return (
//     <div style={{ width: "100%", maxWidth: 400, marginBottom: 20 }}>
//       {/* Year selector */}
//       <select
//         value={selectedYear}
//         onChange={(e) => setSelectedYear(Number(e.target.value))}
//       >
//         {years.map((y) => (
//           <option key={y} value={y}>{y}</option>
//         ))}
//       </select>

//       {/* Month selector */}
//       <select
//         value={selectedMonth}
//         onChange={(e) => setSelectedMonth(Number(e.target.value))}
//       >
//         {months.map((m, idx) => (
//           <option key={idx} value={idx}>{m}</option>
//         ))}
//       </select>

//       <Doughnut data={data} options={options} />
//     </div>
//   );
// }


import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { aggregateByCategory } from "./utils";
import DashboardCard from "./components/DashboardCard";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonut({ expenses }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // available years from data
  const years = Array.from(
    new Set(expenses.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState(
    years[0] || currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const filteredExpenses = expenses.filter((expense) => {
    const d = new Date(expense.date);
    return (
      d.getFullYear() === selectedYear &&
      d.getMonth() === selectedMonth
    );
  });

  const { labels, totals } = aggregateByCategory(filteredExpenses);

  const data = {
    labels,
    datasets: [
      {
        data: totals,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <DashboardCard
      title="Category Breakdown"
      actions={
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border px-2 py-1 text-sm rounded"
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-1 text-sm rounded"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {labels.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          No data for selected period
        </p>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </DashboardCard>
  );
}
