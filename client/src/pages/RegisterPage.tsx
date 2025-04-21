import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "You must accept the terms of service",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await register(name, email, password);
      // Successfully registered, the AuthProvider will update
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not create account",
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-gray-600">Start your learning journey today</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                type="email"
                id="register-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                type="password"
                id="register-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the <a href="#" className="text-primary hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-primary hover:text-blue-700">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?
              <a href="#" onClick={() => navigate("/")} className="text-primary font-medium hover:text-blue-700 ml-1">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
