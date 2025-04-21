import { useAuth } from "@/components/AuthProvider";
import { Redirect, useLocation } from "wouter";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in, redirect to auth page with a return path
  if (!user) {
    return <Redirect to={`/auth?returnTo=${encodeURIComponent(location)}`} />;
  }

  // If admin-only and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    return <Redirect to="/" />;
  }

  // Render the protected content
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute adminOnly>{children}</ProtectedRoute>;
}