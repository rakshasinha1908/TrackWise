import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPlus,
  faChartLine,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const base =
    "w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg transition";

  const active = "bg-blue-50 text-blue-600";
  const inactive = "text-gray-700 hover:bg-gray-100";

  return (
    <div className="w-[44px] lg:w-[64px] flex-shrink-0 self-stretch bg-[#fbfbfb] border-r border-gray-200 flex flex-col items-center py-4 lg:py-6 gap-4 lg:gap-6 rounded-l-2xl">

      {/* Dashboard */}
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <FontAwesomeIcon icon={faHouse} className="text-sm lg:text-base" />
      </NavLink>

      {/* Add Expense */}
      <NavLink
        to="/add"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <FontAwesomeIcon icon={faPlus} className="text-sm lg:text-base" />
      </NavLink>

      {/* Setup */}
      <NavLink
        to="/setup"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <FontAwesomeIcon icon={faGear} className="text-sm lg:text-base" />
      </NavLink>

      {/* Reports */}
      <NavLink
        to="/reports"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <FontAwesomeIcon icon={faChartLine} className="text-sm lg:text-base" />
      </NavLink>
    </div>
  );
}