import React, { useRef, useState, useEffect, Children, cloneElement, ReactElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  snap?: boolean;
  itemGap?: number; // Gap in pixels
}

export function Carousel({
  children,
  className,
  containerClassName,
  snap = true,
  itemGap = 16,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // Add event listeners
  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) return;

    const handleMouseUp = () => stopDrag();
    const handleMouseLeave = () => stopDrag();
    const handleTouchEnd = () => stopDrag();

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Apply consistent gap styling to child elements
  const childrenWithGap = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    
    return cloneElement(child as ReactElement, {
      style: {
        ...((child as ReactElement).props.style || {}),
        marginRight: `${itemGap}px`,
      },
    });
  });

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide",
          snap && "scroll-snap-type-x mandatory",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {childrenWithGap}
        {/* Add empty div at the end to allow scrolling to the last item fully */}
        <div style={{ minWidth: `${itemGap}px`, height: '1px' }}></div>
      </div>
    </div>
  );
}

// Optional child component for consistent items
interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CarouselItem({ children, className, style }: CarouselItemProps) {
  return (
    <div 
      className={cn("flex-shrink-0 scroll-snap-align-start", className)} 
      style={style}
    >
      {children}
    </div>
  );
}