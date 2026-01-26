import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBagShopping,
  faBus,
  faFileInvoiceDollar,
  faLayerGroup,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function BudgetSetup() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savings, setSavings] = useState("");

  const [categories, setCategories] = useState({
    Food: 5000,
    Shopping: 5000,
    Transport: 3000,
    Bills: 7000,
    Others: 7000,
  });

  const [openCat, setOpenCat] = useState(null);
  const [step, setStep] = useState(0);

  const incomeNum = Number(monthlyIncome) || 0;
  const savingsNum = Number(savings) || 0;

  const SLIDER_MIN = 0;
  const SLIDER_MAX = incomeNum;

  const clamp = (v) =>
    Math.min(Math.max(v || 0, SLIDER_MIN), SLIDER_MAX);

  const allocated = Object.values(categories).reduce((a, b) => a + b, 0);
  const spendable = Math.max(incomeNum - savingsNum, 0);
  const overBudget = allocated > spendable;

  const CATEGORIES = [
    { name: "Food", color: "bg-orange-100", text: "text-orange-600", icon: faUtensils, pill: "bg-orange-100 text-orange-700" },
    { name: "Shopping", color: "bg-red-100", text: "text-red-500", icon: faBagShopping, pill: "bg-red-100 text-red-600" },
    { name: "Transport", color: "bg-purple-100", text: "text-purple-600", icon: faBus, pill: "bg-purple-100 text-purple-600" },
    { name: "Bills", color: "bg-blue-100", text: "text-blue-600", icon: faFileInvoiceDollar, pill: "bg-blue-100 text-blue-600" },
    { name: "Others", color: "bg-gray-200", text: "text-gray-700", icon: faLayerGroup, pill: "bg-gray-200 text-gray-700" },
  ];

  return (
    <div className="flex-1 px-6 pb-8 pt-4 flex flex-col items-center">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Budget Setup</h1>
        <p className="text-sm text-gray-500">Plan your money in 3 simple steps.</p>
      </div>

      {/* SLIDER STAGE */}
      <div className="relative w-full max-w-[420px] h-[70vh] flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          className={`absolute -left-10 md:-left-14 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow ${
            step === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* CLIPPED TRACK */}
        <div className="relative w-full h-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full h-full"
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            {/* STEP 1 */}
            <div className="min-w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-[620px] h-[330px] rounded-3xl bg-gradient-to-br from-[#fafafa] to-[#eae5ff] px-10 pt-4 pb-12 flex flex-col">
                <div className="relative flex flex-1 items-start pt-4">
                  <div className="relative w-[180px] flex-shrink-0 -translate-y-4 -translate-x-10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 bg-black/10 blur-3xl rounded-full" />
                    </div>
                    <div className="absolute w-48 h-48 bg-pink-300/20 blur-[80px] rounded-full" />
                    <img src="/income-jar.png" alt="Income" className="relative w-[150px] object-contain drop-shadow-lg" />
                  </div>

                  <div className="-ml-20 pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 whitespace-nowrap">
                      Monthly Income
                    </h2>

                    <p className="text-sm text-gray-500 mb-3 leading-snug">
                      How much do you earn every<br />month?
                    </p>

                    <div className="relative mb-3 max-w-[220px]">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">₹</span>
                      <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        placeholder="Enter income"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <p className="text-xs text-gray-600 max-w-[240px]">
                      This will be used to plan your spending.
                    </p>
                  </div>
                </div>

                <div className="mt-2 mb-2 flex justify-center">
                  <button
                    onClick={() => setStep(1)}
                    className="w-[260px] py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="min-w-full h-full flex items-center justify-center">
              <div className="relative w-full max-w-[620px] h-[330px] rounded-3xl bg-gradient-to-br from-[#f6f2ff] to-[#eae5ff] px-10 pt-8 pb-8 flex gap-6 items-center">
                <div className="w-full flex items-center justify-between relative -mt-2">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 whitespace-nowrap">
                      Monthly Savings
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      How much do you want to save from your income?
                    </p>

                    <div className="relative mb-3">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">₹</span>
                      <input
                        type="number"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}
                        placeholder="Enter savings"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>

                    <p className="text-xs text-gray-600">
                      Spendable after savings:{" "}
                      <span className="font-semibold text-gray-900">
                        ₹{spendable.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="relative hidden md:block w-[180px] shrink-0">
                    <div className="absolute inset-0 bg-pink-300/30 blur-3xl rounded-full" />
                    <img src="/money-jar.png" alt="Savings" className="relative w-full object-contain drop-shadow-lg" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-[260px] py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="min-w-full h-full flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-sm p-5 w-full max-w-[380px]">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Budget Breakdown
                </h3>

                <p className="text-xs mb-2">
                  Spendable: ₹{spendable.toLocaleString()}
                </p>

                {overBudget && (
                  <p className="text-xs text-red-500 mb-2">
                    You’ve allocated more than your spendable amount!
                  </p>
                )}

                <div className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const value = categories[cat.name];
                    return (
                      <div key={cat.name} className="bg-gray-50 rounded-lg p-1.5">
                        <button
                          onClick={() =>
                            setOpenCat(openCat === cat.name ? null : cat.name)
                          }
                          className="w-full flex items-center justify-between px-3 py-1 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-md flex items-center justify-center ${cat.color} ${cat.text}`}
                            >
                              <FontAwesomeIcon icon={cat.icon} className="text-xs" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {cat.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-0.5 rounded-md text-xs font-semibold ${cat.pill}`}>
                              ₹{value.toLocaleString()}
                            </div>
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className={`text-gray-400 transition ${openCat === cat.name ? "rotate-90" : ""}`}
                            />
                          </div>
                        </button>

                        {openCat === cat.name && (
                          <div className="mt-2 px-3 pb-3">
                            <div className="relative w-full">
                              <div className="h-1.5 bg-gray-200 rounded-full" />
                              <div
                                className="absolute top-0 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                style={{
                                  width: `${(value / SLIDER_MAX) * 100}%`,
                                }}
                              />
                              <input
                                type="range"
                                min={SLIDER_MIN}
                                max={SLIDER_MAX}
                                step={500}
                                value={value}
                                onChange={(e) => {
                                  const v = clamp(Number(e.target.value));
                                  setCategories((prev) => ({
                                    ...prev,
                                    [cat.name]: v,
                                  }));
                                }}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                              />
                            </div>

                            <div className="mt-2 flex justify-end">
                              <input
                                type="number"
                                value={value}
                                onChange={(e) => {
                                  const v = clamp(Number(e.target.value));
                                  setCategories((prev) => ({
                                    ...prev,
                                    [cat.name]: v,
                                  }));
                                }}
                                className="w-[60px] h-[20px] bg-fuchsia-200 text-gray-800 px-2 py-1 rounded-md text-xs font-semibold text-right outline-none focus:ring-2 focus:ring-fuchsia-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => step < 2 && setStep(step + 1)}
          className={`absolute -right-10 md:-right-14 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow ${
            step === 2
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              step === i
                ? "bg-indigo-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
