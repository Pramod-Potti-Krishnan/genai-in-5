import { useEffect, useState } from "react";

interface GreetingBannerProps {
  userName: string;
  firstName?: string;
}

export default function GreetingBanner({ userName, firstName }: GreetingBannerProps) {
  const [timeOfDay, setTimeOfDay] = useState<string>("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "";
    
    if (hour < 12) {
      greeting = "morning";
    } else if (hour < 17) {
      greeting = "afternoon";
    } else {
      greeting = "evening";
    }
    
    setTimeOfDay(greeting);
  }, []);
  
  // If firstName is provided, use it, otherwise extract first name from userName
  const displayName = firstName || userName.split(' ')[0];
  
  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
      <h2 className="text-2xl font-bold text-gray-900">
        Good {timeOfDay}, {displayName} 👋
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Ready to continue your learning journey?
      </p>
    </div>
  );
}