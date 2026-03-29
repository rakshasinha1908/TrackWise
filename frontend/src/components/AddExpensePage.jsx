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

const CATEGORY_ICONS = {
  Food:      { icon: faUtensils,          bg: "bg-green-100",  text: "text-green-600"  },
  Shopping:  { icon: faBagShopping,       bg: "bg-orange-100", text: "text-orange-600" },
  Transport: { icon: faBus,               bg: "bg-blue-100",   text: "text-blue-600"   },
  Bills:     { icon: faFileInvoiceDollar, bg: "bg-red-100",    text: "text-red-600"    },
  Others:    { icon: faLayerGroup,        bg: "bg-purple-100", text: "text-purple-600" },
};

export default function AddExpensePage({ expenses }) {
  const [localExpenses, setLocalExpenses] = useState([]);
  const [editingId, setEditingId]         = useState(null);
  const [editAmount, setEditAmount]       = useState("");
  const [editCategory, setEditCategory]   = useState("");
  const [editNote, setEditNote]           = useState("");
  const [editDate, setEditDate]           = useState("");
  const [page, setPage]                   = useState(1);

  useEffect(() => {
    setLocalExpenses((prev) => {
      const mapped = expenses.map((e) => ({
        ...e,
        createdAt: e.createdAt || new Date().toISOString(),
      }));
      const merged = [
        ...mapped,
        ...prev.filter((p) => !mapped.some((m) => m.id === p.id)),
      ];
      return merged;
    });
  }, [expenses]);

  const sortedExpenses = useMemo(() =>
    [...localExpenses].sort((a, b) => {
      const d = new Date(b.date) - new Date(a.date);
      return d !== 0 ? d : new Date(b.createdAt) - new Date(a.createdAt);
    }),
  [localExpenses]);

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
    if (!editAmount || !editCategory) {
      alert("Amount and category required");
      return;
    }
    try {
      const res = await api.put(`/expenses/${editingId}`, {
        amount: Number(editAmount),
        category: editCategory,
        note: editNote,
        date: editDate,
      });
      setLocalExpenses((prev) =>
        prev.map((e) => (e.id === editingId ? res.data : e))
      );
      cancelEdit();
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setLocalExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="py-4 sm:py-6 w-full flex flex-col items-center">

      {/* ── FORM ──────────────────────────────────────────────────────── */}
      <div className="mb-5 sm:mb-6 w-full max-w-full lg:max-w-[1100px] px-3 sm:px-4 lg:px-0">
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

      {/* ── LIST ──────────────────────────────────────────────────────── */}
      <div className="w-full max-w-full lg:max-w-[900px] px-3 sm:px-4 lg:px-0">
        <p className="mb-3 text-gray-500 text-sm">
          Showing {localExpenses.length} expense{localExpenses.length !== 1 ? "s" : ""}
        </p>

        <ul className="space-y-2">
          {paginated.map((e) => {
            const isEditing = editingId === e.id;
            const cfg = CATEGORY_ICONS[e.category] || CATEGORY_ICONS["Others"];

            return (
              <li
                key={e.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                {isEditing ? (
                  /* ── EDIT MODE
                     Stacks vertically on all screen sizes for clarity.
                     Wide inputs on sm+, compact on mobile. ─────────── */
                  <div className="px-4 py-3 flex flex-col gap-3">

                    {/* Edit fields row */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-[80px]">
                        <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(ev) => setEditAmount(ev.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5 flex-1 min-w-[100px]">
                        <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(ev) => setEditCategory(ev.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                          {Object.keys(CATEGORY_ICONS).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-0.5 flex-1 min-w-[100px]">
                        <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                          Date
                        </label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(ev) => setEditDate(ev.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        Note
                      </label>
                      <input
                        type="text"
                        value={editNote}
                        onChange={(ev) => setEditNote(ev.target.value)}
                        placeholder="Optional note"
                        className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1.5 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ──────────────────────────────────────
                     Single row on sm+.
                     On mobile: amount+category on top, note+date below,
                     action buttons right-aligned. ─────────────────── */
                  <div className="px-4 py-3">

                    {/* sm+: single flex row */}
                    <div className="hidden sm:flex items-center justify-between gap-3">
                      {/* Left */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                          <FontAwesomeIcon icon={cfg.icon} className="text-sm" />
                        </div>
                        <div className="flex items-center gap-2 min-w-0 text-sm flex-wrap">
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            ₹{e.amount} • {e.category}
                          </span>
                          <span className="truncate max-w-[180px] text-gray-500">
                            {e.note || "—"}
                          </span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {e.date}
                          </span>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEditing(e)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-sm"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-sm"
                          title="Delete"
                        >
                          ❌
                        </button>
                      </div>
                    </div>

                    {/* Mobile: two-row layout */}
                    <div className="flex sm:hidden items-start gap-3">
                      {/* Category icon */}
                      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${cfg.bg} ${cfg.text}`}>
                        <FontAwesomeIcon icon={cfg.icon} className="text-sm" />
                      </div>

                      {/* Text block */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            ₹{e.amount} • {e.category}
                          </span>
                          {/* Actions inline with first row on mobile */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => startEditing(e)}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-xs"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="w-7 h-7 rounded-lg border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition text-xs"
                              title="Delete"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                        {/* Second line: note + date */}
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-500 truncate max-w-[160px]">
                            {e.note || "—"}
                          </span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {e.date}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* ── PAGINATION ──────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg leading-none"
            >
              ‹
            </button>

            <span className="text-sm text-gray-600 font-medium">
              {page} <span className="text-gray-400">/ {totalPages}</span>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg leading-none"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}