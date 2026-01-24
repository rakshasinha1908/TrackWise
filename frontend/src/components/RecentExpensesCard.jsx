 
import DashboardCard from "./DashboardCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBagShopping,
  faBus,
  faFileInvoiceDollar,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

const CATEGORY_ICON = {
  Food: faUtensils,
  Transport: faBus,
  Shopping: faBagShopping,
  Bills: faFileInvoiceDollar,
  Others: faLayerGroup,
};

export default function RecentExpensesCard({ expenses }) {
  const recent = expenses.slice(-4).reverse();

  const CATEGORY_STYLE = {
    Food: "bg-green-100 text-green-600",
    Transport: "bg-blue-100 text-blue-600",
    Shopping: "bg-orange-100 text-orange-600",
    Bills: "bg-red-100 text-red-600",
    Others: "bg-purple-100 text-purple-600",
  };

  return (
    <DashboardCard title="Recent Expenses"  className=" bg-white border border-gray-100 shadow-sm">
      
      {/* Search (UI only) */}
      <div className="mb-1">
        <input
          type="text"
          placeholder="Search"
          className="
            w-full text-sm
            px-3 py-1
            rounded-lg
            bg-gray-50
            border border-gray-200
            placeholder-gray-400
            focus:outline-none
          "
        />
      </div>

      <div className="space-y-0.5">
        {recent.map((e, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-0 py-1"
          >
            {/* Left: icon + category */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center
                ${CATEGORY_STYLE[e.category] || "bg-gray-100 text-gray-600"}`}
              >
                <FontAwesomeIcon
                  icon={CATEGORY_ICON[e.category] || faLayerGroup}
                  className="text-sm"
                />
              </div>

              <p className="text-[13px] font-medium text-gray-800">
                {e.category}
              </p>
            </div>

            {/* Right: amount */}
            <p className="text-[13px] font-medium text-gray-900">
              ₹{e.amount}
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}


