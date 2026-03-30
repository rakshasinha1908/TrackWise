import { useState } from "react";
import PremiumBanner from "./PremiumBanner";
import { generateReport } from "../../utils/generateReport";

export default function InsightsHeader({
  isScrolled,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  expenses,
  budgets,
  budgetFull,
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 60));
    try {
      generateReport({ expenses, budgets, budgetFull, selectedMonth, selectedYear });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className={`sticky top-0 z-50 bg-gray-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-sm" : "py-4 sm:py-6"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        {/* Top Row */}
        <div className="flex items-center justify-between gap-2 min-w-0">

          {/* Title */}
          <h1
            className={`font-semibold truncate min-w-0 flex-1 transition-all duration-300 ${
              isScrolled
                ? "text-base sm:text-lg"
                : "text-base sm:text-xl md:text-2xl"
            }`}
          >
            {/* Short version on very small screens */}
            <span className="sm:hidden">Insights Overview</span>
            <span className="hidden sm:inline">Insights Overview</span>
          </h1>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* Download Report button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
            >
              {downloading ? (
                <>
                  <svg
                    className="animate-spin w-3.5 h-3.5 text-indigo-500 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="hidden sm:inline">Generating…</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span className="hidden sm:inline">Download Report</span>
                </>
              )}
            </button>

            {/* Month / Year Selector */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-700">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent outline-none cursor-pointer font-medium max-w-[3rem] sm:max-w-none"
              >
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                {(() => {
                  const years = Array.from(
                    new Set((expenses || []).map((e) => new Date(e.date).getFullYear()))
                  );
                  const finalYears = years.length > 0 ? years.sort((a, b) => b - a) : [new Date().getFullYear()];
                  return finalYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ));
                })()}
              </select>
            </div>

          </div>
        </div>

        {/* Banner */}
        <PremiumBanner isScrolled={isScrolled} />

      </div>
    </div>
  );
}