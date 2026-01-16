import MonthlyTrend from "../MonthlyTrend";
import CategoryDonut from "../CategoryDonut";
import WeeklyBar from "../WeeklyBar";
import KPICard from "./KPICard";
import SmartTips from "./SmartTips";
import RecentExpensesCard from "./RecentExpensesCard";
import { useState } from "react";

export default function DashboardLayout({ expenses }) {
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  return (
    <>
      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 px-6 pb-8 lg:pb-0 pt-4">
        {/* ===== Global Month / Year Selector ===== */}
        <div className="w-full flex justify-end mb-4 ">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border text-sm">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-1.5 py-0.5 bg-transparent outline-none"
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-1.5 py-0.5 bg-transparent outline-none"
            >
              {Array.from(
                new Set(expenses.map((e) => new Date(e.date).getFullYear()))
              )
                .sort((a, b) => b - a)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* ===== DASHBOARD GRID ===== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SECTION */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <div className="h-[260px]">
              <MonthlyTrend
                expenses={expenses}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>

            <div className="h-[200px]">
              <WeeklyBar expenses={expenses} />
            </div>
          </div>

          {/* RIGHT SECTION */}
          {/* <div className="col-span-1 lg:col-span-5 grid grid-cols-[minmax(230px,300px)_minmax(360px,1fr)] gap-6"> */}
          <div className="
  col-span-1 lg:col-span-5
  grid grid-cols-1
  lg:grid-cols-[minmax(230px,300px)_minmax(360px,1fr)]
  gap-6
">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-2 max-w-[235px]">
              <div className="h-[105px] w-full lg:max-w-[110px]">
                <KPICard label="Total Spend" value="₹25,100" />
              </div>
              <div className="h-[105px] w-full lg:max-w-[110px]">
                <KPICard label="Avg / Day" value="₹840" />
              </div>
              <div className="h-[105px] w-full lg:max-w-[110px]">
                <KPICard label="Vs Budget" value="87%" />
              </div>
              <div className="h-[105px] w-full lg:max-w-[110px]">
                <KPICard label="Txns" value="32" />
              </div>
            </div>

            <div className="w-full lg:h-[220px] lg:max-w-[220px]">
              <SmartTips />
            </div>

            <div className="w-full lg:h-[260px] lg:max-w-[250px]">
              <CategoryDonut
                expenses={expenses}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>

            <div className="w-full lg:h-[220px] lg:max-w-[220px]">
              <RecentExpensesCard expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


