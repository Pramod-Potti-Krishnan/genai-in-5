import { cn } from "@/lib/utils";

type CardVariant = "info" | "quiz" | "topic" | "default";

interface AppCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onClick?: () => void;
  className?: string;
}

export function AppCard({ 
  children, 
  variant = "default", 
  onClick, 
  className 
}: AppCardProps) {
  // Set up variant-specific styling
  const variantStyles = {
    info: "bg-white border border-grey-border",
    quiz: "bg-brand-primary-light border border-brand-primary/20",
    topic: "bg-grey-bg border border-grey-border",
    default: "bg-white border border-grey-border"
  };
  
  return (
    <div 
      className={cn(
        "card p-4 rounded-[var(--radius-standard)]",
        variantStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}