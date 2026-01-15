import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { aggregateByCategory } from "./utils";
import DashboardCard from "./components/DashboardCard";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDonut({
  expenses,
  selectedYear,
  selectedMonth,
}) {
  const filteredExpenses = expenses.filter((expense) => {
    const d = new Date(expense.date);
    return (
      d.getFullYear() === selectedYear &&
      d.getMonth() === selectedMonth
    );
  });

  const { labels, totals } = aggregateByCategory(filteredExpenses);

  const hasData = labels.length > 0;

  const data = {
    labels: hasData ? labels : ["No data"],
    datasets: [
      {
        data: hasData ? totals : [1],
        backgroundColor: hasData
          ? [
              "#6170f3",
              "#7984f5",
              "#9aa3f7",
              "#bcc2fb",
              "#dee1fe",
            ]
          : ["#E5E7EB"], // gray-200
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: hasData,
        position: "bottom",
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: () => (hasData ? undefined : "No data for selected month"),
        },
      },
    },
    cutout: "70%",
  };

  return (
    <DashboardCard title="Category Breakdown">
      <div className="h-[180px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </DashboardCard>
  );
}
