import { useState } from "react";
import api from "../api";
import ExpenseForm from "../ExpenseForm";

export default function AddExpensePage({ expenses, onAdd }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

  const startEditing = (index) => {
    const e = expenses[index];
    setEditingIndex(index);
    setEditAmount(e.amount);
    setEditCategory(e.category);
    setEditNote(e.note || "");
    setEditDate(e.date || new Date().toISOString().slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditAmount("");
    setEditCategory("");
    setEditNote("");
    setEditDate("");
  };

  const saveEdit = async () => {
    try {
      const updated = {
        amount: Number(editAmount) || 0,
        category: editCategory,
        note: editNote,
        date: editDate,
      };

      const id = expenses[editingIndex].id;
      const res = await api.put(`/expenses/${id}`, updated);

      // optimistic UI update
      expenses[editingIndex] = res.data;
      cancelEdit();
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      window.location.reload(); // simple + safe for now
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="py-6">

      {/* Add Expense Form */}
      <div className="mb-8">
        <ExpenseForm onAdd={onAdd} />
      </div>

      {/* Expense List */}
      <div className="listSection">
        <p className="mb-4 text-gray-700 text-sm">
          Fetched {expenses.length} expenses from API.
        </p>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses yet.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((e, i) => (
              <li
                key={e.id}
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
