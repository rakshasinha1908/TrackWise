import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "./api";
import DashboardLayout from "./components/DashboardLayout";
import AddExpensePage from "./components/AddExpensePage";
import Sidebar from "./components/Sidebar";

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
    setExpenses((prev) => [...prev, newExpense]);
  };

  if (loading) return <p className="text-gray-600 p-6">Loading…</p>;
  if (error) return <p className="text-red-600 p-6">API error: {error}</p>;

  return (
  <BrowserRouter>
    {/* Page background */}
    <div className= "bg-gray-100 p-6 min-h-screen overflow-hidden">

      {/* Main app container */}
      <div className="mx-auto max-w-[1400px] bg-white rounded-2xl shadow-sm flex h-[calc(100vh-48px)]">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
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

            {/* Reports */}
            <Route
              path="/reports"
              element={
                <div className="p-6 text-gray-600">
                  Reports page (coming later)
                </div>
              }
            />

          </Routes>
        </div>

      </div>
    </div>
  </BrowserRouter>
);

}
