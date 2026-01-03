import { useEffect, useState } from "react";
import api from "./api";
import ExpenseForm from "./ExpenseForm";
import MonthlyTrend from "./MonthlyTrend";
import CategoryDonut from "./CategoryDonut";
import WeeklyBar from "./WeeklyBar";
import { filterExpensesByCurrentMonth } from "./utils";
import { filterExpensesByCurrentWeek } from "./utils";


export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");
  const currentMonthExpenses = filterExpensesByCurrentMonth(expenses);
  const weeklyExpenses = filterExpensesByCurrentWeek(expenses);


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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };


  const startEditing = (index) => {
    setEditingIndex(index);
    setEditAmount(expenses[index].amount);
    setEditCategory(expenses[index].category);
    setEditNote(expenses[index].note || "");
    setEditDate(expenses[index].date || new Date().toISOString().slice(0,10));
  };

  const saveEdit = async () => {
    try {
      const updated = { amount: Number(editAmount) || 0, category: editCategory, note: editNote, date: editDate };
      const id = expenses[editingIndex].id; 
      const res = await api.put(`/expenses/${id}`, updated);
      setExpenses((prev) =>
        prev.map((e, i) => (i === editingIndex ? res.data : e))
      );
      setEditingIndex(null);
      setEditAmount("");
      setEditCategory("");
      setEditNote("");
      setEditDate("");
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Update failed. See console.");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditAmount("");
    setEditCategory("");
    setEditNote("");
    setEditDate("");
  };

  if (loading) return <p className="text-gray-600">Loading…</p>;
  if (error) return <p className="text-red-600">API error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6 text-center text-red-600 bg-yellow-200">Trackwise</h1>


      <div className="expenseSection mb-6">
        <ExpenseForm onAdd={handleAdd} />
      </div>

      <div className="chartsSection mb-6">
        <div className="flex flex-wrap gap-6 justify-center">
          <MonthlyTrend expenses={expenses} />
          <CategoryDonut expenses={currentMonthExpenses} />
          <WeeklyBar expenses={weeklyExpenses} />
        </div>
      </div>

      <div className="listSection mt-6">
        <p className="mb-4 text-gray-700 text-sm">
          Fetched {expenses.length} expenses from API.
        </p>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses yet.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((e, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg"
              >
                {editingIndex === i ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(ev) => setEditAmount(ev.target.value)}
                        className="border px-2 py-1 rounded w-24"
                      />
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(ev) => setEditCategory(ev.target.value)}
                        className="border px-2 py-1 rounded w-32"
                      />
                      <input
                        type="text"
                        value={editNote}
                        onChange={(ev) => setEditNote(ev.target.value)}
                        className="border px-2 py-1 rounded w-40"
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(ev) => setEditDate(ev.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                 </>
                ) : (
                  <>
                    <div className="text-sm">
                      <span className="font-semibold">₹{e.amount}</span> •{" "}
                      <span>{e.category}</span> •{" "}
                      <span className="text-gray-600">{e.note || "—"}</span> •{" "}
                      <span className="text-gray-500">{e.date}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(i)}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-2 py-1 text-sm border rounded text-red-500"
                      >
                        ❌
                      </button>
                    </div>
                  </>
                )}
             </li>
            ))}
          </ul>
        )}
      </div>

      
    </div>
  );

}
