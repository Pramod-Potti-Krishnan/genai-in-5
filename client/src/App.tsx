import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Learn from "@/pages/learn";
import AudioPlayer from "@/pages/audio-player";
import Revise from "@/pages/revise";
import Trivia from "@/pages/trivia";
import Progress from "@/pages/progress";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import BottomNav from "@/components/layout/BottomNav";
import MiniPlayer from "@/components/layout/MiniPlayer";
import { AppProvider } from "./app-context";
import { useAppContext } from "./app-context";

function AppRoutes() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-14">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/audio/:id" component={AudioPlayer} />
        <Route path="/revise" component={Revise} />
        <Route path="/trivia" component={Trivia} />
        <Route path="/progress" component={Progress} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
      <MiniPlayer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
