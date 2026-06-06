import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  type: "Electric Car" | "Cargo Bike" | "Motorcycle" | "Scooter" | "Electric Van";
  year: number;
  price: number;
  status: "Available" | "Sold" | "Reserved";
  image: string;
}

const VEHICLES: Vehicle[] = [
  { id: "v-1001", name: "Tesla Model 3",        type: "Electric Car",  year: 2024, price: 42990, status: "Available", image: "/assets/vehicles/tesla-model3.jpg" },
  { id: "v-1002", name: "Volkswagen ID.4",       type: "Electric Car",  year: 2023, price: 38500, status: "Available", image: "/assets/vehicles/vw-id4.jpg" },
  { id: "v-1003", name: "BMW i4",                type: "Electric Car",  year: 2024, price: 56700, status: "Sold",      image: "/assets/vehicles/bmw-i4.jpg" },
  { id: "v-2001", name: "Urban Arrow Family",    type: "Cargo Bike",    year: 2024, price:  5490, status: "Available", image: "/assets/vehicles/urban-arrow.jpg" },
  { id: "v-2002", name: "Riese & Müller Load 75",type: "Cargo Bike",    year: 2024, price:  8990, status: "Available", image: "/assets/vehicles/riese-muller.jpg" },
  { id: "v-3001", name: "Harley-Davidson LiveWire", type: "Motorcycle", year: 2023, price: 29900, status: "Reserved", image: "/assets/vehicles/livewire.jpg" },
];

const ALL_TYPES = ["All types", "Electric Car", "Cargo Bike", "Motorcycle", "Scooter", "Electric Van"];

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Sold:      "bg-slate-100 text-slate-500 border-slate-200",
  Reserved:  "bg-amber-50 text-amber-600 border-amber-100",
};

const STATUS_DOT: Record<string, string> = {
  Available: "bg-emerald-500",
  Sold:      "bg-slate-400",
  Reserved:  "bg-amber-500",
};

export default function Inventory() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = VEHICLES.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                          v.id.toLowerCase().includes(search.toLowerCase());
    const matchesType   = typeFilter === "All types" || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Vehicles</h1>
          <p className="text-slate-400 text-sm">{VEHICLES.length} vehicles in inventory</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Add Vehicle */}
          <button
            onClick={() => navigate("/vehicles/add")}
            className="flex items-center gap-2 bg-[#E63950] hover:bg-[#cc2e42] transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            <Plus size={16} />
            Add Vehicle
          </button>

          {/* Search */}
          <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="ml-2 outline-none text-sm text-slate-600 bg-transparent w-44"
            />
          </div>

          {/* Bell */}
          <button className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63950] rounded-full" />
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Filters bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl gap-2 w-72">
            <Search size={15} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="outline-none text-sm text-slate-600 bg-transparent w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors min-w-[200px] justify-between"
              >
                {typeFilter}
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${
                        typeFilter === t ? "text-[#E63950] font-semibold" : "text-slate-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 w-[38%]">Vehicle</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Year</th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                  No vehicles match your search.
                </td>
              </tr>
            ) : (
              filtered.map((vehicle) => (
                <VehicleRow key={vehicle.id} vehicle={vehicle} />
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{VEHICLES.length}</span> vehicles
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs text-white bg-[#0F1C2E] rounded-lg hover:bg-[#1a2e47] transition-colors">
              1
            </button>
            <button className="px-3 py-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Vehicle Row ---- */
function VehicleRow({ vehicle }: { vehicle: Vehicle }) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
              }}
            />
            <div className="w-full h-full items-center justify-center bg-[#0F1C2E] hidden" aria-hidden>
              <Car size={16} className="text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#0F1C2E] text-sm">{vehicle.name}</p>
            <p className="text-xs text-slate-400">{vehicle.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.type}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.year}</td>
      <td className="px-4 py-4 text-sm font-semibold text-[#0F1C2E] text-right">
        €{vehicle.price.toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[vehicle.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[vehicle.status]}`} />
          {vehicle.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button title="View" className="p-2 rounded-lg text-slate-400 hover:text-[#0F1C2E] hover:bg-slate-100 transition-colors">
            <Eye size={15} />
          </button>
          <button title="Edit" className="p-2 rounded-lg text-slate-400 hover:text-[#0F1C2E] hover:bg-slate-100 transition-colors">
            <Pencil size={15} />
          </button>
          <button title="Delete" className="p-2 rounded-lg text-slate-400 hover:text-[#E63950] hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}