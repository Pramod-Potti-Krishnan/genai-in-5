import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatTileProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  caption?: string;
  className?: string;
  iconClassName?: string;
}

export function StatTile({
  icon: Icon,
  label,
  value,
  caption,
  className,
  iconClassName
}: StatTileProps) {
  return (
    <div className={cn("p-4 bg-white rounded-[var(--radius-standard)] shadow-[var(--shadow-standard)]", className)}>
      <div className="flex items-start">
        {Icon && (
          <div className={cn("p-2 rounded-full bg-brand-primary-light mr-3", iconClassName)}>
            <Icon className="h-5 w-5 text-brand-primary" />
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-sm text-grey-text font-medium mb-1">{label}</p>
          <div className="flex items-baseline">
            <span className="text-xl font-bold">{value}</span>
            {caption && (
              <span className="ml-1 text-xs text-grey-text">{caption}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}