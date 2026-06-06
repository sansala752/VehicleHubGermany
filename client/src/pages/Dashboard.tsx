import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car, Package, Euro, Layers, Bell, Search,
} from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  sub: string;
  positive?: boolean;
}

interface DistributionItemProps {
  title: string;
  value: string;
  color: string;
}

interface VehicleItemProps {
  name: string;
  type: string;
  createdAt: string;
}

interface ProgressItemProps {
  label: string;
  value: number;
  max: number;
}

interface StatsData {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  types: number;
  inventoryValue: number;
  recentVehicles: { id: string; name: string; vehicleType: { name: string }; createdAt: string }[];
  typeDistribution: { id: string; name: string; _count: { vehicles: number } }[];
}

const API = import.meta.env.VITE_API_URL;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch(`${API}/api/vehicles/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const formatValue = (n: number) => {
    if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}K`;
    return `€${n}`;
  };

  const topTypes = stats?.typeDistribution
  ?.sort((a, b) => b._count.vehicles - a._count.vehicles)
  .slice(0, 4) ?? [];

  const COLORS = ["bg-[#0F1C2E]", "bg-[#E63950]", "bg-[#93A8C4]", "bg-amber-400"];
  const DONUT_COLORS = ["#0F1C2E", "#E63950", "#93A8C4", "#F59E0B"];

  // Build donut segments
  const total = stats?.total ?? 1;

  const circumference = 289;
  const segments = topTypes.reduce<{ color: string; dash: number; offset: number }[]>(
  (acc, t, i) => {
    const pct = t._count.vehicles / total;
    const prevOffset = acc.reduce((sum, s) => sum + s.dash, 0);
    acc.push({
      color: DONUT_COLORS[i],
      dash: pct * circumference,
      offset: -prevOffset,
    });
    return acc;
  },
  []
);

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Dashboard</h1>
          <p className="text-slate-400 text-sm">Vehicle Inventory Overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 cursor-pointer"
            onClick={() => navigate("/inventory")}
          >
            <Search size={16} className="text-slate-400" />
            <span className="ml-2 text-sm text-slate-400 w-44">Search vehicles...</span>
          </div>
          <button className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63950] rounded-full" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<Car size={20} />}
          title="Total Vehicles"
          value={stats ? String(stats.total) : "—"}
          sub={stats ? `${stats.available} available` : "loading..."}
          positive
        />
        <StatCard
          icon={<Layers size={20} />}
          title="Vehicle Types"
          value={stats ? String(stats.types) : "—"}
          sub="Categories"
          positive
        />
        <StatCard
          icon={<Euro size={20} />}
          title="Inventory Value"
          value={stats ? formatValue(stats.inventoryValue) : "—"}
          sub="Total stock value"
          positive
        />
        <StatCard
          icon={<Package size={20} />}
          title="Available Units"
          value={stats ? String(stats.available) : "—"}
          sub={stats ? `${stats.sold} sold · ${stats.reserved} reserved` : "loading..."}
          positive
        />
      </div>

      {/* Main row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Status Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[#0F1C2E]">Inventory Status Breakdown</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Available", value: stats?.available ?? 0, color: "bg-[#0F1C2E]", light: "bg-[#0F1C2E]/10 text-[#0F1C2E]" },
              { label: "Sold", value: stats?.sold ?? 0, color: "bg-slate-400", light: "bg-slate-200 text-slate-600" },
              { label: "Reserved", value: stats?.reserved ?? 0, color: "bg-[#E63950]", light: "bg-[#E63950]/10 text-[#E63950]" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.light} mb-3`}>
                  <span className={`w-3 h-3 rounded-full ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-[#0F1C2E]">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {stats?.total ? Math.round((s.value / stats.total) * 100) : 0}%
                </p>
              </div>
            ))}
          </div>

          {/* Bar */}
          {stats && stats.total > 0 && (
            <div className="mt-6">
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                <div className="bg-[#0F1C2E] rounded-full transition-all" style={{ width: `${(stats.available / stats.total) * 100}%` }} />
                <div className="bg-slate-400 rounded-full transition-all" style={{ width: `${(stats.sold / stats.total) * 100}%` }} />
                <div className="bg-[#E63950] rounded-full transition-all" style={{ width: `${(stats.reserved / stats.total) * 100}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Available {Math.round((stats.available / stats.total) * 100)}%</span>
                <span>Sold {Math.round((stats.sold / stats.total) * 100)}%</span>
                <span>Reserved {Math.round((stats.reserved / stats.total) * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Vehicle Distribution</h3>

          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#EEF2F7" strokeWidth="18" />
                {segments.map((s, i) => (
                  <circle key={i} cx="60" cy="60" r="46" fill="none"
                    stroke={s.color} strokeWidth="18"
                    strokeDasharray={`${s.dash} ${circumference}`}
                    strokeDashoffset={s.offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-[#0F1C2E]">{stats?.total ?? "—"}</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {topTypes.map((t, i) => (
              <DistributionItem
                key={t.id}
                title={t.name}
                value={`${stats?.total ? Math.round((t._count.vehicles / stats.total) * 100) : 0}%`}
                color={COLORS[i]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Vehicles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Recently Added</h3>
          <div className="space-y-3">
            {stats?.recentVehicles.length ? (
              stats.recentVehicles.map((v) => (
                <VehicleItem
                  key={v.id}
                  name={v.name}
                  type={v.vehicleType?.name}
                  createdAt={v.createdAt}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No vehicles yet</p>
            )}
          </div>
        </div>

        {/* Inventory By Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Inventory By Type</h3>
          {topTypes.length ? (
            topTypes.map((t) => (
              <ProgressItem key={t.id} label={t.name} value={t._count.vehicles} max={stats?.total ?? 1} />
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No data yet</p>
          )}
        </div>

        {/* Sold vs Reserved */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Sales Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl">
              <div>
                <p className="font-semibold text-[#0F1C2E] text-sm">Total Sold</p>
                <p className="text-xs text-slate-400 mt-0.5">Completed sales</p>
              </div>
              <p className="text-xl font-bold text-[#0F1C2E]">{stats?.sold ?? "—"}</p>
            </div>
            <div className="flex items-center justify-between bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
              <div>
                <p className="font-semibold text-amber-700 text-sm">Reserved</p>
                <p className="text-xs text-amber-400 mt-0.5">Pending confirmation</p>
              </div>
              <p className="text-xl font-bold text-amber-600">{stats?.reserved ?? "—"}</p>
            </div>
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
              <div>
                <p className="font-semibold text-emerald-700 text-sm">Available</p>
                <p className="text-xs text-emerald-400 mt-0.5">Ready to sell</p>
              </div>
              <p className="text-xl font-bold text-emerald-600">{stats?.available ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Components ---- */
function StatCard({ icon, title, value, sub, positive = true }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[#0F1C2E] rounded-xl text-white">{icon}</div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
        }`}>
          Live
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-1">{title}</p>
      <h2 className="text-2xl font-bold text-[#0F1C2E]">{value}</h2>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

function DistributionItem({ title, value, color }: DistributionItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-sm text-slate-600">{title}</span>
      </div>
      <span className="text-sm font-semibold text-[#0F1C2E]">{value}</span>
    </div>
  );
}

function VehicleItem({ name, type, createdAt }: VehicleItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-[#0F1C2E] flex items-center justify-center flex-shrink-0">
        <Car size={14} className="text-white" />
      </div>
      <div>
        <p className="font-medium text-sm text-[#0F1C2E]">{name}</p>
        <p className="text-xs text-slate-400">{type} · {timeAgo(createdAt)}</p>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, max }: ProgressItemProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-[#0F1C2E]">{value} <span className="text-slate-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full">
        <div className="h-2 bg-[#E63950] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}