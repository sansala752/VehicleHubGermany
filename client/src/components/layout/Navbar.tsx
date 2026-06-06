import {
  MdDashboard,
  MdInventory,
  MdDirectionsCar,
  MdSettings,
} from "react-icons/md";

import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <MdDashboard size={20} /> },
  { name: "Inventory", path: "/inventory", icon: <MdInventory size={20} /> },
  { name: "Vehicle Types", path: "/vehicle-types", icon: <MdDirectionsCar size={20} /> },
  { name: "Settings", path: "/settings", icon: <MdSettings size={20} /> },
];

export default function Navbar() {
  return (
    <aside className="w-56 min-h-screen bg-[#0F1C2E] border-r border-[#1a2d45] p-5 flex flex-col flex-shrink-0">
      
      {/* Logo */}
      <div className="mb-14">
        <img src={logo} alt="AutoHub Logo" className="w-15 h-15 rounded-xl" />
      </div>


      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm
              ${
                isActive
                  ? "bg-[#E63950] text-white font-semibold"
                  : "text-slate-400 hover:bg-[#1a2d45] hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom user hint */}
      <div className="mt-auto pt-6 border-t border-[#1a2d45]">
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#1a2d45]"
          />
          <div>
            <p className="text-xs font-semibold text-white">Admin</p>
            <p className="text-xs text-slate-500">AutoHub Germany</p>
          </div>
        </div>
      </div>
    </aside>
  );
}