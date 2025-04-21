import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Successfully logged in, the AuthProvider will update
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary mb-2">AudioLearn</h1>
            <p className="text-gray-600">GenAI micro-learning in audio format</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <a href="#" className="text-primary hover:text-blue-700">Forgot password?</a>
            </div>
          </form>
          
          <div className="my-6 relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex justify-center items-center py-2.5"
              onClick={() => {
                toast({
                  title: "Info",
                  description: "Google login not implemented in this demo",
                });
              }}
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              <span className="text-sm font-medium">Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex justify-center items-center py-2.5"
              onClick={() => {
                toast({
                  title: "Info",
                  description: "Facebook login not implemented in this demo",
                });
              }}
            >
              <i className="fab fa-facebook text-blue-600 mr-2"></i>
              <span className="text-sm font-medium">Facebook</span>
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?
              <a href="#" onClick={() => navigate("/register")} className="text-primary font-medium hover:text-blue-700 ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
