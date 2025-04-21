import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  text: string;
  icon?: LucideIcon;
  rightContent?: React.ReactNode;
}

export function SectionHeader({ text, icon: Icon, rightContent }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        {Icon && <Icon className="h-5 w-5 text-brand-primary mr-2" />}
        <h2 className="title-h2">{text}</h2>
      </div>
      {rightContent && (
        <div className="text-sm text-grey-text">{rightContent}</div>
      )}
    </div>
  );
}