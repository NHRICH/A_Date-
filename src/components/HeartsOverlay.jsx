'use client';

import { useEffect, useState } from 'react';
import HeartFloat from './HeartFloat';

const HEART_IMAGES = [
  '/hearts/pngwing.com (15).png',
  '/hearts/pngwing.com (19).png',
  '/hearts/pngwing.com (21).png',
  '/hearts/pngwing.com (22).png',
  '/hearts/pngwing.com (24).png',
];

export default function HeartsOverlay() {
  const [activeLayer, setActiveLayer] = useState(0);

  // Rotate through heart layers every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % HEART_IMAGES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {HEART_IMAGES.map((src, index) => (
        <div 
          key={src}
          className={`transition-opacity duration-1000 ${index === activeLayer ? 'opacity-100' : 'opacity-0'}`}
        >
          <HeartFloat 
            src={src} 
            count={index === activeLayer ? 8 : 0} // Only animate active layer
            duration={15 + index * 2} // Vary animation speed
          />
        </div>
      ))}
    </div>
  );
}
