"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface LabCanvasProps {
  scrollYProgress: MotionValue<number>;
}

const TOTAL_FRAMES = 790;

export default function LabCanvas({ scrollYProgress }: LabCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];
    let isMounted = true;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      // frame_0001.webp format
      const frameNum = i.toString().padStart(4, "0");
      img.src = `/sequence/frame_${frameNum}.webp`;
      
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoaded(loadedCount);
        if (loadedCount === TOTAL_FRAMES) {
          setIsFullyLoaded(true);
        }
      };
      
      imgArray.push(img);
    }
    
    setImages(imgArray);

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw frame helper
  const drawImage = (index: number) => {
    if (!canvasRef.current || !images[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    
    // Maintain aspect ratio while covering the canvas (object-fit: cover equivalent)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;

    const scale = Math.max(cw / iw, ch / ih);
    const x = (cw / 2) - (iw / 2) * scale;
    const y = (ch / 2) - (ih / 2) * scale;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
  };

  // Handle Resize
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Redraw current frame
        const currentFrame = Math.floor(scrollYProgress.get() * (TOTAL_FRAMES - 1));
        if (isFullyLoaded) drawImage(currentFrame);
      }
    };
    
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, [isFullyLoaded, scrollYProgress]);

  // Initial draw once loaded
  useEffect(() => {
    if (isFullyLoaded) {
      drawImage(0);
    }
  }, [isFullyLoaded]);

  // Sync draw with scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isFullyLoaded) return;
    const frameIndex = Math.floor(latest * (TOTAL_FRAMES - 1));
    requestAnimationFrame(() => drawImage(frameIndex));
  });

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
      {/* Loading State */}
      {!isFullyLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div className="w-64 relative flex flex-col items-center">
            {/* High-tech spinner */}
            <div className="w-16 h-16 border-2 border-white/10 border-t-[#00d2ff] rounded-full animate-spin mb-8" />
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-[#00d2ff] to-[#00ff87] transition-all duration-300 ease-out"
                style={{ width: `${(loaded / TOTAL_FRAMES) * 100}%` }}
              />
            </div>
            
            <div className="text-white/50 text-xs tracking-[0.2em] font-mono">
              SYSTEM INITIALIZING [{Math.floor((loaded / TOTAL_FRAMES) * 100)}%]
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas 
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-1000 ${isFullyLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Optional Gradient Overlay to ensure text legibility and fade edges into the void */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505] pointer-events-none" />
    </div>
  );
}
