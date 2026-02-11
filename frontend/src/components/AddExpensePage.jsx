// import { useState, useMemo, useEffect } from "react";
// import api from "../api";
// import ExpenseForm from "../ExpenseForm";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUtensils,
//   faBagShopping,
//   faBus,
//   faFileInvoiceDollar,
//   faLayerGroup,
// } from "@fortawesome/free-solid-svg-icons";

// const ROWS_PER_PAGE = 5;

// export default function AddExpensePage({ expenses, onAdd }) {
//   const [localExpenses, setLocalExpenses] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const [editAmount, setEditAmount] = useState("");
//   const [editCategory, setEditCategory] = useState("");
//   const [editNote, setEditNote] = useState("");
//   const [editDate, setEditDate] = useState("");

//   const [page, setPage] = useState(1);

//   // Load only once
//   useEffect(() => {
//     setLocalExpenses(
//       expenses.map((e) => ({
//         ...e,
//         createdAt: e.createdAt || new Date().toISOString(),
//       }))
//     );
//   }, []);

//   const CATEGORY_ICONS = {
//     Food: { icon: faUtensils, bg: "bg-green-100", text: "text-green-600" },
//     Shopping: { icon: faBagShopping, bg: "bg-orange-100", text: "text-orange-600" },
//     Transport: { icon: faBus, bg: "bg-blue-100", text: "text-blue-600" },
//     Bills: { icon: faFileInvoiceDollar, bg: "bg-red-100", text: "text-red-600" },
//     Others: { icon: faLayerGroup, bg: "bg-purple-100", text: "text-purple-600" },
//   };

//   const sortedExpenses = useMemo(() => {
//     return [...localExpenses].sort((a, b) => {
//       const d = new Date(b.date) - new Date(a.date);
//       if (d !== 0) return d;
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//   }, [localExpenses]);

//   const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / ROWS_PER_PAGE));

//   const paginated = useMemo(() => {
//     const start = (page - 1) * ROWS_PER_PAGE;
//     return sortedExpenses.slice(start, start + ROWS_PER_PAGE);
//   }, [sortedExpenses, page]);

//   const startEditing = (e) => {
//     setEditingId(e.id);
//     setEditAmount(e.amount);
//     setEditCategory(e.category);
//     setEditNote(e.note || "");
//     setEditDate(e.date);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditAmount("");
//     setEditCategory("");
//     setEditNote("");
//     setEditDate("");
//   };

//   const saveEdit = async () => {
//     try {
//       const updated = {
//         amount: Number(editAmount),
//         category: editCategory,
//         note: editNote,
//         date: editDate,
//       };

//       const res = await api.put(`/expenses/${editingId}`, updated);

//       setLocalExpenses((prev) =>
//         prev.map((e) => (e.id === editingId ? res.data : e))
//       );

//       cancelEdit();
//     } catch (err) {
//       console.error("Failed to update:", err);
//       alert("Update failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/expenses/${id}`);
//       setLocalExpenses((prev) => prev.filter((e) => e.id !== id));
//     } catch (err) {
//       console.error("Failed to delete:", err);
//     }
//   };

//   return (
//     <div className="py-6 w-full flex flex-col items-center">
//       <div className="mb-6 w-full max-w-[1100px]">
//         <div className="bg-white rounded-2xl px-4 py-3">
//           <ExpenseForm
//             onAdd={(e) =>
//               setLocalExpenses((prev) => [
//                 { ...e, createdAt: new Date().toISOString() },
//                 ...prev,
//               ])
//             }
//           />
//         </div>
//       </div>

//       <div className="w-full max-w-[900px]">
//         <p className="mb-4 text-gray-500 text-sm">
//           Showing {localExpenses.length} expenses
//         </p>

//         <ul className="relative min-h-[364px] flex flex-col">
//           <ul className="space-y-2 flex-1">
//           {paginated.map((e) => {
//             const isEditing = editingId === e.id;
//             const cfg = CATEGORY_ICONS[e.category] || CATEGORY_ICONS["Others"];

//             return (
//               <li
//                 key={e.id}
//                 className="bg-white rounded-xl border border-gray-200 shadow-sm
//                 hover:shadow-md transition p-3 flex items-center justify-between"
//               >
//                 {isEditing ? (
//                   <>
//                     <div className="flex flex-wrap gap-2 flex-1">
//                       <input value={editAmount} onChange={(ev) => setEditAmount(ev.target.value)} className="border rounded-lg px-3 py-2 text-sm w-24" />
//                       <input value={editCategory} onChange={(ev) => setEditCategory(ev.target.value)} className="border rounded-lg px-3 py-2 text-sm w-32" />
//                       <input value={editNote} onChange={(ev) => setEditNote(ev.target.value)} className="border rounded-lg px-3 py-2 text-sm w-40" />
//                       <input type="date" value={editDate} onChange={(ev) => setEditDate(ev.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
//                     </div>

