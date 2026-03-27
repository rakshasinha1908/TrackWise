import PremiumBanner from "./PremiumBanner";

export default function InsightsHeader({
  isScrolled,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  expenses,
}) {
  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">

        {/* Top Row */}
        <div className="flex items-center justify-between">

          <h1 className="text-xl md:text-2xl font-semibold">
            Hi Raksha 👋 Insights Overview
          </h1>

          {/* Month / Year Selector */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent outline-none cursor-pointer font-medium"
            >
              {[
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec",
              ].map((m, i) => (
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
      new Set(
        (expenses || []).map((e) =>
          new Date(e.date).getFullYear()
        )
      )
    );

    const finalYears =
      years.length > 0
        ? years.sort((a, b) => b - a)
        : [new Date().getFullYear()]; // fallback

    return finalYears.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  })()}
</select>
          </div>
        </div>

        {/* Banner */}
        <PremiumBanner isScrolled={isScrolled} />

      </div>
    </div>
  );
}


