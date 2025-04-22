import { createContext, ReactNode, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../components/AuthProvider";
import { apiRequest, getQueryFn } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Current app version - update this when making significant UX changes
// that should trigger the onboarding flow for existing users
export const APP_VERSION = "1.0.0";

type OnboardingStatus = {
  onboarded: boolean;
  lastSeenVersion: string | null;
};

type OnboardingContextType = {
  status: OnboardingStatus | null;
  isLoading: boolean;
  shouldShowOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  updateSeenVersion: () => Promise<void>;
  error: Error | null;
};

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch onboarding status
  const {
    data: status,
    error,
    isLoading,
  } = useQuery<OnboardingStatus, Error>({
    queryKey: ["/api/me/onboarding"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only run query if user is logged in
  });

  // Mutation to update onboarding status
  const onboardingMutation = useMutation({
    mutationFn: async (onboarded: boolean) => {
      const res = await apiRequest("POST", "/api/me/onboarding", { onboarded });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/onboarding"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update onboarding status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to update last seen version
  const versionMutation = useMutation({
    mutationFn: async (version: string) => {
      const res = await apiRequest("POST", "/api/me/version", { version });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/onboarding"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update app version",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Determine if we should show onboarding
  const shouldShowOnboarding = !!user && (
    // Show if user has never completed onboarding
    !status?.onboarded ||
    // Or if there's a new app version that they haven't seen
    (status?.lastSeenVersion !== APP_VERSION)
  );

  // Update version when component mounts if user is logged in
  useEffect(() => {
    if (user && status && status.lastSeenVersion !== APP_VERSION) {
      updateSeenVersion();
    }
  }, [user, status]);

  // Complete onboarding (mark as done)
  const completeOnboarding = async () => {
    await onboardingMutation.mutateAsync(true);
    await versionMutation.mutateAsync(APP_VERSION);
  };

  // Skip onboarding (still mark version as seen)
  const skipOnboarding = async () => {
    await versionMutation.mutateAsync(APP_VERSION);
  };

  // Update seen version
  const updateSeenVersion = async () => {
    await versionMutation.mutateAsync(APP_VERSION);
  };

  return (
    <OnboardingContext.Provider
      value={{
        status: status || null,
        isLoading,
        error,
        shouldShowOnboarding,
        completeOnboarding,
        skipOnboarding,
        updateSeenVersion,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}