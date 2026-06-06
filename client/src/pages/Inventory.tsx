import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, Search, Bell, Plus, ChevronDown, Eye, Pencil, Trash2,
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  vehicleType: { name: string };
  year: number;
  price: number;
  availability: "AVAILABLE" | "SOLD" | "RESERVED";
  imageUrl?: string;
}

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  RESERVED: "Reserved",
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-100",
  SOLD:      "bg-slate-100 text-slate-500 border-slate-200",
  RESERVED:  "bg-amber-50 text-amber-600 border-amber-100",
};

const STATUS_DOT: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  SOLD:      "bg-slate-400",
  RESERVED:  "bg-amber-500",
};

const ALL_TYPES = ["All types", "Electric Car", "Cargo Bike"];
const API = import.meta.env.VITE_API_URL;

export default function Inventory() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/vehicles`)
      .then((res) => res.json())
      .then((data) => { setVehicles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

   const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const filtered = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "All types" || v.vehicleType?.name === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Vehicles</h1>
          <p className="text-slate-400 text-sm">{vehicles.length} vehicles in inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/vehicles/add")}
            className="flex items-center gap-2 bg-[#E63950] hover:bg-[#cc2e42] transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            <Plus size={16} />
            Add Vehicle
          </button>
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
              placeholder="Search by name or ID..."
              className="outline-none text-sm text-slate-600 bg-transparent w-full"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors min-w-[160px] justify-between"
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

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3 w-[38%]">Vehicle</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Manufacturer</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Year</th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                  Loading vehicles...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                  No vehicles match your search.
                </td>
              </tr>
            ) : (
              // Update the row render
              filtered.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  navigate={navigate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{vehicles.length}</span> vehicles
          </p>
        </div>
      </div>
    </div>
  );
}

function VehicleRow({
  vehicle,
  navigate,
  onDelete,
}: {
  vehicle: Vehicle;
  navigate: (path: string) => void;
  onDelete: (id: string) => void;
}) {
  const API = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    if (!confirm(`Delete ${vehicle.name}? This cannot be undone.`)) return;
    try {
      await fetch(`${API}/api/vehicles/${vehicle.id}`, { method: "DELETE" });
      onDelete(vehicle.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <tr className="hover:bg-slate-50/60 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            {vehicle.imageUrl ? (
              <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0F1C2E]">
                <Car size={16} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-[#0F1C2E] text-sm">{vehicle.name}</p>
            <p className="text-xs text-slate-400">{vehicle.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.manufacturer}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.vehicleType?.name}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{vehicle.year}</td>
      <td className="px-4 py-4 text-sm font-semibold text-[#0F1C2E] text-right">
        €{vehicle.price.toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[vehicle.availability]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[vehicle.availability]}`} />
          {STATUS_LABEL[vehicle.availability]}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            title="View"
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#0F1C2E] hover:bg-slate-100 transition-colors"
          >
            <Eye size={15} />
          </button>
          <button
            title="Edit"
            onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#0F1C2E] hover:bg-slate-100 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            title="Delete"
            onClick={handleDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-[#E63950] hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}