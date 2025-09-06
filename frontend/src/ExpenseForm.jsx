import { useState } from "react";
import api from "./api";

function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. new expense banate hain
    const newExpense = { amount, category, note };

    try {
      // 2. backend ko bhejte hain
      const res = await api.post("/expense", newExpense);

      // 3. parent ko update karne ke liye callback chalate hain
      onAdd(res.data.data);

      // 4. form clear kar dete hain
      setAmount("");
      setCategory("");
      setNote("");
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;







