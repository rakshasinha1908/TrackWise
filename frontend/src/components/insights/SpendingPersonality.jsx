import Card from "../ui/Card";
import { getSpendingPersonality } from "../../utils/spendingPersonality";
import shoppingImg from "../../assets/shopping.png";
import foodImg from "../../assets/food.png";
import transportImg from "../../assets/transport.png";
import billsImg from "../../assets/bills.png";
import walletImg from "../../assets/wallet.png";

export default function SpendingPersonality({ expenses, selectedMonth, selectedYear }) {
  const personalityData = getSpendingPersonality(expenses, selectedMonth, selectedYear);

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
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const dailyTotals = {};
    filtered.forEach((e) => {
      const date = new Date(e.date).toDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + Number(e.amount);
    });

    let maxDay = null, maxAmount = 0;
    for (let day in dailyTotals) {
      if (dailyTotals[day] > maxAmount) {
        maxAmount = dailyTotals[day];
        maxDay = day;
      }
    }
    return maxDay;
  };

  const getTopCategoryLastMonths = () => {
    const categoryTotals = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const diffMonths = (selectedYear - d.getFullYear()) * 12 + (selectedMonth - d.getMonth());
      if (diffMonths >= 0 && diffMonths < 2) {
        const cat = e.category || "Other";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount);
      }
    });

    let topCategory = null, max = 0;
    for (let cat in categoryTotals) {
      if (categoryTotals[cat] > max) {
        max = categoryTotals[cat];
        topCategory = cat;
      }
    }
    return topCategory;
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const highestDay = getHighestSpendingDay();
  const topCategory = getTopCategoryLastMonths();
  const illustration = categoryIllustrations[topCategory] || categoryIllustrations["Other"];

  if (!personalityData) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Spending Personality</h2>
        <p className="text-sm text-gray-500 mt-2">No data available for this month.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-semibold mb-1">Spending Personality</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-3">
        See how your spending aligns with your habits.
      </p>

      {/* Main Box */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 rounded-xl p-4 sm:p-6 flex items-start justify-between gap-3 sm:gap-4 shadow-sm">

        {/* Left content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-semibold text-black mb-2 sm:mb-5">
            {personalityData.type}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-black font-light leading-snug">
            {personalityData.description}
          </p>
        </div>

        {/* Right illustration — shrinks on small screens */}
        <img
          src={illustration}
          alt="category illustration"
          className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain opacity-95 flex-shrink-0"
        />
      </div>

      {/* Insights */}
      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
        {highestDay && (
          <p>• {formatDate(highestDay)} was your highest spending day this month</p>
        )}
        {topCategory && (
          <p>• {topCategory} has been your top category recently</p>
        )}
      </div>
    </Card>
  );
}