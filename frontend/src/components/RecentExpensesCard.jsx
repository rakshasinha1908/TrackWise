import DashboardCard from "./DashboardCard";

export default function RecentExpensesCard({ expenses }) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // last 5 expenses

  return (
    <DashboardCard title="Recent Expenses" bordered shadow>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">No expenses yet.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((e) => (
            <li
              key={e.id}
              className="flex justify-between text-sm border-b pb-1 last:border-none"
            >
              <span className="text-gray-700">
                {e.category || "Other"}
              </span>
              <span className="font-medium">₹{e.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
