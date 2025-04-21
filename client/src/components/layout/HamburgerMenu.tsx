import { useState } from "react";
import { Menu, X, User, LogOut, Settings, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Profile",
    icon: <User className="h-5 w-5 mr-2" />,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5 mr-2" />,
    path: "/settings",
  },
];

export default function HamburgerMenu() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // For now, just redirect to auth page
    // In the future, this will call the logout API
    setLocation("/auth");
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-9 w-9" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="py-2">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className="w-full justify-between px-4 py-6 h-auto"
              onClick={() => handleNavigation(item.path)}
            >
              <div className="flex items-center">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}

          <Separator className="my-2" />
          
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-6 h-auto text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}