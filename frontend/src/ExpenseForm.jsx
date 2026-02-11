// import { useState, useRef, useEffect } from "react";
// import api from "./api";

// function ExpenseForm({ onAdd }) {
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [note, setNote] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // today's date by default
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const CATEGORY_OPTIONS = ["Food", "Transport", "Shopping", "Bills", "Others"];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newExpense = {
//       amount: parseFloat(amount),
//       category,
//       note,
//       date,
//     };

//     try {
//       const res = await api.post("/expenses", newExpense);
//       onAdd(res.data.data);
//       setAmount("");
//       setCategory("");
//       setNote("");
//       setDate(new Date().toISOString().slice(0, 10)); // reset to today
//     } catch (err) {
//       console.error("Failed to add expense:", err);
//     }

//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex items-center gap-3 w-full"
//     >
//       {/* Amount */}
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         required
//         className="h-10 w-28 rounded-lg border border-gray-300 px-3 text-sm
//                    focus:ring-2 focus:ring-indigo-300 outline-none"
//       />

//       {/* Category */}
//       <div ref={dropdownRef} className="relative w-44">
//         <button
//           type="button"
//           onClick={() => setOpen((v) => !v)}
//           className="w-full h-10 px-3 rounded-lg border border-indigo-300
//                      bg-white text-left text-sm text-gray-700 shadow-sm
//                      focus:outline-none focus:ring-2 focus:ring-indigo-300"
//         >
//           {category || "Select category"}
//           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//             ▾
//           </span>
//         </button>

//         {open && (
//           <div
//             className="absolute mt-2 w-full rounded-lg bg-white
//                        shadow-xl border border-indigo-100 z-20 p-2 space-y-2"
//           >
//             {CATEGORY_OPTIONS.map((cat) => (
//               <div
//                 key={cat}
//                 onClick={() => {
//                   setCategory(cat);
//                   setOpen(false);
//                 }}
//                 className={`px-4 py-2 rounded-lg text-sm cursor-pointer
//                             transition hover:scale-[1.02]
//                             ${
//                               cat === "Food" && "bg-green-100 text-green-600"
//                             }
//                             ${
//                               cat === "Transport" && "bg-blue-100 text-blue-600"
//                             }
//                             ${
//                               cat === "Shopping" && "bg-orange-100 text-orange-600"
//                             }
//                             ${
//                               cat === "Bills" && "bg-red-100 text-red-600"
//                             }
//                             ${
//                               cat === "Others" && "bg-purple-100 text-purple-600"
//                             }`}
//               >
//                 {cat}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Note */}
//       <input
//         type="text"
//         placeholder="Note"
//         value={note}
//         onChange={(e) => setNote(e.target.value)}
//         className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm
//                    focus:ring-2 focus:ring-indigo-300 outline-none"
//       />

//       {/* Date */}
//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         required
//         className="h-10 w-36 rounded-lg border border-gray-300 px-3 text-sm
//                    focus:ring-2 focus:ring-indigo-300 outline-none"
//       />

//       {/* Button */}
//       <button
//         type="submit"
//         className="ml-auto h-10 px-6 rounded-xl bg-gradient-to-r
//                    from-indigo-500 to-blue-500 text-white font-medium
//                    shadow-md hover:opacity-90 transition"
//       >
//         + Add Expense
//       </button>
//     </form>
//   );
// }

// export default ExpenseForm;



import { useState, useRef, useEffect } from "react";
import api from "./api";

function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const CATEGORY_OPTIONS = ["Food", "Transport", "Shopping", "Bills", "Others"];

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
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:gap-3
        w-full
      "
    >
      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="
          h-10 w-full sm:w-28
          rounded-lg border border-gray-300 px-3 text-sm
          focus:ring-2 focus:ring-indigo-300 outline-none
        "
      />

      {/* Category */}
      <div ref={dropdownRef} className="relative w-full sm:w-44">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="
            w-full h-10 px-3 rounded-lg
            border border-indigo-300 bg-white
            text-left text-sm text-gray-700 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-300
          "
        >
          {category || "Select category"}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▾
          </span>
        </button>

        {open && (
          <div
            className="
              absolute mt-2 w-full rounded-lg bg-white
              shadow-xl border border-indigo-100
              z-20 p-2 space-y-2
            "
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer
                  transition hover:scale-[1.02]
                  ${cat === "Food" && "bg-green-100 text-green-600"}
                  ${cat === "Transport" && "bg-blue-100 text-blue-600"}
                  ${cat === "Shopping" && "bg-orange-100 text-orange-600"}
                  ${cat === "Bills" && "bg-red-100 text-red-600"}
                  ${cat === "Others" && "bg-purple-100 text-purple-600"}
                `}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <input
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="
          h-10 w-full sm:flex-1
          rounded-lg border border-gray-300 px-3 text-sm
          focus:ring-2 focus:ring-indigo-300 outline-none
        "
      />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="
          h-10 w-full sm:w-36
          rounded-lg border border-gray-300 px-3 text-sm
          focus:ring-2 focus:ring-indigo-300 outline-none
        "
      />

      {/* Button */}
      <button
        type="submit"
        className="
          h-10 w-full sm:w-auto
          px-6 rounded-xl
          bg-gradient-to-r from-indigo-500 to-blue-500
          text-white font-medium shadow-md
          hover:opacity-90 transition
        "
      >
        + Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
