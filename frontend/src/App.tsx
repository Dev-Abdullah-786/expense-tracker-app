import { useState } from "react";
import Login from "./pages/Login";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import type { User } from "./types/api.types";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

interface ProtectedRouteProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const ProtectedRoute = ({ user, onLogout, children }: ProtectedRouteProps) => {
  if (!user && !localStorage.getItem("token"))
    return <Navigate to="/login" replace />;
  return (
    <Layout user={user} onLogout={onLogout}>
      {children}
    </Layout>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getStoredUser);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <Register onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <Income />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <Expense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
