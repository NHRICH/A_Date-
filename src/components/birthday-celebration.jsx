'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

// Floating Hearts Component
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const colors = [
      "text-pink-500",
      "text-pink-400",
      "text-pink-300",
      "text-red-400",
      "text-purple-400",
      "text-purple-300",
    ];

    const fills = ["fill-pink-200", "fill-pink-100", "fill-red-100", "fill-purple-100"];

    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 24,
      color: colors[Math.floor(Math.random() * colors.length)],
      fill: fills[Math.floor(Math.random() * fills.length)],
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));

    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Heart className={`w-${Math.round(heart.size)} h-${Math.round(heart.size)} ${heart.color} ${heart.fill} opacity-70`} />
        </motion.div>
      ))}
    </div>
  );
};

// Confetti Component
const Confetti = () => {
  const [confetti, setConfetti] = useState([]);
  const [isActive, setIsActive] = useState(false);

  // Function to trigger confetti
  const triggerConfetti = () => {
    if (isActive) return; // Prevent multiple triggers
    setIsActive(true);
    
    const colors = [
      "bg-rose-500",
      "bg-purple-500",
      "bg-yellow-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-red-400",
      "bg-pink-300",
      "bg-purple-300",
    ];

    const shapes = ["rounded-full", "rounded", "rounded-sm", "heart-shape"];

    const newConfetti = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 10,
      size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    }));

    setConfetti(newConfetti);

    // Auto-clear confetti after animation
    const timer = setTimeout(() => {
      setConfetti([]);
      setIsActive(false);
    }, 10000);

    return () => clearTimeout(timer);
  };

  // Expose the trigger function to parent
  useEffect(() => {
    window.triggerConfetti = triggerConfetti;
    return () => {
      delete window.triggerConfetti;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.color} ${piece.shape === "heart-shape" ? "heart" : piece.shape}`}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [
              `${piece.x}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
              `${piece.x + (Math.random() * 20 - 10)}%`,
            ],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const ConfettiTrigger = ({ trigger }) => {
  useEffect(() => {
    if (trigger && typeof window !== 'undefined' && window.triggerConfetti) {
      window.triggerConfetti();
    }
  }, [trigger]);

  return <Confetti />;
};

export default function CelebrationPhase() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [petals, setPetals] = useState([]);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHearts, setShowHearts] = useState(true); // Always show floating hearts in the background

  // Create falling petals
  useEffect(() => {
    const createPetals = () => {
      const newPetals = [];
      const petalCount = 30;
      
      for (let i = 0; i < petalCount; i++) {
        newPetals.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 10,
          size: Math.random() * 12 + 8,
          opacity: 0.3 + Math.random() * 0.7
        });
      }
      
      setPetals(newPetals);
    };

    createPetals();
  }, []);

  const handleCardOpen = (e) => {
    e?.stopPropagation?.();
    if (!isCardOpen) {
      setIsCardOpen(true);
    }
  };

  const handleConfirmation = async (response, e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    
    // Update the UI immediately
    setShowConfirmation(response);
    
    // Trigger confetti for 'yes' response
    if (response === 'yes') {
      setShowConfetti(true);
      // Auto-hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    return false;
  };

  // Send reminder via Formspree
  const handleSendReminder = async () => {
    try {
      await fetch('https://formspree.io/f/mzbnqlbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: 'She said yes!' })
      });
    } catch (err) {
      console.error('Reminder submission failed:', err);
    } finally {
      setShowReminderPopup(true);
    }
  };

  // Create floating hearts for celebration
  const createHearts = () => {
    const hearts = [];
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
        size: 8 + Math.random() * 16,
        opacity: 0.4 + Math.random() * 0.6
      });
    }
    
    return hearts;
  };

  const [hearts] = useState(createHearts());

  // Render different content based on user response
  const renderContent = () => {
    if (showConfirmation === 'yes') {
      return (
        <div className="relative w-full h-full">
          {/* Floating Hearts */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {hearts.map((heart) => (
              <motion.div
                key={`heart-${heart.id}`}
                className="absolute text-pink-400"
                style={{
                  left: heart.left,
                  top: '110%',
                  fontSize: `${heart.size}px`,
                  opacity: heart.opacity,
                }}
                animate={{
                  y: ['0%', '-200%'],
                  x: [
                    '0px',
                    `${Math.random() * 100 - 50}px`,
                    `${Math.random() * 100 - 50}px`
                  ],
                  opacity: [0.8, 0.9, 0],
                }}
                transition={{
                  duration: heart.duration,
                  delay: heart.delay,
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.8, 1]
                }}
              >
                💗
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center max-w-md mx-auto p-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-5xl mb-6 font-cormorant"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              💗
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-pink-100 mb-6 font-cormorant"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You just made my week.
            </motion.h2>
            
            <motion.p 
              className="text-pink-200 text-lg mb-8 leading-relaxed font-lato"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              I'll plan something worthy of that yes.
              <br />
              You'll hear from me soon.
            </motion.p>
            
            <motion.p 
              className="text-sm text-pink-300 italic mb-10 font-lato"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              And I might even wear black — just to match your dark book plots.
            </motion.p>
            
            <motion.button
              onClick={handleSendReminder}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-gray-900 px-8 py-3 rounded-full border border-white border-opacity-30 transition-all text-lg font-medium flex items-center mx-auto gap-2 font-lato"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Send me a reminder
              <span className="text-xl">→</span>
            </motion.button>
          </motion.div>
          {showReminderPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20"
            >
              <div className="bg-white rounded-xl p-6 max-w-sm text-center text-gray-800">
                <p className="font-bold text-lg mb-4 font-cormorant">I've got you.</p>
                <p className="mb-4 font-lato">I’ll nudge you gently — just before our maybe-night-to-remember.</p>
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={() => setShowReminderPopup(false)}
                  className="mt-2 px-6 py-2 bg-pink-500 text-white rounded-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    if (showConfirmation === 'no') {
      return (
        <motion.div 
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-4xl mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌹
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-pink-100 mb-6 font-cormorant"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fair enough.
          </motion.h2>
          
          <motion.p 
            className="text-pink-200 mb-8 leading-relaxed text-lg font-lato"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Good things are worth the wait.
            <br />
            If you change your mind…
            <br />
            this page isn't going anywhere.
            <br />
            Neither am I.
          </motion.p>
          
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white bg-opacity-5 hover:bg-opacity-10 backdrop-blur-sm text-white px-8 py-3 rounded-full border border-white border-opacity-20 transition-all text-lg font-medium font-lato"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Change your mind?
          </motion.button>
        </motion.div>
      );
    }

    // Main card content
    return (
      <motion.div
        className={`relative cursor-pointer transition-all duration-700 ease-in-out transform ${isCardOpen ? 'rotate-0' : 'rotate-2 hover:rotate-0 hover:scale-105'}`}
        onClick={handleCardOpen}
        whileHover={!isCardOpen ? { scale: 1.02 } : {}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-2xl border-2 border-pink-200 transition-all ${isCardOpen ? 'scale-95' : 'scale-100'}`}
          initial={{ rotate: 0 }}
          animate={{
            rotate: isCardOpen ? 0 : 2,
            boxShadow: isCardOpen 
              ? '0 25px 50px -12px rgba(236, 72, 153, 0.25)' 
              : '0 10px 25px -5px rgba(236, 72, 153, 0.1)'
          }}
        >
          {!isCardOpen ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="flex justify-center mb-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-16 h-16 text-pink-500 fill-pink-500/20" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-cormorant">For You</h2>
              <p className="text-gray-600 font-lato">Tap to open your special message</p>
            </motion.div>
          ) : (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 font-cormorant text-shadow-sm">
                Will You Go On A Date With Me?
              </h2>
              
              <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent my-6" />
              
              <div className="space-y-6 text-gray-700 leading-relaxed font-lato text-shadow-sm">
                <p className="italic">
                  I've had this idea in my head...
                  <br />
                  It ends with you, across from me, laughing at something I say that isn't even funny.
                </p>
                
                <p>
                  And I knew I had to ask:
                  <br />
                  <span className="text-lg font-medium text-pink-600">Can I borrow a piece of your evening</span>
                  <br />
                  <span className="text-lg font-medium text-pink-600">for a night that might just be a little unforgettable?</span>
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(215, 38, 56, 0.3), 0 4px 6px -2px rgba(215, 38, 56, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleConfirmation('yes', e)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-lato"
                >
                  Yes, I'd love to! <Heart className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleConfirmation('no', e)}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-full font-medium border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 font-lato"
                >
                  Maybe another time
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Glow effect */}
        <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl opacity-20 blur-lg transition duration-300 group-hover:opacity-30 group-hover:duration-500" />
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#0A0011] to-[#300022]">
      {/* Background Effects */}
      {showHearts && <FloatingHearts />}
      {showConfetti && <ConfettiTrigger trigger={showConfetti} />}
      
      {/* Falling Petals */}
      <div className="absolute inset-0 overflow-hidden">
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute text-pink-300"
            style={{
              left: petal.left,
              top: `-${petal.size}px`,
              fontSize: `${petal.size}px`,
              opacity: petal.opacity,
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              rotate: [0, 360],
            }}
            transition={{
              y: {
                duration: petal.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: petal.delay,
              },
              rotate: {
                duration: petal.duration * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: petal.delay,
              },
            }}
          >
            ❀
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          {renderContent()}
          
          {/* Signature - Only show on main card */}
          {!showConfirmation && (
            <motion.div 
              className="mt-8 text-center text-pink-200 text-sm font-lato"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
            >
              Made with ❤️ just for you
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
