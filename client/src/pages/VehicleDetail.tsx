import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Car, Pencil, Trash2 } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  vehicleType: { name: string };
  year: number;
  price: number;
  availability: "AVAILABLE" | "SOLD" | "RESERVED";
  description?: string;
  imageUrl?: string;
}

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  RESERVED: "Reserved",
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-100",
  SOLD: "bg-slate-100 text-slate-500 border-slate-200",
  RESERVED: "bg-amber-50 text-amber-600 border-amber-100",
};

const STATUS_DOT: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  SOLD: "bg-slate-400",
  RESERVED: "bg-amber-500",
};

const API = import.meta.env.VITE_API_URL;

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => { setVehicle(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete ${vehicle?.name}? This cannot be undone.`)) return;
    await fetch(`${API}/api/vehicles/${id}`, { method: "DELETE" });
    navigate("/inventory");
  };

  const handleMarkSold = async () => {
    await fetch(`${API}/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...vehicle, status: "Sold" }),
    });
    setVehicle((v) => v ? { ...v, availability: "SOLD" } : v);
  };

  if (loading) return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading vehicle...</p>
    </div>
  );

  if (!vehicle) return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Vehicle not found.</p>
    </div>
  );

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">{vehicle.name}</h1>
          <p className="text-slate-400 text-sm">
            {vehicle.vehicleType?.name} · {vehicle.id}
          </p>
        </div>
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F1C2E] bg-white border border-slate-200 px-4 py-2 rounded-xl hover:shadow transition-all"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="border-t border-slate-200 mb-14" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Image + Info */}
        <div className="lg:col-span-2 space-y-4">

          {/* Image */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="w-full h-72 bg-slate-100 flex items-center justify-center overflow-hidden">
              {vehicle.imageUrl ? (
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <div className="w-16 h-16 rounded-xl bg-[#0F1C2E] flex items-center justify-center">
                    <Car size={28} className="text-white" />
                  </div>
                  <p className="text-xs">No image available</p>
                </div>
              )}
            </div>

            {/* Name + status below image */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0F1C2E] text-lg">{vehicle.name}</p>
                <p className="text-slate-400 text-sm">
                  {vehicle.vehicleType?.name} · {vehicle.year}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_STYLES[vehicle.availability]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[vehicle.availability]}`} />
                {STATUS_LABEL[vehicle.availability]}
              </span>
            </div>
            {/* Description */}
            {vehicle.description && (
            <div className="px-6 pb-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">{vehicle.description}</p>
            </div>
            )}
          </div>
        </div>

        {/* Right: Price + Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Price</p>
            <p className="text-3xl font-bold text-[#E63950] mb-6">
              €{vehicle.price.toLocaleString()}
            </p>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Type</span>
                <span className="font-medium text-[#0F1C2E]">{vehicle.vehicleType?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Year</span>
                <span className="font-medium text-[#0F1C2E]">{vehicle.year}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">Manufacturer</span>
                <span className="font-medium text-[#0F1C2E]">{vehicle.manufacturer}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400"># ID</span>
                <span className="font-mono text-xs text-slate-500">{vehicle.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {vehicle.availability !== "SOLD" && (
                <button
                  onClick={handleMarkSold}
                  className="w-full py-2.5 text-sm font-medium text-[#0F1C2E] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Mark as Sold
                </button>
              )}
              <button
                onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#0F1C2E] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#E63950] bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}