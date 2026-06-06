import type { ReactNode } from "react";
import {
  Car,
  Package,
  Euro,
  Layers,
  Bell,
  Search,
} from "lucide-react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  growth: string;
  positive?: boolean;
}

interface DistributionItemProps {
  title: string;
  value: string;
  color: string;
}

interface VehicleItemProps {
  name: string;
  time: string;
}

interface ProgressItemProps {
  label: string;
  value: number;
}

interface AlertItemProps {
  title: string;
  qty: string;
}

export default function Dashboard() {
  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Dashboard</h1>
          <p className="text-slate-400 text-sm">Vehicle Inventory Overview</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search vehicles..."
              className="ml-2 outline-none text-sm text-slate-600 bg-transparent w-44"
            />
          </div>

          <button className="relative p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63950] rounded-full" />
          </button>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard icon={<Car size={20} />} title="Total Vehicles" value="128" growth="+12%" positive />
        <StatCard icon={<Layers size={20} />} title="Vehicle Types" value="6" growth="+1" positive />
        <StatCard icon={<Euro size={20} />} title="Inventory Value" value="€2.8M" growth="+8.4%" positive />
        <StatCard icon={<Package size={20} />} title="Available Units" value="121" growth="+4.3%" positive />
      </div>

      {/* Main charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Inventory Growth chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[#0F1C2E]">Inventory Growth</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              Last 8 Months
            </span>
          </div>

          <div className="h-48 flex items-end gap-3">
            {[40, 60, 55, 90, 65, 75, 110, 128].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    index === 7 ? "bg-[#E63950]" : "bg-[#0F1C2E]"
                  }`}
                  style={{ height: `${(height / 128) * 180}px` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 text-xs text-slate-400">
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Vehicle Distribution</h3>

          {/* Donut stand-in */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#EEF2F7" strokeWidth="18" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#0F1C2E" strokeWidth="18"
                  strokeDasharray={`${0.55 * 289} 289`} />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#E63950" strokeWidth="18"
                  strokeDasharray={`${0.30 * 289} 289`}
                  strokeDashoffset={`${-0.55 * 289}`} />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#93A8C4" strokeWidth="18"
                  strokeDasharray={`${0.15 * 289} 289`}
                  strokeDashoffset={`${-(0.55 + 0.30) * 289}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-[#0F1C2E]">128</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <DistributionItem title="Electric Cars" value="55%" color="bg-[#0F1C2E]" />
            <DistributionItem title="Cargo Bikes" value="30%" color="bg-[#E63950]" />
            <DistributionItem title="Motorcycles" value="15%" color="bg-[#93A8C4]" />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Vehicles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Recently Added Vehicles</h3>
          <div className="space-y-3">
            <VehicleItem name="Tesla Model Y" time="Today" />
            <VehicleItem name="BMW i4" time="Yesterday" />
            <VehicleItem name="Urban Arrow Cargo Bike" time="2 days ago" />
            <VehicleItem name="Volkswagen ID.4" time="3 days ago" />
          </div>
        </div>

        {/* Inventory By Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Inventory By Type</h3>
          <ProgressItem label="Electric Cars" value={58} />
          <ProgressItem label="Cargo Bikes" value={31} />
          <ProgressItem label="Motorcycles" value={18} />
          <ProgressItem label="Scooters" value={12} />
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#0F1C2E] mb-5">Low Stock Alerts</h3>
          <AlertItem title="Cargo Bikes" qty="3 Remaining" />
          <AlertItem title="Electric Vans" qty="2 Remaining" />
          <AlertItem title="Scooters" qty="1 Remaining" />
        </div>
      </div>
    </div>
  );
}

/* ---- Components ---- */

function StatCard({ icon, title, value, growth, positive = true }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[#0F1C2E] rounded-xl text-white">{icon}</div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
        }`}>
          {growth}
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-1">{title}</p>
      <h2 className="text-2xl font-bold text-[#0F1C2E]">{value}</h2>
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

function VehicleItem({ name, time }: VehicleItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-[#0F1C2E] flex items-center justify-center flex-shrink-0">
        <Car size={14} className="text-white" />
      </div>
      <div>
        <p className="font-medium text-sm text-[#0F1C2E]">{name}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}

function ProgressItem({ label, value }: ProgressItemProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-[#0F1C2E]">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full">
        <div
          className="h-2 bg-[#E63950] rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AlertItem({ title, qty }: AlertItemProps) {
  return (
    <div className="flex items-center justify-between bg-red-50 border border-red-100 px-4 py-3 rounded-xl mb-3">
      <div>
        <p className="font-semibold text-red-700 text-sm">{title}</p>
        <p className="text-xs text-red-400 mt-0.5">{qty}</p>
      </div>
      <span className="w-2 h-2 rounded-full bg-[#E63950] flex-shrink-0" />
    </div>
  );
}