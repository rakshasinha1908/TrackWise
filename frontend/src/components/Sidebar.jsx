import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPlus,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const base =
    "w-10 h-10 flex items-center justify-center rounded-lg transition";

  const active =
    "bg-blue-50 text-blue-600";

  const inactive =
    "text-gray-700 hover:bg-gray-100";

  return (
    <div
      className="w-[64px] h-full bg-[#fbfbfb] border-r border-gray-200 flex flex-col items-center py-6 gap-6 rounded-l-2xl overflow-hidden">

      {/* Dashboard */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        <FontAwesomeIcon icon={faHouse} />
      </NavLink>

      {/* Add Expense */}
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        <FontAwesomeIcon icon={faPlus} />
      </NavLink>

      {/* Reports */}
      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `${base} ${isActive ? active : inactive}`
        }
      >
        <FontAwesomeIcon icon={faChartLine} />
      </NavLink>
    </div>
  );
}
