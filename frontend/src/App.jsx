import { useEffect, useState } from "react";
import api from "./api";
import ExpenseForm from "./ExpenseForm";
import MonthlyTrend from "./MonthlyTrend";
import CategoryDonut from "./CategoryDonut";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

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

  const handleDelete = async (index) => {
    try {
      await api.delete(`/expense/${index}`);
      setExpenses((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert("Delete failed. See console.");
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
      const res = await api.put(`/expenses/${editingIndex}`, updated);
      setExpenses((prev) => prev.map((e, i) => (i === editingIndex ? res.data : e)));
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
      <h1 className="text-3xl font-bold mb-6 text-center">Trackwise</h1>

      <ExpenseForm onAdd={handleAdd} />

      {/* Charts area */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        <MonthlyTrend expenses={expenses} />
        <CategoryDonut expenses={expenses} />
      </div>

      <p className="mb-4 text-gray-700">Fetched {expenses.length} expenses from API.</p>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses yet.</p>
      ) : (
        <ul className="space-y-4">
          {expenses.map((e, i) => (
            <li key={i}>
              {editingIndex === i ? (
                <>
                  <input type="number" value={editAmount} onChange={(ev) => setEditAmount(ev.target.value)} />
                  <input type="text" value={editCategory} onChange={(ev) => setEditCategory(ev.target.value)} />
                  <input type="text" value={editNote} onChange={(ev) => setEditNote(ev.target.value)} />
                  <input type="date" value={editDate} onChange={(ev) => setEditDate(ev.target.value)} />
                  <button onClick={saveEdit} style={{ marginLeft: 8 }}>💾 Save</button>
                  <button onClick={cancelEdit} style={{ marginLeft: 8, color: "red" }}>❌ Cancel</button>
                </>
              ) : (
                <>
                  {e.amount} • {e.category} • {e.note} • {e.date}
                  <button onClick={() => startEditing(i)} style={{ marginLeft: 8 }}>✏️</button>
                  <button onClick={() => handleDelete(i)} style={{ marginLeft: 8, color: "red" }}>❌</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}







