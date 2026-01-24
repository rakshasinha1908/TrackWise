import React from "react";
import DashboardCard from "./DashboardCard";

export default function SmartTips() {
  return (
    <DashboardCard title="Smart Tips" className="bg-white border border-gray-100 shadow-sm">
      <div className="bg-[rgba(237,233,254,1)] rounded-lg p-3 text-sm text-gray-800 space-y-2">
        <p className="font-medium text-gray-900">
          Consider setting a food budget.
        </p>

        <p className="text-gray-600">
          You're spending{" "}
          <span className="font-semibold text-gray-900">
            ₹10,600
          </span>{" "}
          per month on food.
        </p>

        <button
          className="
            mt-2 w-full
            bg-[rgba(139,92,246,1)]
            hover:bg-[rgba(109,63,212,1)]
            text-white text-sm font-medium
            py-2 rounded-md
            transition
          "
        >
          Set Food Budget
        </button>
      </div>
    </DashboardCard>
  );
}
