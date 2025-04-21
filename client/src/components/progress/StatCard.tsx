import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  description: string;
  color?: string;
  onClick?: () => void;
  suffix?: string;
  total?: number;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  color = "text-primary",
  onClick,
  suffix = "",
  total
}: StatCardProps) {
  return (
    <Card 
      className={`group transition-all hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-full ${color.replace('text-', 'bg-') + '/10'} flex items-center justify-center mr-3`}>
            <i className={`fas ${icon} ${color}`}></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline mt-1">
              <div className="text-2xl font-bold text-gray-900">
                <CountUp end={value} duration={1000} suffix={suffix} />
                {total !== undefined && <span className="text-gray-500 text-lg ml-1">/ {total}</span>}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}