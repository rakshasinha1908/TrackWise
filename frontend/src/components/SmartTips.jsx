import React from "react";
import DashboardCard from "./DashboardCard";

export default function SmartTips({ tips = [] }) {
  if (!tips.length) return null;

  const primary = tips[0];

  const COLOR_MAP = {
    warning: "bg-red-50 text-red-800",
    danger: "bg-orange-50 text-orange-800",
    good: "bg-green-50 text-green-800",
    info: "bg-indigo-50 text-indigo-800",
  };

  return (
    <DashboardCard
      title="Smart Tips"
      className="bg-white border border-gray-100 shadow-sm h-full"
    >
      <div
        className={`
          rounded-lg p-3 text-sm
          flex flex-col justify-between
          h-full
          ${COLOR_MAP[primary.type] || "bg-gray-50 text-gray-800"}
        `}
      >
        {/* Text */}
        <div className="space-y-1 overflow-hidden">
          <p className="font-medium text-gray-900 line-clamp-2">
            {primary.title}
          </p>

          <p className="text-gray-600 text-sm line-clamp-3">
            {primary.message}
          </p>
        </div>

        {/* Action */}
        {primary.action && (
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
            {primary.action}
          </button>
        )}
      </div>
    </DashboardCard>
  );
}
