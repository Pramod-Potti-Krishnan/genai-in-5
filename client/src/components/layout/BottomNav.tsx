import { Link, useLocation } from "wouter";
import { 
  Home, 
  Headphones, 
  BookOpen, 
  HelpCircle, 
  BarChart3 
} from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string): boolean => {
    // For the home page
    if (path === "/" && location === "/") return true;
    
    // For other pages, check if the location starts with the path
    // (except for the root path which we already checked)
    if (path !== "/" && location.startsWith(path)) return true;
    
    return false;
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/learn", label: "Learn", icon: Headphones },
    { path: "/revise", label: "Revise", icon: BookOpen },
    { path: "/trivia", label: "Trivia", icon: HelpCircle },
    { path: "/progress", label: "Progress", icon: BarChart3 }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} href={path}>
            <a className={`flex flex-col items-center justify-center px-3 h-14 text-sm font-medium 
              ${isActive(path) ? 'text-primary-500' : 'text-gray-500'}`}>
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
