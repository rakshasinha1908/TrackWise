export default function KPICard({ label, value, change, rawChange }) {
  const numericChange = Number(rawChange ?? 0);

  // decide if decrease is good or bad depending on KPI
  const lowerIsBetter =
    label === "Total Spend" ||
    label === "Avg / Day" ||
    label === "Txns";
  const isGood = lowerIsBetter ? numericChange < 0 : numericChange >= 0;
  return (
    <div
      className="
        h-full w-full
        rounded-xl
        bg-white
        border border-gray-100
        shadow-sm
        px-3 py-2.5
        flex flex-col justify-between
      "
    >
      <p className="text-xs text-gray-500 font-medium">
        {label}
      </p>

      <div>
        <p className="text-lg font-semibold text-gray-900 leading-tight">
          {value}
        </p>

        {change && (
          <p className={`text-sm font-semibold ${isGood ? "text-green-600" : "text-red-600"}`}>
            {numericChange < 0 ? "↓" : "↑"} {Math.abs(numericChange)}%
          </p>
        )}
      </div>
    </div>
  );
}
