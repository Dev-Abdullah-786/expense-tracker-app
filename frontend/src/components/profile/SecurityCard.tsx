import { Shield, Lock, CheckCircle } from "lucide-react";

interface SecurityCardProps {
  onChangePassword: () => void;
}

const SecurityCard = ({ onChangePassword }: SecurityCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex items-center gap-3">
      <div className="p-2 bg-violet-50 rounded-xl">
        <Shield className="w-5 h-5 text-violet-600" />
      </div>
      <h2 className="text-lg font-bold text-gray-800">Security</h2>
    </div>
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Password</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Keep your account secure
            </p>
          </div>
        </div>
        <button
          onClick={onChangePassword}
          className="text-sm font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-all"
        >
          Change
        </button>
      </div>
      <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
        <div className="flex items-center gap-2 text-teal-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">Account is secure</p>
        </div>
        <p className="text-xs text-teal-600 mt-1 ml-6">
          Your account is protected with a strong password
        </p>
      </div>
    </div>
  </div>
);

export default SecurityCard;
