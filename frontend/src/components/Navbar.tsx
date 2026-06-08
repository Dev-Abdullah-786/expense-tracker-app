import img1 from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useRef, useState } from "react";
import type { NavbarProps } from "../types/api.types";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";

const Navbar = ({ onLogout, user: initialUser }: NavbarProps) => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (initialUser) return;
    axiosInstance
      .get("/user/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: "My Profile",
      onClick: () => {
        setMenuOpen(false);
        navigate("/profile");
      },
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      onClick: () => {
        setMenuOpen(false);
        navigate("/profile");
      },
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
            <img src={img1} alt="logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
            Expense Tracker
          </span>
        </div>

        {/* User menu */}
        {user && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-150 ${
                menuOpen
                  ? "bg-teal-50 ring-2 ring-teal-200"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              {/* Name + email — hidden on small screens */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 leading-tight truncate max-w-[140px]">
                  {user.email}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in z-50">
                {/* User info header */}
                <div className="px-4 py-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  {menuItems.map(({ icon, label, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-left"
                    >
                      <span className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                        {icon}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="p-1.5 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                  >
                    <span className="p-1.5 bg-red-50 rounded-lg text-red-500">
                      <LogOut className="w-4 h-4" />
                    </span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
