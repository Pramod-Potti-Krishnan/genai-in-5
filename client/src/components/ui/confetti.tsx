import { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number; // in milliseconds
}

export function ConfettiEffect({ active, duration = 2000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  // Creates a single confetti particle
  class Particle {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    rotation: number;
    speed: number;
    velocity: { x: number; y: number };
    
    constructor(canvas: HTMLCanvasElement) {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * 100;
      this.width = Math.random() * 10 + 5;
      this.height = Math.random() * 4 + 2;
      this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
      this.rotation = Math.random() * 360;
      this.speed = Math.random() * 3 + 1;
      this.velocity = {
        x: Math.random() * 2 - 1,
        y: this.speed
      };
    }
    
    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.rotation += Math.random() * 10;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }
  
  // Create confetti effect
  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(canvas));
    }
    particlesRef.current = particles;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Stop after duration
    const timeout = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, duration);
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timeout);
    };
  }, [active, duration]);
  
  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}