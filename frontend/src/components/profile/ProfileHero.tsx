import { Mail, CheckCircle } from "lucide-react";
import type { User } from "../../types/api.types";

const ProfileHero = ({ user }: { user: User }) => {
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30 flex-shrink-0">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
          <p className="text-teal-100 mt-1 flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <div className="mt-3">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Active Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
