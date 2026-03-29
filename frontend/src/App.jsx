import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "./api";
import DashboardLayout from "./components/DashboardLayout";
import AddExpensePage from "./components/AddExpensePage";
import Sidebar from "./components/Sidebar";
import BudgetSetup from "./components/BudgetSetup";
import InsightsPage from "./components/InsightsPage";
import './index.css';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
  async function init() {
    let token = localStorage.getItem("token");

    // 🔥 agar token nahi hai → login karo
    if (!token) {
      setLoading(false);
      return;
    }

    // 🔥 phir expenses fetch karo
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

  init();
}, []);

  const handleAdd = (newExpense) => {
    if (!newExpense) return;
    setExpenses((prev) => [...prev, newExpense]);
  };

  if (loading) return <p className="text-gray-600 p-6">Loading…</p>;
  if (error) return <p className="text-red-600 p-6">API error: {error}</p>;

  return (
  <BrowserRouter>
    {!token ? (
      <Routes>
        <Route path="*" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    ) : (
      <div className="bg-gray-100 p-6 min-h-screen">
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
              <Route
                path="/"
                element={<DashboardLayout expenses={expenses} />}
              />

              <Route
                path="/add"
                element={
                  <AddExpensePage
                    expenses={expenses}
                    onAdd={handleAdd}
                  />
                }
              />

              <Route path="/setup" element={<BudgetSetup />} />

              <Route
                path="/reports"
                element={<InsightsPage expenses={expenses} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    )}
  </BrowserRouter>
);
}

 