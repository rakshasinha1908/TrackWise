import React from "react";

export default function DashboardCard({
  title,
  actions,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border p-4 sm:p-6 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {title}
            </h2>
          )}

          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
