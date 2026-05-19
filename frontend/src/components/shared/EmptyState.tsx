interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg?: string;
}

const EmptyState = ({ icon, title, subtitle, iconBg = "bg-gray-100" }: EmptyStateProps) => (
  <div className="text-center py-16">
    <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
      {icon}
    </div>
    <p className="text-gray-600 font-medium">{title}</p>
    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
  </div>
);

export default EmptyState;
