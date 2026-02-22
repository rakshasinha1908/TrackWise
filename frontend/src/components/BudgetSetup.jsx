import { useEffect, useState } from "react";
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
import api from "../api";



/* -------------------- BREAKPOINT HOOK -------------------- */
function useIsDesktop(breakpoint = 580) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isDesktop;
}

function StepIncomeMobile({ value, onChange, onNext, isDirty }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center bg-gray-50 p-8 rounded-2xl shadow-xl">

      <img
        src="/income-jar.png"
        alt="Income"
        className="w-[120px]"
      />

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Monthly Income
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          How much do you earn every month?
        </p>
      </div>

      <div className="relative w-full max-w-[260px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          ₹
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter income"
          className="w-full pl-9 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-[260px] py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold"
      >
        {isDirty ? "Save" : "Next"}
      </button>
    </div>
  );
}

/* -------------------- STEP 1 : DESKTOP -------------------- */
function StepIncomeDesktop({ monthlyIncome, setMonthlyIncome, setStep, isDirty, setIsDirty, saveBudget }) {
  return (
    <div className="w-full flex items-center justify-center">
      <div
        className="
          relative
          w-full max-w-[620px]
          h-[330px]
          rounded-3xl
          bg-gradient-to-br from-[#fafafa] to-[#eae5ff]
          px-10 pt-4 pb-12
          flex flex-col
        "
      >

        <div className="relative flex flex-1 items-start pt-4 justify-center">
          <div className="relative flex items-start">

            {/* IMAGE */}
            <div className="relative w-[180px] flex-shrink-0 -translate-y-4 -translate-x-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 bg-black/10 blur-3xl rounded-full" />
              </div>
              <div className="absolute w-48 h-48 bg-pink-300/20 blur-[80px] rounded-full" />
              <img
                src="/income-jar.png"
                alt="Income"
                className="relative w-[150px] object-contain drop-shadow-lg"
              />
            </div>

            {/* TEXT */}
            <div className="-ml-20 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-1 whitespace-nowrap">
                Monthly Income
              </h2>
              <p className="text-sm text-gray-500 mb-3 leading-snug">
                How much do you earn every<br />month?
              </p>

              <div className="relative mb-3 max-w-[220px]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  ₹
                </span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => {
                    setMonthlyIncome(e.target.value);
                  }}

                  placeholder="Enter income"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <p className="text-xs text-gray-600 max-w-[240px]">
                This will be used to plan your spending.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-2 mb-2 flex justify-center">
          <button
              onClick={async () => {

                if (isDirty) {
                  await saveBudget();
                  return;
                }             
                setStep(1);
              }}

            className="w-[260px] py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
          >
            {isDirty ? "Save" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}


function StepSavingsMobile({ savings, setSavings, spendable, onNext, isDirty }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center bg-gray-50 p-8 rounded-2xl shadow-xl">

      <img
        src="/money-jar.png"
        alt="Savings"
        className="w-[120px]"
      />

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Monthly Savings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          How much do you want to save?
        </p>
      </div>

      <div className="relative w-full max-w-[260px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          ₹
        </span>
        <input
          type="number"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          placeholder="Enter savings"
          className="w-full pl-9 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <p className="text-xs text-gray-600">
        Spendable after savings:{" "}
        <span className="font-semibold text-gray-900">
          ₹{spendable.toLocaleString()}
        </span>
      </p>

      <button
        onClick={onNext}
        className="w-full max-w-[260px] py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold"
      >
        {isDirty ? "Save" : "Next"}
      </button>
    </div>
  );
}


function StepSavingsDesktop({ savings, setSavings, spendable, setStep, isDirty }) {
  return (
    <div className="w-full flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[620px] h-[330px] rounded-3xl bg-gradient-to-br from-[#f6f2ff] to-[#eae5ff]  pt-8 pb-8 flex gap-6 items-center">

        <div className="w-full flex items-center justify-between relative px-6 -mt-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1 whitespace-nowrap">
              Monthly Savings
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              How much do you want to save <br /> from your income?
            </p>

            <div className="relative mb-3 max-w-[220px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                ₹
              </span>
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

          <div className="relative hidden min-[580px]:block w-[135px] shrink-0">
            <div className="absolute inset-0 bg-pink-300/30 blur-3xl rounded-full" />
            <img
              src="/money-jar.png"
              alt="Savings"
              className="relative w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setStep(2)}
            className="w-[260px] py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
          >
            {isDirty ? "Save" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepBreakdownMobile({
  spendable,
  overBudget,
  categories,
  CATEGORIES,
  openCat,
  setOpenCat,
  clamp,
  SLIDER_MIN,
  SLIDER_MAX,
  setCategories,
}) {
  return (
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
                    className={`text-gray-400 transition ${
                      openCat === cat.name ? "rotate-90" : ""
                    }`}
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
  );
}


function StepBreakdownDesktop({
  spendable,
  overBudget,
  categories,
  CATEGORIES,
  openCat,
  setOpenCat,
  clamp,
  SLIDER_MIN,
  SLIDER_MAX,
  setCategories,
}) {
  return (
    <div className="min-w-full flex items-center justify-center overflow-visible">

      <div className="bg-white rounded-2xl shadow-sm p-5 w-[380px]">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Budget Breakdown
        </h3>

        <p className="text-sm mb-2">
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
                      className={`text-gray-400 transition ${
                        openCat === cat.name ? "rotate-90" : ""
                      }`}
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
  );
}



/* -------------------- MAIN COMPONENT -------------------- */
export default function BudgetSetup() {
  const [step, setStep] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const spendable = Math.max(
    0,
    (Number(monthlyIncome) || 0) - (Number(savings) || 0)
  );

  const isDesktop = useIsDesktop(580);

  const [categories, setCategories] = useState({
    Food: 5000,
    Shopping: 5000,
    Transport: 3000,
    Bills: 7000,
    Others: 7000,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      saveBudget();
    }, 800);

    return () => clearTimeout(timer);
  }, [monthlyIncome, savings, categories, loaded]);

  useEffect(() => {
    const loadBudget = async () => {
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      try {
        const res = await api.get(`/budget/${monthKey}`);

        if (res.data) {
          setMonthlyIncome(res.data.income || "");
          setSavings(res.data.savings || "");
          setCategories(res.data.categories || {});
        }
      } catch (err) {
        console.log("No budget found yet");
      }
    };

    loadBudget().then(() => setLoaded(true));
  }, []);

  const saveBudget = async () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    try {
      await api.post(`/budget/${monthKey}`, {
        month_key: monthKey,
        income: monthlyIncome,
        savings: savings,
        categories: categories,
      });
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const [openCat, setOpenCat] = useState(null);

  const CATEGORIES = [
    {
      name: "Food",
      color: "bg-green-100",
      text: "text-green-600",
      icon: faUtensils,
      pill: "bg-green-100 text-green-600",
    },
    {
      name: "Shopping",
      color: "bg-orange-100",
      text: "text-orange-600",
      icon: faBagShopping,
      pill: "bg-orange-100 text-orange-600",
    },
    {
      name: "Transport",
      color: "bg-blue-100",
      text: "text-blue-600",
      icon: faBus,
      pill: "bg-blue-100 text-blue-600",
    },
    {
      name: "Bills",
      color: "bg-red-100",
      text: "text-red-600",
      icon: faFileInvoiceDollar,
      pill: "bg-red-100 text-red-600",
    },
    {
      name: "Others",
      color: "bg-purple-100",
      text: "text-purple-600",
      icon: faLayerGroup,
      pill: "bg-purple-100 text-purple-600",
    },
  ];

  const SLIDER_MIN = 0;
  const SLIDER_MAX = spendable;

  const clamp = (v) => Math.min(Math.max(v || 0, SLIDER_MIN), SLIDER_MAX);

  const allocated = Object.values(categories).reduce((a, b) => a + b, 0);
  const overBudget = allocated > spendable;

  return (
    <div className="h-[calc(100vh-48px)] w-full flex items-center justify-center px-4 min-[580px]:px-0 bg-white overflow-hidden">
      <div className="max-w-[620px]">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Budget Setup
          </h1>
          <p className="text-sm text-gray-500">
            Plan your money in 3 simple steps.
          </p>
        </div>

        {/* SLIDER STAGE */}
        <div className="relative w-full max-w-[420px] md:h-[70vh] flex items-center">

          {/* LEFT ARROW — DESKTOP ONLY */}
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`hidden md:flex absolute -left-10 md:-left-14 z-10 w-9 h-9 rounded-full items-center justify-center shadow ${
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

              <div className="min-w-full flex items-center justify-center">
                {isDesktop ? (
                  <StepIncomeDesktop
                    monthlyIncome={monthlyIncome}
                    setMonthlyIncome={setMonthlyIncome}
                    setStep={setStep}
                    isDirty={isDirty}
                    setIsDirty={setIsDirty}
                    saveBudget={saveBudget}
                  />
                ) : (
                  <StepIncomeMobile
                    value={monthlyIncome}
                    onChange={setMonthlyIncome}
                    isDirty={isDirty}
                    onNext={async () => {
                      if (isDirty) {
                        await saveBudget();
                        return;
                      }
                      setStep(1);
                    }}
                  />
                )}
              </div>

              <div className="min-w-full flex items-center justify-center">
                {isDesktop ? (
                  <StepSavingsDesktop
                    savings={savings}
                    setSavings={setSavings}
                    spendable={spendable}
                    isDirty={isDirty}
                    setStep={async () => {
                      if (isDirty) {
                        await saveBudget();
                        return;
                      }
                      setStep(2);
                    }}
                  />
                ) : (
                  <StepSavingsMobile
                    savings={savings}
                    setSavings={setSavings}
                    spendable={spendable}
                    isDirty={isDirty}
                    onNext={async () => {
                      if (isDirty) {
                        await saveBudget();
                        return;
                      }
                      setStep(2);
                    }}
                  />
                )}
              </div>

              <div className="min-w-full flex items-center justify-center">
                {isDesktop ? (
                  <StepBreakdownDesktop
                    spendable={spendable}
                    overBudget={overBudget}
                    categories={categories}
                    CATEGORIES={CATEGORIES}
                    openCat={openCat}
                    setOpenCat={setOpenCat}
                    clamp={clamp}
                    SLIDER_MIN={SLIDER_MIN}
                    SLIDER_MAX={SLIDER_MAX}
                    setCategories={setCategories}
                  />
                ) : (
                  <StepBreakdownMobile
                    spendable={spendable}
                    overBudget={overBudget}
                    categories={categories}
                    CATEGORIES={CATEGORIES}
                    openCat={openCat}
                    setOpenCat={setOpenCat}
                    clamp={clamp}
                    SLIDER_MIN={SLIDER_MIN}
                    SLIDER_MAX={SLIDER_MAX}
                    setCategories={setCategories}
                  />
                )}
              </div>

            </div>
          </div>

          {/* RIGHT ARROW — DESKTOP ONLY */}
          <button
            onClick={() => step < 2 && setStep(step + 1)}
            className={`hidden md:flex absolute -right-10 md:-right-14 z-10 w-9 h-9 rounded-full items-center justify-center shadow ${
              step === 2
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className="mt-2 flex justify-center gap-2">
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
    </div>
  );
}

