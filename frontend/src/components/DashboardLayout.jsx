import MonthlyTrend from "../MonthlyTrend";
import CategoryDonut from "../CategoryDonut";
import WeeklyBar from "../WeeklyBar";
import KPICard from "./KPICard";
import SmartTips from "./SmartTips";
import RecentExpensesCard from "./RecentExpensesCard";

export default function DashboardLayout({ expenses }) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* ================= LEFT SECTION ================= */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">

        {/* Monthly Trend (hero chart) */}
        <div className="h-[260px]">
          <MonthlyTrend expenses={expenses} />
        </div>

        {/* Weekly Bar */}
        <div className="h-[200px]">
          <WeeklyBar expenses={expenses} />
        </div>

      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="grid grid-cols-[2.4fr_1fr] gap-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="h-[105px] min-w-[90px]">
            <KPICard />
          </div> 
          <div className="h-[105px] min-w-[90px]">
            <KPICard />
          </div>
          <div className="h-[105px] min-w-[90px]">
            <KPICard />
          </div>
          <div className="h-[105px] min-w-[90px]">
            <KPICard />
          </div>
        </div>


        {/* Smart Tips */}
        <div className="h-[220px] min-w-[200px]">
          <SmartTips />
        </div>

        {/* Category Donut */}
        <div className="h-[260px]">
          <CategoryDonut expenses={expenses} />
        </div> 

        {/* Recent Expenses */}
        <div className="h-[260px]">
          <RecentExpensesCard expenses={expenses} />
        </div>

      </div>
    </div>
  );
}


