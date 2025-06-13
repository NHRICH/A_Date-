'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MysteryLoader({ onComplete }) {
  const [currentText, setCurrentText] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const loadingTexts = [
    "Running background checks…",
    "Decrypting obsession…",
    "Loading your effect on me…",
    "Preparing something special…",
    "Almost there…"
  ];

  useEffect(() => {
    // Text rotation effect
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 800); // Slight delay for smooth transition
          return 100;
        }
        return prev + 1;
      });
    }, 70); // ~7 seconds total

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-black to-[#36013F] overflow-hidden">
      {/* Shimmer/Glow Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]" />
      </div>

      <motion.div 
        className="text-center px-6 z-10 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Something is unfolding...
        </motion.h1>
        
        <motion.p 
          className="text-gray-300 text-sm mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          For your eyes only.
        </motion.p>

        {/* Loading Bar */}
        <motion.div 
          className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 7, ease: 'easeInOut' }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Rotating Text */}
        <motion.div 
          className="h-8 text-pink-200 text-sm font-medium"
          key={currentText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {loadingTexts[currentText]}
        </motion.div>
      </motion.div>
    </div>
  );
}
