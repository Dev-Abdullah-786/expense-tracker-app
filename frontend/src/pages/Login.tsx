import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import AuthInput from "../components/auth/AuthInput";
import AuthError from "../components/auth/AuthError";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import type { AuthResponse, LoginRequest } from "../types/api.types";

interface LoginProps {
  onLogin: (
    token: string,
    user: { id: string; name: string; email: string },
  ) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<AuthResponse>(
        "/user/login",
        form,
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your account to continue"
    >
      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
          required
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

        <div className="pt-2">
          <AuthButton
            loading={loading}
            label="Sign In"
            loadingLabel="Signing in..."
          />
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Divider + demo hint */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-center text-gray-400">
          By signing in you agree to our{" "}
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

export default Login;
