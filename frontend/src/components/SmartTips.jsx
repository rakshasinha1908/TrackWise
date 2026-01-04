import React from "react";
import DashboardCard from "./DashboardCard";

export default function SmartTips() {
  return (
    <DashboardCard title="Smart Tips">
      <ul className="text-sm text-gray-600 space-y-2">
        <li>• You tend to spend more on weekends</li>
        <li>• Food is your top spending category</li>
        <li>• Track smaller expenses to save more</li>
      </ul>
    </DashboardCard>
  );
}