//                     <div className="flex gap-2 ml-4">
//                       <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm shadow">
//                         Save
//                       </button>
//                       <button onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm">
//                         Cancel
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex items-center gap-4 flex-[0.8] min-w-0">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
//                         <FontAwesomeIcon icon={cfg.icon} />
//                       </div>

//                       <div className="flex items-center gap-2 text-sm min-w-0">
//                         <span className="font-semibold text-gray-900">₹{e.amount}</span>
//                         <span>• {e.category}</span>
//                         <span className="truncate max-w-[220px]">• {e.note || "—"}</span>
//                         <span className="text-xs text-gray-400">• {e.date}</span>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 flex-[0.2] justify-end">
//                       <button onClick={() => startEditing(e)} className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-gray-100">
//                         ✏️
//                       </button>
//                       <button onClick={() => handleDelete(e.id)} className="w-9 h-9 rounded-lg border flex items-center justify-center text-red-500 hover:bg-red-50">
//                         ❌
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//         </ul>

//         <div className="mt-6 flex items-center justify-center gap-4">
//           <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-full border">‹</button>
//           <span>{page}</span>
//           <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 rounded-full border">›</button>
//         </div>
//       </div>
//     </div>
//   );
// }



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
    setLocalExpenses(
      expenses.map((e) => ({
        ...e,
        createdAt: e.createdAt || new Date().toISOString(),
      }))
    );
  }, []);

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
    } catch (err) {}
  };

  return (
    <div className="py-6 w-full flex flex-col items-center">
      {/* FORM */}
      <div className="mb-6 w-full max-w-full lg:max-w-[1100px] px-2 sm:px-0">
        <div className="bg-white rounded-2xl px-4 py-3">
          <ExpenseForm
            onAdd={(e) =>
              setLocalExpenses((prev) => [
                { ...e, createdAt: new Date().toISOString() },
                ...prev,
              ])
            }
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
            const cfg = CATEGORY_ICONS[e.category] || CATEGORY_ICONS["Others"];

            return (
<li
  key={e.id}
  className="
    bg-white rounded-xl border border-gray-200 shadow-sm
    hover:shadow-md transition
    px-3 py-2
    flex flex-col
    sm:flex-row sm:items-center sm:justify-between
    gap-2 sm:gap-0
  "
>
  {/* LEFT SECTION */}
  <div
    className="
      flex items-center gap-2 min-w-0
      flex-wrap
      sm:flex-nowrap
      sm:flex-1
    "
  >
    {/* ICON */}
    <div
      className={`
        flex-shrink-0
        w-8 h-8 sm:w-10 sm:h-10
        rounded-full flex items-center justify-center
        ${cfg.bg} ${cfg.text}
      `}
    >
      <FontAwesomeIcon
        icon={cfg.icon}
        className="text-xs sm:text-sm"
      />
    </div>

    {/* TEXT */}
    <div
      className="
        flex flex-col
        sm:flex-row sm:items-center
        gap-1 sm:gap-1.5
        min-w-0
        text-xs sm:text-sm
      "
    >
      <span className="font-semibold text-gray-900 whitespace-nowrap">
        ₹{e.amount} • {e.category}
      </span>

      <span className="truncate sm:max-w-[220px] max-w-full text-gray-600">
        {e.note || "—"}
      </span>

      <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
        {e.date}
      </span>
    </div>
  </div>

  {/* RIGHT SECTION */}
  <div
    className="
      flex items-center gap-1.5
      justify-end
      flex-shrink-0
      sm:ml-4
    "
  >
    <button
      onClick={() => startEditing(e)}
      className="
        w-7 h-7 sm:w-9 sm:h-9
        rounded-lg border
        flex items-center justify-center
        hover:bg-gray-100
        text-xs sm:text-sm
      "
    >
      ✏️
    </button>

    <button
      onClick={() => handleDelete(e.id)}
      className="
        w-7 h-7 sm:w-9 sm:h-9
        rounded-lg border
        flex items-center justify-center
        text-red-500 hover:bg-red-50
        text-xs sm:text-sm
      "
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
