import { useState, useEffect } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  end,
  duration = 1000,
  decimals = 0,
  prefix = "",
  suffix = ""
}: CountUpProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    window.requestAnimationFrame(step);
    
    return () => {
      startTimestamp = null;
    };
  }, [end, duration]);
  
  const formatNumber = (num: number) => {
    return prefix + num.toFixed(decimals) + suffix;
  };
  
  return <span>{formatNumber(count)}</span>;
}