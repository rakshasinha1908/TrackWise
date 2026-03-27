import { useState, useEffect } from "react";

import InsightsHeader from "../components/insights/InsightsHeader";
import SpendingPersonality from "../components/insights/SpendingPersonality";
import CategoryHeatmap from "../components/insights/CategoryHeatmap";
import BudgetOverrun from "../components/insights/BudgetOverrun";
import FinancialHealthScore from "../components/insights/FinancialHealthScore";
import TrendAcceleration from "../components/insights/TrendAcceleration";
import SpendingHighlights from "../components/insights/SpendingHighlights";
import FlaggedExpenses from "../components/insights/FlaggedExpenses";
import TrendAnomalies from "../components/insights/TrendAnomalies";
import api from "../api";

export default function InsightsPage({ expenses }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [budgets, setBudgets] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const fetchBudget = async () => {
    const monthKey = `${selectedYear}-${String(
      selectedMonth + 1
    ).padStart(2, "0")}`;

    try {
      const res = await api.get(`/budget/${monthKey}`);
      console.log("BUDGET API RESPONSE:", res.data);
      setBudgets(res.data?.categories || {});
    } catch (err) {
      console.log("No budget found");
      setBudgets({});
    }
  };

  fetchBudget();
}, [selectedMonth, selectedYear]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 ">

        <InsightsHeader
  isScrolled={isScrolled}
  selectedMonth={selectedMonth}
  setSelectedMonth={setSelectedMonth}
  selectedYear={selectedYear}
  setSelectedYear={setSelectedYear}
  expenses={expenses}
/>

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
            <SpendingPersonality
            expenses={expenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            />
            <CategoryHeatmap 
             expenses={expenses}
  budgets={budgets}  
  selectedMonth={selectedMonth}
  selectedYear={selectedYear}/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetOverrun />
            <FinancialHealthScore />
          </div>

          <TrendAcceleration />

          <SpendingHighlights />

          <FlaggedExpenses />

          <TrendAnomalies />

        </div>
      </div>
    </div>
  );
}