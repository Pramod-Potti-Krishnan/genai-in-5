import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
  className = ""
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const step = (timestamp: number) => {
      if (!timeRef.current) {
        timeRef.current = setTimeout(() => {
          const totalSteps = 25; // frames
          const stepTime = duration / totalSteps;
          const stepValue = (end - start) / totalSteps;
          
          countRef.current += stepValue;
          
          if (countRef.current >= end) {
            countRef.current = end;
            setCount(end);
            timeRef.current = null;
            return;
          }
          
          setCount(countRef.current);
          timeRef.current = setTimeout(() => step(timestamp + stepTime), stepTime);
        }, 0);
      }
    };
    
    step(0);
    
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [end, start, duration]);
  
  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const [integer, decimal] = fixed.split('.');
    
    // Add separator to integer part
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    // Combine everything
    return `${prefix}${formattedInteger}${decimal ? `.${decimal}` : ''}${suffix}`;
  };
  
  return <span className={className}>{formatNumber(count)}</span>;
}