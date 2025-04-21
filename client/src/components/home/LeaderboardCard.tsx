import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { LeaderboardMetric, userStats } from "@/lib/leaderboard-data";

interface MetricCardProps {
  metric: LeaderboardMetric;
  className?: string;
}

const MetricCard = ({ metric, className = "" }: MetricCardProps) => {
  return (
    <div className={`rounded-lg bg-muted/50 p-3 flex items-center ${className}`}>
      <div className="mr-3 flex justify-center items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-lg">
          {metric.icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{metric.title}</div>
        <div className="text-xs text-muted-foreground">
          <span>{metric.value}</span>
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
        <CardTitle className="text-base font-medium mb-3">Global Leaderboard</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <MetricCard metric={userStats.progressRank} />
          <MetricCard metric={userStats.weeklyScore} />
          <MetricCard metric={userStats.monthlyRank} />
        </div>
      </CardContent>
    </Card>
  );
}