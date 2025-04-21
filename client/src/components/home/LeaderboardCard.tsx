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
        {metric.title === "Progress Rank" ? (
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-muted-foreground/20"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-primary"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - (metric.current! / metric.total!) * 100}
                transform="rotate(-90 18 18)"
              />
              <text
                x="18"
                y="18"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-xs font-bold fill-primary"
              >
                {metric.icon}
              </text>
            </svg>
          </div>
        ) : metric.title === "Mastery Score" ? (
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">{metric.icon}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-2 h-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= Math.floor(metric.value as number) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-2 h-2 ${
                      star <= Math.floor(metric.value as number)
                        ? "text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-lg">
            {metric.icon}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{metric.title}</div>
        <div className="text-xs text-muted-foreground">
          {metric.title === "Progress Rank" ? (
            <span>
              {metric.current}/{metric.total} audibles
            </span>
          ) : metric.title === "Mastery Score" ? (
            <span>{metric.value}/5</span>
          ) : (
            <span>{metric.value} topics</span>
          )}
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