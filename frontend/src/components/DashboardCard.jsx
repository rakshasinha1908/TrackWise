export default function DashboardCard({
  title,
  actions,
  children,

  bordered = false,
  shadow = false,
  padding = "p-3",

  className = "",
}) {
  return (
    <div
      className={`
        w-full h-full bg-white rounded-xl flex flex-col
        ${bordered ? "border" : ""}
        ${shadow ? "shadow-sm" : ""}
        ${padding}
        ${className}
      `}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-3 shrink-0">
          {title && (
            <h2 className="text-sm font-semibold text-gray-800">
              {title}
            </h2>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
