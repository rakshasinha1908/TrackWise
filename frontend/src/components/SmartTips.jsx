import React from "react";
import DashboardCard from "./DashboardCard";

export default function SmartTips() {
  return (
    <DashboardCard title="Smart Tips" bordered className="bg-gray-50">
      <ul className="text-sm text-gray-600 space-y-2">
        <li>• You tend to spend more on weekendsss</li>
        <li>• Food is your top spending category</li>
      </ul>
    </DashboardCard>
  );
}
