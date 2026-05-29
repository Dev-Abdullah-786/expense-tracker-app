import Select from "./Select";
import { useState } from "react";
import { X } from "lucide-react";
import type { SelectOption } from "./Select";
import type { TransactionRequest } from "../../types/api.types";

interface TransactionModalProps {
  title: string;
  subtitle: string;
  gradient: string;
  ringColor: string;
  submitGradient: string;
  categories: string[];
  categoryIcons?: Record<string, React.ReactNode>;
  defaultCategory: string;
  accentColor?: "teal" | "orange" | "violet" | "gray";
  onClose: () => void;
  onSave: (d: TransactionRequest) => Promise<void>;
}

const TransactionModal = ({
  title,
  subtitle,
  gradient,
  ringColor,
  submitGradient,
  categories,
  categoryIcons,
  defaultCategory,
  accentColor = "teal",
  onClose,
  onSave,
}: TransactionModalProps) => {
  const [form, setForm] = useState<TransactionRequest>({
    description: "",
    amount: 0,
    category: defaultCategory,
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to save",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${ringColor} focus:border-transparent transition-all bg-white`;

  const categoryOptions: SelectOption[] = categories.map((c) => ({
    value: c,
    label: c,
    icon: categoryIcons?.[c],
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`${gradient} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-white/70 text-sm mt-1">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Monthly salary"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount ($)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputCls}
                placeholder="0.00"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <Select
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={categoryOptions}
                accentColor={accentColor}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${submitGradient} text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 mt-2`}
            >
              {loading ? "Saving..." : title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
