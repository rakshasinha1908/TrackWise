import Card from "../ui/Card";

export default function FlaggedExpenses() {
  return (
    <Card>
          <h2 className="text-lg font-semibold mb-2">Flagged Expenses</h2>
          <p className="text-sm text-gray-500">Your financial health score will appear here.</p>
        </Card>
  );
}