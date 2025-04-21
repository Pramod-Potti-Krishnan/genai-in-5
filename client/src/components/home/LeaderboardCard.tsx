import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LeaderboardMetric, userStats } from "@/lib/leaderboard-data";
import { CountUp } from "@/components/ui/count-up";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useEffect, useState } from "react";

interface MetricCardProps {
  metric: LeaderboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className = "" }: MetricCardProps) => {
  // Calculate random progress values for the background ring (60-90%)
  const [ringProgress, setRingProgress] = useState(75);
  
  useEffect(() => {
    // Generate a random value for the background ring between 60-90%
    setRingProgress(Math.floor(Math.random() * 30) + 60);
  }, []);

  // Parse the numeric value for CountUp component
  const numericValue = typeof metric.value === 'string' 
    ? parseInt(metric.value.replace(/[^0-9]/g, '')) 
    : metric.value;

  return (
    <div className={`rounded-lg bg-muted/50 p-3 flex items-center min-w-[150px] flex-shrink-0 ${className}`}>
      <div className="mr-3 flex justify-center items-center">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <ProgressRing 
            percent={ringProgress} 
            size={40} 
            strokeWidth={3} 
            progressColor="var(--primary)"
          />
          <div className="absolute inset-0 flex items-center justify-center text-primary text-lg">
            {metric.icon}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{metric.title}</div>
        <div className="text-xs text-muted-foreground">
          <CountUp 
            end={numericValue} 
            duration={1000}
            prefix={typeof metric.value === 'string' && metric.value.startsWith('$') ? '$' : ''}
            suffix={typeof metric.value === 'string' && metric.value.endsWith('h') ? 'h' : ''}
          />
        </div>
        <div className="text-xs font-semibold text-primary">Top {metric.rank}%</div>
      </div>
    </div>
  );
};

export default function LeaderboardCard() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/progress");
  };

  return (
    <Card className="mb-4 overflow-hidden" onClick={handleClick}>
      <CardContent className="p-4">
        <CardTitle className="text-base font-medium mb-3">
          <span className="inline-flex items-center">
            <span className="icon mr-2">🏆</span>
            Global Leaderboard
          </span>
        </CardTitle>
        <div className="flex overflow-x-auto space-x-3 pb-2 carousel touch-action-pan-x">
          <MetricCard metric={userStats.progressRank} />
          <MetricCard metric={userStats.weeklyScore} />
          <MetricCard metric={userStats.monthlyRank} />
        </div>
      </CardContent>
    </Card>
  );
}