import React from "react";
import DashboardCard from "./DashboardCard";

export default function KPICard({ expenses = [] }) {
  const totalSpend = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <DashboardCard title="Overview">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Total Spend</p>
          <p className="text-xl font-semibold">
            ₹{totalSpend.toFixed(0)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Expenses Logged</p>
          <p className="text-xl font-semibold">
            {expenses.length}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
