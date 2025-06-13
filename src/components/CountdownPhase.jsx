'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownPhase({ onComplete }) {
  const [countdown, setCountdown] = useState(15);
  const [currentMessage, setCurrentMessage] = useState(0);
  const particlesRef = useRef(null);

  const messages = [
    "I've been building this just for one answer…",
    "Don't say yes yet… just feel this first.",
    "When you see it, you'll know why I couldn't just text.",
    "Every moment with you feels like this…",
    "Get ready for something special…"
  ];

  // Particle effect setup
  useEffect(() => {
    if (!particlesRef.current) return;

    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    const particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `hsl(${Math.random() * 60 + 320}, 70%, ${Math.random() * 20 + 60}%)`
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Countdown logic
  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);
  
  // Rotate messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a001a] to-[#330033] overflow-hidden">
      {/* Particle Canvas */}
      <canvas 
        ref={particlesRef} 
        className="absolute inset-0 w-full h-full opacity-30"
      />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#4d004d] opacity-30" />
      
      <motion.div 
        className="relative z-10 text-center px-6 max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Rotating Message */}
        <AnimatePresence mode="wait">
          <motion.p 
            key={currentMessage}
            className="text-xl md:text-2xl text-pink-200 mb-8 h-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {messages[currentMessage]}
          </motion.p>
        </AnimatePresence>
        
        {/* Countdown Timer */}
        <motion.div 
          className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {countdown}
        </motion.div>
        
        {/* Subtext */}
        <motion.p 
          className="text-gray-400 mt-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          The moment is almost here...
        </motion.p>
      </motion.div>
    </div>
  );
}
