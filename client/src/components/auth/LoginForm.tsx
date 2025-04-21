import { useState } from "react";
import { useLocation } from "wouter";
import { useAppContext } from "@/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Facebook } from "lucide-react";

export default function LoginForm() {
  const [location, setLocation] = useLocation();
  const { login } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      login(email, password);
      setLocation("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-red-800 text-sm">
            {error}
          </CardContent>
        </Card>
      )}
      
      <div>
        <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email address
        </Label>
        <div className="mt-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="block w-full rounded-md py-2 px-3"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </Label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-primary-500 hover:text-primary-400">
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="block w-full rounded-md py-2 px-3"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-6 text-sm font-semibold text-white shadow-sm hover:bg-primary-400"
        >
          Sign in
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-3">
            <Search className="h-5 w-5" />
            Search
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-3">
            <Facebook className="h-5 w-5" />
            Facebook
          </Button>
        </div>
      </div>
    </form>
  );
}
