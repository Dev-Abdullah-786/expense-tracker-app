import { useState } from "react";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
import type { UpdatePasswordRequest } from "../../types/api.types";

interface PasswordModalProps {
  onClose: () => void;
  onSave: (form: UpdatePasswordRequest) => Promise<void>;
}

const PasswordModal = ({ onClose, onSave }: PasswordModalProps) => {
  const [form, setForm] = useState<UpdatePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await onSave(form);
      setSuccess("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "" });
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Current Password",
      key: "currentPassword" as const,
      showKey: "current" as const,
    },
    {
      label: "New Password",
      key: "newPassword" as const,
      showKey: "new" as const,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Change Password</h2>
            <p className="text-violet-100 text-sm mt-1">
              Update your account password
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6">
          {success && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, key, showKey }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show[showKey] ? "text" : "password"}
                    required
                    minLength={key === "newPassword" ? 8 : undefined}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShow((s) => ({ ...s, [showKey]: !s[showKey] }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show[showKey] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
