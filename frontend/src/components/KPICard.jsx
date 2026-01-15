export default function KPICard({ label = "Total Spend", value = "₹0" }) {
  return (
    <div className="h-full rounded-[7px] border bg-white p-3 flex flex-col justify-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
