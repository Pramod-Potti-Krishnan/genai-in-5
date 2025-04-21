import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
}

export function ProgressCard({ title, value, subtitle, icon, color = "primary" }: ProgressCardProps) {
  const colorClasses = {
    primary: "text-primary-500",
    success: "text-green-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
    yellow: "text-yellow-500"
  };
  
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <div className="flex items-center">
          {icon && <div className={`mr-2 ${colorClass}`}>{icon}</div>}
          <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}
