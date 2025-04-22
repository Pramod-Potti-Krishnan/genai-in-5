import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const getTextColor = (path: string) => {
    return isActive(path) ? "text-primary" : "text-gray-500";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center z-20">
      <button 
        className={`flex flex-col items-center justify-center w-1/5 h-full ${getTextColor("/")}`}
        onClick={() => navigate("/")}
        data-tour="home-tab"
      >
        <i className="fas fa-home text-lg"></i>
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-1/5 h-full ${getTextColor("/learn")}`}
        onClick={() => navigate("/learn")}
        data-tour="learn-tab"
      >
        <i className="fas fa-headphones text-lg"></i>
        <span className="text-xs mt-1">Learn</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-1/5 h-full ${getTextColor("/revise")}`}
        onClick={() => navigate("/revise")}
        data-tour="revise-tab"
      >
        <i className="fas fa-pen-to-square text-lg"></i>
        <span className="text-xs mt-1">Revise</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-1/5 h-full ${getTextColor("/trivia")}`}
        onClick={() => navigate("/trivia")}
        data-tour="trivia-tab"
      >
        <i className="fas fa-question text-lg"></i>
        <span className="text-xs mt-1">Trivia</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-1/5 h-full ${getTextColor("/progress")}`}
        onClick={() => navigate("/progress")}
        data-tour="progress-tab"
      >
        <i className="fas fa-chart-simple text-lg"></i>
        <span className="text-xs mt-1">Progress</span>
      </button>
    </nav>
  );
}
