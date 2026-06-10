import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import AuthInput from "../components/auth/AuthInput";
import AuthError from "../components/auth/AuthError";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import type { AuthResponse, RegisterRequest } from "../types/api.types";

interface RegisterProps {
  onLogin: (
    token: string,
    user: { id: string; name: string; email: string },
  ) => void;
}

const Register = ({ onLogin }: RegisterProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<AuthResponse>(
        "/user/register",
        form,
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.token, data.user);
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    form.password.length === 0
      ? null
      : form.password.length < 6
        ? "weak"
        : form.password.length < 10
          ? "fair"
          : "strong";
  const strengthConfig = {
    weak: {
      label: "Weak",
      color: "bg-red-400",
      text: "text-red-500",
      width: "w-1/3",
    },
    fair: {
      label: "Fair",
      color: "bg-yellow-400",
      text: "text-yellow-600",
      width: "w-2/3",
    },
    strong: {
      label: "Strong",
      color: "bg-green-500",
      text: "text-green-600",
      width: "w-full",
    },
  };

  return (
    <AuthLayout
      heading="Create your account"
      subheading="Start tracking your finances for free today"
    >
      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />

        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        <div>
          <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
            required
            minLength={8}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />
          {/* Password strength bar */}
          {passwordStrength && (
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`}
                />
              </div>
              <p
                className={`text-xs mt-1 font-medium ${strengthConfig[passwordStrength].text}`}
              >
                {strengthConfig[passwordStrength].label} password
              </p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <AuthButton
            loading={loading}
            label="Create Account"
            loadingLabel="Creating account..."
          />
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          By creating an account you agree to our{" "}
          <span className="text-teal-600 cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-teal-600 cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
