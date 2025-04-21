import { useState } from "react";
import { useLocation } from "wouter";
import { useAppContext } from "@/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterForm() {
  const [location, setLocation] = useLocation();
  const { register } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!termsAccepted) {
      setError("You must accept the terms of service");
      return;
    }
    
    try {
      register(name, email, password);
      setLocation("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
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
        <Label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          Full name
        </Label>
        <div className="mt-2">
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="block w-full rounded-md py-2 px-3"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="register-email" className="block text-sm font-medium leading-6 text-gray-900">
          Email address
        </Label>
        <div className="mt-2">
          <Input
            id="register-email"
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
        <Label htmlFor="register-password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
        </Label>
        <div className="mt-2">
          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="block w-full rounded-md py-2 px-3"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm text-gray-900">
          I agree to the{" "}
          <a href="#" className="font-semibold text-primary-500 hover:text-primary-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold text-primary-500 hover:text-primary-400">
            Privacy Policy
          </a>
        </Label>
      </div>

      <div>
        <Button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-6 text-sm font-semibold text-white shadow-sm hover:bg-primary-400"
        >
          Create account
        </Button>
      </div>
    </form>
  );
}
