import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type ChipColor = "primary" | "success" | "warning" | "error" | "neutral";

interface IconChipProps {
  icon?: LucideIcon;
  text: string;
  color?: ChipColor;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export function IconChip({
  icon: Icon,
  text,
  color = "primary",
  onClick,
  className,
  active = false
}: IconChipProps) {
  // Color variants
  const colorVariants = {
    primary: {
      base: "bg-brand-primary-light text-brand-primary border-brand-primary/20",
      active: "bg-brand-primary text-white border-brand-primary"
    },
    success: {
      base: "bg-accent-success-light text-accent-success border-accent-success/20",
      active: "bg-accent-success text-white border-accent-success"
    },
    warning: {
      base: "bg-accent-warning-light text-accent-warning border-accent-warning/20",
      active: "bg-accent-warning text-white border-accent-warning"
    },
    error: {
      base: "bg-accent-error-light text-accent-error border-accent-error/20",
      active: "bg-accent-error text-white border-accent-error"
    },
    neutral: {
      base: "bg-grey-bg text-grey-text border-grey-border",
      active: "bg-gray-700 text-white border-gray-700"
    }
  };

  // Get the correct color variant based on active state
  const colorStyle = active 
    ? colorVariants[color].active 
    : colorVariants[color].base;

  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
        onClick && "cursor-pointer",
        colorStyle,
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Icon && <Icon className="h-4 w-4 mr-1.5" />}
      <span>{text}</span>
    </div>
  );
}