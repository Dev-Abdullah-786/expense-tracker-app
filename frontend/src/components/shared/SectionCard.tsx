interface SectionCardProps {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const SectionCard = ({
  title,
  right,
  children,
  className = "",
}: SectionCardProps) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
  >
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {right && <div>{right}</div>}
    </div>
    {children}
  </div>
);

export default SectionCard;
