import { useState, useEffect } from "react";
import InsightsHeader from "../components/insights/InsightsHeader";
import SpendingPersonality from "../components/insights/SpendingPersonality";
import CategoryHeatmap from "../components/insights/CategoryHeatmap";
import BudgetOverrun from "../components/insights/BudgetOverrun";
import FinancialHealthScore from "../components/insights/FinancialHealthScore";
import TrendAcceleration from "../components/insights/TrendAcceleration";
import SpendingHighlights from "../components/insights/SpendingHighlights";
import FlaggedExpenses from "../components/insights/FlaggedExpenses";
import api from "../api";

export default function InsightsPage({ expenses }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [budgets, setBudgets] = useState(null);
  const [budgetFull, setBudgetFull] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
      try {
        const res = await api.get(`/budget/${monthKey}`);
        setBudgets(res.data?.categories || {});
        setBudgetFull(res.data || null);
      } catch {
        setBudgets({});
        setBudgetFull(null);
      }
    };
    fetchBudget();
  }, [selectedMonth, selectedYear]);

  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 min-w-0">

        <InsightsHeader
          isScrolled={isScrolled}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          expenses={expenses}
          budgets={budgets}
          budgetFull={budgetFull}
        />

        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 md:space-y-8">

          {/* Row 1 — stacks on mobile, side-by-side on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SpendingPersonality
              expenses={expenses}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
            <CategoryHeatmap
              expenses={expenses}
              budgets={budgets}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <BudgetOverrun
              expenses={filteredExpenses}
              budgets={budgets}
            />
            <FinancialHealthScore
              expenses={filteredExpenses}
              budgets={budgets}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>

          {/* Full-width rows */}
          <TrendAcceleration
            expenses={expenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          <SpendingHighlights
            expenses={expenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          <FlaggedExpenses
            expenses={expenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            budgets={budgets}
          />

        </div>
      </div>
    </div>
  );
}