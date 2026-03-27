import Card from "../ui/Card";
import { getSpendingPersonality } from "../../utils/spendingPersonality";
import shoppingImg from "../../assets/shopping.png";
import foodImg from "../../assets/food.png";
import transportImg from "../../assets/transport.png";
import billsImg from "../../assets/bills.png";
import walletImg from "../../assets/wallet.png";

export default function SpendingPersonality({
  expenses,
  selectedMonth,
  selectedYear,
}) {
  const personalityData = getSpendingPersonality(
    expenses,
    selectedMonth,
    selectedYear
  );
  const categoryIllustrations = {
  Shopping: shoppingImg,
  Food: foodImg,
  Transport: transportImg,
  Bills: billsImg,
  Other: walletImg,
};

  const getHighestSpendingDay = () => {
  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === selectedMonth &&
      d.getFullYear() === selectedYear
    );
  });

  const dailyTotals = {};

  filtered.forEach((e) => {
    const date = new Date(e.date).toDateString();
    dailyTotals[date] = (dailyTotals[date] || 0) + Number(e.amount);
  });

  let maxDay = null;
  let maxAmount = 0;

  for (let day in dailyTotals) {
    if (dailyTotals[day] > maxAmount) {
      maxAmount = dailyTotals[day];
      maxDay = day;
    }
  }

  return maxDay;
};

const highestDay = getHighestSpendingDay();

const getTopCategoryLastMonths = () => {
  const categoryTotals = {};

  expenses.forEach((e) => {
    const d = new Date(e.date);

    // last 2 months logic
    const diffMonths =
      (selectedYear - d.getFullYear()) * 12 +
      (selectedMonth - d.getMonth());

    if (diffMonths >= 0 && diffMonths < 2) {
      const cat = e.category || "Other";
      categoryTotals[cat] =
        (categoryTotals[cat] || 0) + Number(e.amount);
    }
  });

  let topCategory = null;
  let max = 0;

  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > max) {
      max = categoryTotals[cat];
      topCategory = cat;
    }
  }

  return topCategory;
};
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const topCategory = getTopCategoryLastMonths();

const illustration =
  categoryIllustrations[topCategory] ||
  categoryIllustrations["Other"];

  if (!personalityData) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Spending Personality</h2>
        <p className="text-sm text-gray-500 mt-2">
          No data available for this month.
        </p>
      </Card>
    );
  }

  return (
  <Card>
    <h2 className="text-2xl font-semibold mb-1">
      Spending Personality
    </h2>

    <p className="text-sm text-gray-500 mb-3">
      See how your spending aligns with your habits.
    </p>

    {/* Main Box */}
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 rounded-xl p-6 flex justify-between items-start shadow-sm gap-4">
  
  {/* LEFT CONTENT */}
  <div className="max-w-[60%]">
    <h3 className="text-xl font-semibold text-black mb-5 ml-2">
      {personalityData.type}
    </h3>

    <p className="text-lg text-black mt-1 ml-2 font-light">
      {personalityData.description}
    </p>
  </div>

  {/* RIGHT ILLUSTRATION */}
  <img
    src={illustration}
    alt="category illustration"
      className="w-40 h-38 object-contain opacity-95 -mr-2"
  />
</div>

    {/* Insights */}
    <div className="mt-4 space-y-2 text-md text-gray-600">
      {highestDay && (
        <p>• {formatDate(highestDay)} was your highest spending day for this month</p>
      )}

      {topCategory && (
        <p>
          • {topCategory} has been your top category recently
        </p>
      )}
    </div>
  </Card>
);
}