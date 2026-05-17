interface AuthButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}

const AuthButton = ({ loading, label, loadingLabel }: AuthButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {loading && (
      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {loading ? loadingLabel : label}
  </button>
);

export default AuthButton;
