interface AuthInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}

const AuthInput = ({
  label, type, placeholder, value, onChange,
  icon, rightElement, required, minLength, autoComplete,
}: AuthInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

export default AuthInput;
