interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function QuickStatsCard({ title, value, icon }: QuickStatsCardProps) {
  return (
    <div className="rounded-lg bg-space-200 p-4 shadow-sm transition-all hover:shadow-md">
      <p className="text-center text-sm font-medium text-lunar-300">{title}</p>
      <div className="flex items-center justify-center gap-2">
        <p className="mt-1 text-center text-2xl font-bold text-terracotta-800">{value}</p>
        {icon && <div className="text-terracotta-500">{icon}</div>}
      </div>
    </div>
  );
}
