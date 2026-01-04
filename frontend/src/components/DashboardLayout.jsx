import MonthlyTrend from "../MonthlyTrend";
import CategoryDonut from "../CategoryDonut";
import WeeklyBar from "../WeeklyBar";
import KPICard from "./KPICard";
import SmartTips from "./SmartTips";
import RecentExpensesCard from "./RecentExpensesCard";

export default function DashboardLayout({ expenses }) {
  return (
    <div
      className="
        w-full
        grid
        gap-6
        grid-cols-1
        lg:grid-cols-12
      "
    >
      {/* LEFT SECTION */}
      <div
        className="
          col-span-1
          lg:col-span-8
          flex
          flex-col
          gap-6
        "
      >
        <MonthlyTrend expenses={expenses} />
        <WeeklyBar expenses={expenses} />
      </div>

      {/* RIGHT SECTION */}
      <div
        className="
          col-span-1
          lg:col-span-4
          flex
          flex-col
          gap-6
        "
      >
        {/* KPI CARDS */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            gap-4
          "
        >
          <KPICard />
          <KPICard />
          <KPICard />
          <KPICard />
        </div>

        <SmartTips />

        <CategoryDonut expenses={expenses} />

        <RecentExpensesCard expenses={expenses} />
      </div>
    </div>
  );
}

