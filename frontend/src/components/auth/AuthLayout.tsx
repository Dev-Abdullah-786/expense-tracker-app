import { TrendingUp, ShieldCheck, BarChart2, Wallet } from "lucide-react";

const FEATURES = [
  { icon: <BarChart2 className="w-5 h-5" />, title: "Smart Analytics", desc: "Visual charts and insights on your spending habits" },
  { icon: <Wallet className="w-5 h-5" />, title: "Track Everything", desc: "Income, expenses and savings all in one place" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Secure & Private", desc: "Your financial data is encrypted and protected" },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

const AuthLayout = ({ children, heading, subheading }: AuthLayoutProps) => (
  <div className="min-h-screen flex">
    {/* Left panel — branding */}
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 flex-col justify-between p-12 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
      <div className="absolute top-1/3 -right-16 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute -bottom-16 left-1/4 w-48 h-48 bg-white/10 rounded-full" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xl font-bold">Expense Tracker</span>
      </div>

      {/* Center content */}
      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Take control of<br />your finances
          </h2>
          <p className="text-teal-100 mt-4 text-lg leading-relaxed">
            Track income, manage expenses, and build better financial habits with powerful insights.
          </p>
        </div>

        <div className="space-y-4">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl text-white flex-shrink-0">{icon}</div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-teal-100 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom quote */}
      <div className="relative z-10">
        <p className="text-teal-100 text-sm italic">"A budget is telling your money where to go instead of wondering where it went."</p>
        <p className="text-white/60 text-xs mt-1">— Dave Ramsey</p>
      </div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-gray-50">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-800 text-lg font-bold">Expense Tracker</span>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h1>
          <p className="text-gray-500 mt-2 text-sm">{subheading}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
