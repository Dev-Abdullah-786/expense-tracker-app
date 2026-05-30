interface DashStatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  gradient: string;
}

const DashStatCard = ({
  title,
  value,
  sub,
  icon,
  gradient,
}: DashStatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient}`}
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white/10" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <div className="p-2 bg-white/20 rounded-xl">{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-white/70 text-xs">{sub}</p>
    </div>
  </div>
);

export default DashStatCard;
