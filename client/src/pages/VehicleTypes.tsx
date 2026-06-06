import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Bell, ArrowUpRight } from "lucide-react";

interface RecentVehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  availability: "AVAILABLE" | "SOLD" | "RESERVED";
  imageUrl?: string;
}

interface VehicleTypeStat {
  id: string;
  name: string;
  total: number;
  available: number;
  sold: number;
  reserved: number;
  avgPrice: number;
  totalVehicles: number;
  recentVehicles: RecentVehicle[];
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600",
  SOLD: "bg-slate-100 text-slate-500",
  RESERVED: "bg-amber-50 text-amber-600",
};

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  RESERVED: "Reserved",
};

const STATUS_DOT: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  SOLD: "bg-slate-400",
  RESERVED: "bg-amber-500",
};

const API = import.meta.env.VITE_API_URL;

export default function VehicleTypes() {
  const navigate = useNavigate();
  const [types, setTypes] = useState<VehicleTypeStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/vehicle-types/stats`)
      .then((r) => r.json())
      .then((data) => { setTypes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalVehicles = types.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Vehicle Types</h1>
          <p className="text-slate-400 text-sm">
            {loading ? "Loading..." : `${types.length} categories · ${totalVehicles} total vehicles`}
          </p>
        </div>
        <button className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63950] rounded-full" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-slate-400 text-sm">Loading vehicle types...</p>
        </div>
      ) : types.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-slate-400 text-sm">No vehicle types found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {types.map((type) => (
            <TypeCard key={type.id} type={type} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

function TypeCard({
  type,
  navigate,
}: {
  type: VehicleTypeStat;
  navigate: (path: string) => void;
}) {
  const availabilityPct = type.total > 0 ? (type.available / type.total) * 100 : 0;
  const fleetPct = type.totalVehicles > 0
    ? Math.round((type.total / type.totalVehicles) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      {/* Top section */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2F7] flex items-center justify-center flex-shrink-0">
              <Car size={22} className="text-[#0F1C2E]" />
            </div>
            <div>
              <p className="font-bold text-[#0F1C2E] text-base">{type.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {type.total} vehicle{type.total !== 1 ? "s" : ""} in inventory
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#0F1C2E]">{type.total}</p>
            <p className="text-xs text-slate-400 mt-0.5">{fleetPct}% of fleet</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available
            </div>
            <p className="text-xl font-bold text-[#0F1C2E]">{type.available}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Sold
            </div>
            <p className="text-xl font-bold text-[#0F1C2E]">{type.sold}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63950]" />
              Avg. Price
            </div>
            <p className="text-xl font-bold text-[#0F1C2E]">
              €{Math.round(type.avgPrice).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Availability bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">Availability</span>
            <span className="text-xs text-slate-500 font-medium">
              {type.available} / {type.total}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#0F1C2E] rounded-full transition-all"
              style={{ width: `${availabilityPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent vehicles */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-[#0F1C2E]">Recent {type.name}s</p>
          <button
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-1 text-xs text-[#E63950] font-medium hover:underline"
          >
            View all
            <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="space-y-2">
          {type.recentVehicles.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">No vehicles yet</p>
          ) : (
            type.recentVehicles.map((v) => (
              <div
                key={v.id}
                onClick={() => navigate(`/vehicles/${v.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="w-12 h-9 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0F1C2E]">
                      <Car size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F1C2E] truncate">{v.name}</p>
                  <p className="text-xs text-slate-400">
                    {v.year} · €{v.price.toLocaleString()}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[v.availability]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[v.availability]}`} />
                  {STATUS_LABEL[v.availability]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}