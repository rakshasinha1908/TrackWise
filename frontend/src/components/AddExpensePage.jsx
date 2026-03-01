import { useState, useMemo, useEffect } from "react";
import api from "../api";
import ExpenseForm from "../ExpenseForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBagShopping,
  faBus,
  faFileInvoiceDollar,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

const ROWS_PER_PAGE = 5;

export default function AddExpensePage({ expenses }) {
  const [localExpenses, setLocalExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
  setLocalExpenses((prev) => {
    const mapped = expenses.map((e) => ({
      ...e,
      createdAt: e.createdAt || new Date().toISOString(),
    }));
 
    const merged = [
      ...mapped,
      ...prev.filter(
        (p) => !mapped.some((m) => m.id === p.id)
      ),
    ];

    return merged;
  });
}, [expenses]);

  const CATEGORY_ICONS = {
    Food: { icon: faUtensils, bg: "bg-green-100", text: "text-green-600" },
    Shopping: { icon: faBagShopping, bg: "bg-orange-100", text: "text-orange-600" },
    Transport: { icon: faBus, bg: "bg-blue-100", text: "text-blue-600" },
    Bills: { icon: faFileInvoiceDollar, bg: "bg-red-100", text: "text-red-600" },
    Others: { icon: faLayerGroup, bg: "bg-purple-100", text: "text-purple-600" },
  };

  const sortedExpenses = useMemo(() => {
    return [...localExpenses].sort((a, b) => {
      const d = new Date(b.date) - new Date(a.date);
      if (d !== 0) return d;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [localExpenses]);

  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / ROWS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return sortedExpenses.slice(start, start + ROWS_PER_PAGE);
  }, [sortedExpenses, page]);

  const startEditing = (e) => {
    setEditingId(e.id);
    setEditAmount(e.amount);
    setEditCategory(e.category);
    setEditNote(e.note || "");
    setEditDate(e.date);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditCategory("");
    setEditNote("");
    setEditDate("");
  };

  const saveEdit = async () => {
    try {
      if (!editAmount || !editCategory) {
        alert("Amount and category required");
        return;
      }

      const updated = {
        amount: Number(editAmount),
        category: editCategory,
        note: editNote,
        date: editDate,
      };

      const res = await api.put(`/expenses/${editingId}`, updated);

      setLocalExpenses((prev) =>
        prev.map((e) => (e.id === editingId ? res.data : e))
      );

      cancelEdit();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setLocalExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="py-6 w-full flex flex-col items-center">
      {/* FORM */}
      <div className="mb-6 w-full max-w-full lg:max-w-[1100px] px-2 sm:px-0">
        <div className="bg-white rounded-2xl px-4 py-3">
          <ExpenseForm
            onAdd={(e) => {
              setLocalExpenses((prev) => [
                { ...e, createdAt: new Date().toISOString() },
                ...prev,
              ]);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="w-full max-w-full lg:max-w-[900px] px-2 sm:px-0">
        <p className="mb-4 text-gray-500 text-sm">
          Showing {localExpenses.length} expenses
        </p>

        <ul className="space-y-2">
          {paginated.map((e) => {
            const isEditing = editingId === e.id;
            const cfg =
              CATEGORY_ICONS[e.category] || CATEGORY_ICONS["Others"];

            return (
              <li
                key={e.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition px-4 py-3 flex items-center justify-between"
              >
                {/* LEFT SECTION */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* ICON */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${cfg.bg} ${cfg.text}`}
                  >
                    <FontAwesomeIcon icon={cfg.icon} className="text-sm" />
                  </div>

                  {/* TEXT */}
                  <div className="flex items-center gap-2 min-w-0 text-sm">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(ev) => setEditAmount(ev.target.value)}
                          className="w-20 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <span className="text-gray-400">•</span>

                        <input
                          type="text"
                          value={editCategory}
                          onChange={(ev) => setEditCategory(ev.target.value)}
                          className="w-24 bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        ₹{e.amount} • {e.category}
                      </span>
                    )}

                    <span className="truncate max-w-[200px] text-gray-600">
                      {e.note || "—"}
                    </span>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {e.date}
                    </span>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:scale-110 transition"
                      >
                        💾
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(e)}
                      className="hover:scale-110 transition"
                    >
                      ✏️
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(e.id)}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                  >
                    ❌
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* PAGINATION */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-full border"
          >
            ‹
          </button>

          <span>{page}</span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 rounded-full border"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}