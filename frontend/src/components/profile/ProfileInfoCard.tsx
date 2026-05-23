import { User, Save, CheckCircle } from "lucide-react";
import type {
  User as UserType,
  UpdateProfileRequest,
} from "../../types/api.types";

interface ProfileInfoCardProps {
  user: UserType;
  editing: boolean;
  form: UpdateProfileRequest;
  loading: boolean;
  error: string;
  success: string;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (form: UpdateProfileRequest) => void;
}

const ProfileInfoCard = ({
  user,
  editing,
  form,
  loading,
  error,
  success,
  onEdit,
  onCancel,
  onSave,
  onChange,
}: ProfileInfoCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-50 rounded-xl">
          <User className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Profile Info</h2>
      </div>
      {!editing ? (
        <button
          onClick={onEdit}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-all"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
      )}
    </div>

    <div className="p-6 space-y-5">
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {[
        { label: "Full Name", key: "name" as const, type: "text" },
        { label: "Email Address", key: "email" as const, type: "email" },
      ].map(({ label, key, type }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {label}
          </label>
          {editing ? (
            <input
              type={type}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              value={form[key]}
              onChange={(e) => onChange({ ...form, [key]: e.target.value })}
            />
          ) : (
            <p className="text-gray-800 font-medium">{user[key]}</p>
          )}
        </div>
      ))}

      {editing && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>
);

export default ProfileInfoCard;
