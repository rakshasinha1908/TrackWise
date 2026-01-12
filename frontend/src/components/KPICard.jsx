// import React from "react";
// import DashboardCard from "./DashboardCard";

// export default function KPICard({ expenses = [] }) {
//   const totalSpend = expenses.reduce(
//     (sum, e) => sum + Number(e.amount || 0),
//     0
//   );

//   return (
//     <DashboardCard title="Overview" padding="p-2" bordered>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <p className="text-[11px] text-gray-500">Total Spend</p>
//           <p className="text-xs font-semibold leading-tight">
//             ₹{totalSpend.toFixed(0)}
//           </p>
//         </div>
//       </div>
//     </DashboardCard>
//   );
// }


export default function KPICard({ label = "Total Spend", value = "₹0" }) {
  return (
    <div className="h-full rounded-xl border bg-white p-3 flex flex-col justify-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
