import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Car, CheckCircle2, Upload } from "lucide-react";

type VehicleStatus = "Available" | "Sold" | "Reserved";

interface FormData {
  name: string;
  manufacturer: string;
  vehicleTypeId: string;
  status: VehicleStatus;
  price: string;
  year: string;
  description: string;
  imageUrl: string;
}

const STATUS_OPTIONS: VehicleStatus[] = ["Available", "Sold", "Reserved"];
const STATUS_STYLES: Record<VehicleStatus, string> = {
  Available: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Sold: "text-slate-500 bg-slate-100 border-slate-200",
  Reserved: "text-amber-600 bg-amber-50 border-amber-200",
};
const STATUS_DOT: Record<VehicleStatus, string> = {
  Available: "bg-emerald-500",
  Sold: "bg-slate-400",
  Reserved: "bg-amber-500",
};
const STATUS_MAP: Record<string, VehicleStatus> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  RESERVED: "Reserved",
};

const API = import.meta.env.VITE_API_URL;
const CURRENT_YEAR = new Date().getFullYear();

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    name: "",
    manufacturer: "",
    vehicleTypeId: "",
    status: "Available",
    price: "",
    year: String(CURRENT_YEAR),
    description: "",
    imageUrl: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const set = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "imageUrl") setImgError(false);
  };

  // Fetch both vehicle types and vehicle data in parallel
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/vehicle-types`).then((r) => r.json()),
      fetch(`${API}/api/vehicles/${id}`).then((r) => r.json()),
    ]).then(([types, data]) => {
      setVehicleTypes(types);
      setForm({
        name: data.name,
        manufacturer: data.manufacturer,
        vehicleTypeId: data.vehicleTypeId,
        status: STATUS_MAP[data.availability] ?? "Available",
        price: String(data.price),
        year: String(data.year),
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      });
      setLoading(false);
    });
  }, [id]);

  const selectedType = vehicleTypes.find((t) => t.id === form.vehicleTypeId);
  const previewPrice = parseFloat(form.price) || 0;
  const hasPreview = form.name || form.manufacturer;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = form.imageUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await fetch(`${API}/upload`, { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const res = await fetch(`${API}/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          manufacturer: form.manufacturer,
          vehicleTypeId: form.vehicleTypeId,
          status: form.status,
          price: form.price,
          year: form.year,
          description: form.description,
          imageUrl: finalImageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update vehicle");

      setSaved(true);
      setTimeout(() => navigate(`/vehicles/${id}`), 1500);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading vehicle...</p>
    </div>
  );

  return (
    <div className="bg-[#EEF2F7] min-h-screen p-6 flex-1 overflow-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1C2E]">Edit Vehicle</h1>
          <p className="text-slate-400 text-sm">Update vehicle information</p>
        </div>
        <button
          onClick={() => navigate(`/vehicles/${id}`)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F1C2E] bg-white border border-slate-200 px-4 py-2 rounded-xl hover:shadow transition-all"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Basic Info */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Basic Information</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                Vehicle Name <span className="text-[#E63950]">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                Manufacturer <span className="text-[#E63950]">*</span>
              </label>
              <input
                required
                value={form.manufacturer}
                onChange={(e) => set("manufacturer", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                  Type <span className="text-[#E63950]">*</span>
                </label>
                <select
                  required
                  value={form.vehicleTypeId}
                  onChange={(e) => set("vehicleTypeId", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 bg-white transition appearance-none cursor-pointer"
                >
                  {vehicleTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                  Status <span className="text-[#E63950]">*</span>
                </label>
                <select
                  required
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as VehicleStatus)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 bg-white transition appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Year */}
          <div className="px-6 pt-5 pb-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Pricing & Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                  Price (€) <span className="text-[#E63950]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">€</span>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
                  Year <span className="text-[#E63950]">*</span>
                </label>
                <input
                  required
                  type="number"
                  min={1990}
                  max={CURRENT_YEAR + 2}
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 transition"
                />
              </div>
            </div>
          </div>

           <div className="px-6 pt-5 pb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              About the Vehicle
            </p>
            <label className="block text-sm font-medium text-[#0F1C2E] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the vehicle..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-[#0F1C2E] focus:ring-2 focus:ring-[#0F1C2E]/10 transition resize-none"
            />
          </div>

          {/* Image */}
          <div className="px-6 pt-5 pb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Media</p>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSelectedFile(file);
                  set("imageUrl", URL.createObjectURL(file));
                }}
              />
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Click to replace image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/vehicles/${id}`)}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl shadow-sm transition-all ${
                saved ? "bg-emerald-500 text-white" : "bg-[#E63950] hover:bg-[#cc2e42] text-white"
              }`}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Preview</p>
          </div>

          <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
            {form.imageUrl && !imgError ? (
              <img
                src={form.imageUrl}
                alt="Vehicle preview"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <div className="w-12 h-12 rounded-xl bg-[#0F1C2E] flex items-center justify-center">
                  <Car size={22} className="text-white" />
                </div>
                <p className="text-xs">Image preview</p>
              </div>
            )}
          </div>

          <div className="px-5 py-4">
            <p className="font-bold text-[#0F1C2E] text-base truncate">
              {hasPreview ? form.name : "Vehicle name"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {form.manufacturer && `${form.manufacturer} · `}
              {selectedType?.name} · {form.year || CURRENT_YEAR}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-bold text-[#E63950]">
                €{previewPrice > 0 ? previewPrice.toLocaleString() : "0"}
              </p>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[form.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[form.status]}`} />
                {form.status}
              </span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}