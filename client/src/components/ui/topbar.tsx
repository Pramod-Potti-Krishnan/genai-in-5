import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
      <h1 className="text-lg font-semibold">
        {title}
      </h1>
      <Button
        variant="ghost"
        size="icon"
        className="text-brand-primary"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}