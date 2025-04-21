import { Link } from "wouter";
import HamburgerMenu from "./HamburgerMenu";
import { Headphones } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full py-3 px-4 border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Headphones className="h-6 w-6 text-primary" />
          <span className="text-xl bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            AudioLearn
          </span>
        </Link>
        
        <HamburgerMenu />
      </div>
    </header>
  );
}