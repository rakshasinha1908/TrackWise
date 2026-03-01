import React, { useState } from "react";
import DashboardCard from "./DashboardCard";

export default function SmartTips({ tips = [] }) {

  const [index, setIndex] = useState(0);

  if (!tips.length) return null;

  const tip = tips[index];

  const COLOR_MAP = {
    warning: "bg-red-50 text-red-800",
    danger: "bg-orange-50 text-orange-800",
    good: "bg-green-50 text-green-800",
    info: "bg-indigo-50 text-indigo-800",
  };

  const next = () => {
    setIndex((i) => (i + 1) % tips.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + tips.length) % tips.length);
  };

  return (
    <DashboardCard
      title="Smart Tips"
      className="bg-white border border-gray-100 shadow-sm h-full"
    >
      <div className="flex flex-col h-full justify-between">

        {/* TIP CARD */}
        <div
          className={`
            rounded-lg p-3 text-sm flex flex-col justify-between
            ${COLOR_MAP[tip.type] || "bg-gray-50 text-gray-800"}
          `}
        >
          <div className="space-y-1">
            <p className="font-medium text-gray-900 line-clamp-2">
              {tip.title}
            </p>

            <p className="text-gray-600 text-sm line-clamp-3">
              {tip.msg}
            </p>
          </div>

          {tip.action && (
            <button className="mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 rounded-md">
              {tip.action}
            </button>
          )}
        </div>

        {/* SWIPE BUTTONS */}
        <div className="flex justify-between mt-2">
          <button
            onClick={prev}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            ← Prev
          </button>

          <span className="text-xs text-gray-400">
            {index + 1} / {tips.length}
          </span>

          <button
            onClick={next}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Next →
          </button>
        </div>

      </div>
    </DashboardCard>
  );
}