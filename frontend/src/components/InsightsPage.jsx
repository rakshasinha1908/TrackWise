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

  // 🔹 Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Fetch budget
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

  // 🔹 Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  // 🔥 IMPORTANT FIX — VALID BUDGET CHECK
  const hasValidBudget =
    budgetFull &&
    budgetFull.income > 0 &&
    Object.values(budgetFull.categories || {}).some((v) => v > 0);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 min-w-0">

        {/* HEADER ALWAYS VISIBLE */}
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

        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-6">

          {/* 🔴 NO VALID BUDGET */}
          {!hasValidBudget ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Unlock Premium Insights 🚀
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Add your budget (income, savings, and category allocations) to unlock powerful insights and analysis.
              </p>

              <a
                href="/setup"
                className="inline-block px-5 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
              >
                Set Budget
              </a>
            </div>

          ) : (
            <>
              {/* ✅ FULL INSIGHTS */}

              {/* Row 1 */}
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

              {/* Full-width */}
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
            </>
          )}

        </div>
      </div>
    </div>
  );
}