import { useEffect, useState } from "react";
import { buildOverrunPredictions } from "../../utils/prediction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../ui/Card";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function BudgetOverrun({ expenses, budgets }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const predictions = buildOverrunPredictions(expenses, budgets || {});

  useEffect(() => {
    if (!predictions.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % predictions.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [predictions]);

  if (!predictions.length) {
    return (
      <Card>
        <div className="p-4 sm:p-6 text-gray-500">No budget risks 🎉</div>
      </Card>
    );
  }

  const item = predictions[currentIndex];
  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const spentPercent = (item.currentSpent / item.budget) * 100;
  const expectedPercent = (currentDay / totalDays) * 100;
  const dailyAvg = item.currentSpent / currentDay;
  const idealDaily = item.budget / totalDays;

  let insightText = "";
  if (spentPercent > expectedPercent + 10) {
    insightText = `You've spent ${Math.round(spentPercent)}% of your budget in ${currentDay} days`;
  } else if (dailyAvg > idealDaily) {
    insightText = "Your daily spending pace is higher than your budget plan";
  } else {
    insightText = "You're slightly above your ideal spending pace";
  }

  const progress = Math.min((item.currentSpent / item.budget) * 100, 100);

  return (
    <Card>
      <h3 className="mb-2 text-xl sm:text-2xl font-semibold">
        Budget Overrun Prediction ⚠️
      </h3>

      {/* Outer wrapper provides horizontal room for the arrows on md+;
          on mobile the arrows sit inside the card instead */}
      <div className="relative">

        {/* LEFT ARROW — outside card on md+, inside on mobile */}
        <button
          onClick={() => setCurrentIndex((prev) => prev === 0 ? predictions.length - 1 : prev - 1)}
          className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-10
                     w-7 h-7 flex items-center justify-center
                     text-gray-400 hover:text-gray-700 hover:scale-110 transition
                     bg-white/80 md:bg-transparent rounded-full shadow md:shadow-none"
          aria-label="Previous"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs sm:text-sm" />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % predictions.length)}
          className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-10
                     w-7 h-7 flex items-center justify-center
                     text-gray-400 hover:text-gray-700 hover:scale-110 transition
                     bg-white/80 md:bg-transparent rounded-full shadow md:shadow-none"
          aria-label="Next"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
        </button>

        {/* CARD CONTENT — extra horizontal padding on mobile to clear arrow buttons */}
        <div className="rounded-lg px-10 py-4 sm:px-8 sm:py-5 md:px-6 bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div key={currentIndex} className="transition-all duration-500 ease-in-out">

            {/* MESSAGE */}
            <p className="text-sm sm:text-[17px] font-semibold text-gray-800 leading-snug">
              You'll exceed your{" "}
              <span className="font-bold text-gray-900">{item.category}</span>{" "}
              budget by{" "}
              <span className="text-red-500 font-bold">
                ₹{Math.round(item.overrun).toLocaleString()}
              </span>
            </p>

            {/* PROGRESS SECTION */}
            <div className="mt-5 sm:mt-6 px-1 sm:px-2">
              <div className="relative h-3 bg-gray-200 rounded-full">

                {/* BAR */}
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #38bdf8, #ef4444)",
                  }}
                />

                {/* POINTER DOT */}
                <div
                  className="absolute top-1/2 w-3 h-3 bg-white border-2 border-red-400 rounded-full shadow"
                  style={{
                    left: progress > 98 ? "98%" : progress < 2 ? "2%" : `${progress}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* OVERFLOW BUBBLE */}
                {item.overrun > 0 && (
                  <div
                    className="absolute flex flex-col items-center z-20"
                    style={{
                      left: `${progress}%`,
                      transform: "translate(-56%, -100%)",
                      top: "-8px",
                    }}
                  >
                    <div className="px-2.5 sm:px-4 py-[4px] sm:py-[5px] text-[10px] sm:text-[11px] font-semibold text-white bg-red-500 rounded-full shadow-lg whitespace-nowrap">
                      +₹{Math.round(item.overrun)}
                    </div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rotate-45 -mt-1.5" />
                  </div>
                )}
              </div>
            </div>

            {/* VALUES */}
            <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm text-gray-700 px-1">
              <div>
                <p className="font-semibold">₹{item.budget.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Budget</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{Math.round(item.predicted).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Estimated Total</p>
              </div>
            </div>

            {/* INSIGHT */}
            <div>
              <p className="text-xs sm:text-sm text-gray-800 mt-2 font-bold italic leading-snug">
                {insightText}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                You've already spent ₹{item.currentSpent.toLocaleString()} this month on {item.category}
              </p>
            </div>

            {/* DOTS */}
            <div className="mt-4 sm:mt-5 flex justify-center gap-2">
              {predictions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition ${
                    i === currentIndex ? "bg-red-500 scale-125" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}