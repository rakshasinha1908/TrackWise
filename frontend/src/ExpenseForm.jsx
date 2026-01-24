import { useState } from "react";
import api from "./api";

function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // today's date by default

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      amount: parseFloat(amount),
      category,
      note,
      date,
    };

    try {
      const res = await api.post("/expenses", newExpense);
      onAdd(res.data.data);
      setAmount("");
      setCategory("");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10)); // reset to today
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const CATEGORY_OPTIONS = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Others",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border px-2 py-1 rounded"
      >
        <option value="" disabled>
          Select category
        </option>
        {CATEGORY_OPTIONS.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;