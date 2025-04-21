import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CountUp } from "@/components/ui/count-up";

interface ScoreboardMetricProps {
  title: string;
  value: number | string;
  icon: string;
  percent?: number;
  delta?: number;
  suffix?: string;
  onClick?: () => void;
}

export function ScoreboardMetric({
  title,
  value,
  icon,
  percent,
  delta,
  suffix = "",
  onClick
}: ScoreboardMetricProps) {
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0;
  
  return (
    <Card 
      className={`transition-all hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center">
          {percent !== undefined ? (
            <div className="mr-3">
              <ProgressRing 
                percent={percent} 
                size={50} 
                strokeWidth={5}
                label={
                  <span className="text-xs font-bold">
                    <CountUp end={numericValue} duration={1000} suffix={suffix} />
                  </span>
                }
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <i className={`fas ${icon} text-primary`}></i>
            </div>
          )}
          
          <div>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="flex items-center">
              {percent === undefined && (
                <div className="text-xl font-bold text-gray-900 mr-2">
                  <CountUp end={numericValue} duration={1000} suffix={suffix} />
                </div>
              )}
              
              {delta !== undefined && (
                <div className={`text-xs font-medium ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {delta >= 0 ? '↑' : '↓'}{Math.abs(delta)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}