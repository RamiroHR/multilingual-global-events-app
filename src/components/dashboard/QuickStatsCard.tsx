interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function QuickStatsCard({ title, value, icon }: QuickStatsCardProps) {
  return (
    <div className="rounded-lg bg-space-200 p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-lunar-300">{title}</p>
          <p className="mt-1 text-2xl font-bold text-terracotta-800">{value}</p>
        </div>
        {icon && <div className="text-cosmic-500">{icon}</div>}
      </div>
    </div>
  );
}
