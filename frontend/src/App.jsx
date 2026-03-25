import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "./api";
import DashboardLayout from "./components/DashboardLayout";
import AddExpensePage from "./components/AddExpensePage";
import Sidebar from "./components/Sidebar";
import BudgetSetup from "./components/BudgetSetup";
import InsightsPage from "./components/InsightsPage";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to reach backend");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdd = (newExpense) => {
    if (!newExpense) return;
    setExpenses((prev) => [...prev, newExpense]);
  };

  if (loading) return <p className="text-gray-600 p-6">Loading…</p>;
  if (error) return <p className="text-red-600 p-6">API error: {error}</p>;

  return (
    <BrowserRouter>
      {/* Page background */}
      <div className="bg-gray-100 p-6 min-h-screen">
       
        {/* Main app container */}

<div
  className="
    mx-auto
    w-full
    max-w-screen-xl
    bg-white
    rounded-2xl
    shadow-sm
    flex
    min-h-[calc(100vh-48px)]
    overflow-x-hidden
  "
>
 
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <Routes>
              {/* Dashboard */}
              <Route
                path="/"
                element={<DashboardLayout expenses={expenses} />}
              />

              {/* Add Expense */}
              <Route
                path="/add"
                element={
                  <AddExpensePage
                    expenses={expenses}
                    onAdd={handleAdd}
                  />
                }
              />

              {/* Budget Setup */}
              <Route
                path="/setup"
                element={<BudgetSetup />}
              />


              {/* Reports */}
              <Route
                path="/reports"
                element={<InsightsPage />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}


