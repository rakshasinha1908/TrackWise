export default function KPICard({ label, value, change }) {
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
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
            <span>↑</span>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
