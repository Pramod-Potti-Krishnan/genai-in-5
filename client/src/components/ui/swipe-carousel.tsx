import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface SwipeCarouselProps {
  children: ReactNode;
  className?: string;
  gap?: number; // Gap between items in pixels
  itemWidth?: number | string; // Width of items (px or %)
  snapAlign?: 'start' | 'center' | 'end';
}

export function SwipeCarousel({
  children,
  className = '',
  gap = 16,
  itemWidth = 'auto',
  snapAlign = 'start'
}: SwipeCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Configure keyboard navigation
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carousel.contains(document.activeElement)) return;
      
      const SCROLL_AMOUNT = 200; // Amount to scroll with arrow keys
      
      switch (e.key) {
        case 'ArrowRight':
          carousel.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          carousel.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
          e.preventDefault();
          break;
      }
    };
    
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', handleKeyDown);
    
    return () => {
      carousel.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Handle mouse events for desktop dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  };
  
  // Determine snap alignment class
  const getSnapAlignClass = () => {
    switch(snapAlign) {
      case 'center': return 'snap-center';
      case 'end': return 'snap-end';
      default: return 'snap-start';
    }
  };
  
  return (
    <div 
      ref={carouselRef}
      className={`
        flex overflow-x-auto scrollbar-hide touch-pan-x
        snap-x snap-mandatory
        ${className}
      `}
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        gap: `${gap}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Scrollable content"
    >
      {React.Children.map(children, (child) => (
        <div 
          className={`flex-shrink-0 ${getSnapAlignClass()}`}
          style={{ width: typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}