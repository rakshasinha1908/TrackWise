import MonthlyTrend from "../MonthlyTrend";
import CategoryDonut from "../CategoryDonut";
import WeeklyBar from "../WeeklyBar";
import KPICard from "./KPICard";
import SmartTips from "./SmartTips";
import RecentExpensesCard from "./RecentExpensesCard";
import { useState } from "react";
import {
  getMonthlyTotals,
  aggregateCategories,
  getTopCategory,
  getCategoryPercentages,
  compareMonths,
  generateSmartTips,
} from "../utils/insights";

export default function DashboardLayout({ expenses }) {
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const { currentTotal, previousTotal } =
    getMonthlyTotals(expenses, selectedYear, selectedMonth);

  const { labels, totals } =
    aggregateCategories(expenses, selectedYear, selectedMonth);

  const top = getTopCategory(labels, totals);
  const percents = getCategoryPercentages(totals);
  const growth = compareMonths(currentTotal, previousTotal);

  console.log({ currentTotal, previousTotal, growth, top, percents });

  const foodIndex = labels.indexOf("Food");
  const foodPercent = foodIndex !== -1 ? percents[foodIndex] : 0;

  const smartTips = generateSmartTips({
    foodPercent,
    growth,
    savings: 1000, // demo for now
  });

  console.log("SMART TIPS:", smartTips);

  return (
    <>
      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 px-6 pb-8 lg:pb-0 pt-4">
        {/* ===== HEADER ROW ===== */}
        <div className="w-full flex items-center justify-between mb-6">
          {/* Greeting */}
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900">
              Hi Raksha 👋 Here are your spending insights 
            </h1>
          </div>

          {/* Selector + Toggle */}
          <div className="flex items-center gap-4">
            {/* Month / Year Selector */}
            <div
              className="
                flex items-center gap-2
                bg-gray-100
                px-3 py-1.5
                rounded-full
                text-sm
                text-gray-700
              "
            >
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                {[
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ].map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent outline-none cursor-pointer font-medium"
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

            {/* Toggle (UI only) */}
            <div className="relative w-11 h-6 bg-gray-200 rounded-full cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* ===== DASHBOARD GRID ===== */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SECTION */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <div className="h-[250px]">
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
          <div
            className="
              col-span-1 lg:col-span-5
              grid grid-cols-1
              lg:grid-cols-[minmax(260px,300px)_minmax(360px,1fr)]
              gap-4
            "
          >
            {/* KPI Cards */}
            <div className="flex flex-col gap-2 max-w-[235px]">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                KPIs
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-[105px] w-full lg:max-w-[110px]">
                  <KPICard label="Total Spend" value="₹25,100" change="12%" />
                </div>
                <div className="h-[105px] w-full lg:max-w-[110px]">
                  <KPICard label="Avg / Day" value="₹840" change="5%" />
                </div>
                <div className="h-[105px] w-full lg:max-w-[110px]">
                  <KPICard label="Vs Budget" value="87%" change="5%" />
                </div>
                <div className="h-[105px] w-full lg:max-w-[110px]">
                  <KPICard label="Txns" value="32" change="22%" />
                </div>
              </div>
            </div>

            <div className="w-full lg:h-[240px] lg:max-w-[200px]">
              <SmartTips tips={smartTips} />
            </div>

            <div className="w-full lg:h-[250px] lg:max-w-[250px]">
              <CategoryDonut
                expenses={expenses}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>

            <div className="w-full lg:h-[245px] lg:max-w-[200px]">
              <RecentExpensesCard expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}