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

export default function InsightsPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 ">

        <InsightsHeader isScrolled={isScrolled} />

        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingPersonality />
            <CategoryHeatmap />
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