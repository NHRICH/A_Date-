'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function CelebrationPhase() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [petals, setPetals] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio and create petals
  useEffect(() => {
    // Create falling petals
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

    // Only initialize audio on the client side
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/romantic-instrumental.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.2; // 20% volume
      
      // Try to start playing on user interaction
      const handleFirstInteraction = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(e => {
            console.log("Initial autoplay prevented, will try again on button click");
          });
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        }
      };
      
      // Try to start playing immediately (may be blocked by browser)
      audioRef.current.play().catch(e => {
        console.log("Initial autoplay prevented, waiting for user interaction");
      });
      
      // Set up interaction listeners as fallback
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
      
      // Cleanup
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
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
    
    // Try to play audio if not already playing
    if (audioRef.current) {
      try {
        audioRef.current.muted = false;
        await audioRef.current.play();
      } catch (err) {
        console.log("Audio playback error:", err);
      }
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

  // Removed toggleMute function as per requirements

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
  const [showReminderPopup, setShowReminderPopup] = useState(false);

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
              className="text-5xl mb-6"
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
              className="text-3xl md:text-4xl font-bold text-pink-100 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You just made my week.
            </motion.h2>
            
            <motion.p 
              className="text-pink-200 text-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              I'll plan something worthy of that yes.
              <br />
              You'll hear from me soon.
            </motion.p>
            
            <motion.p 
              className="text-sm text-pink-300 italic mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              And I might even wear black — just to match your dark book plots.
            </motion.p>
            
            <motion.button
              onClick={handleSendReminder}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-gray-900 px-8 py-3 rounded-full border border-white border-opacity-30 transition-all text-lg font-medium flex items-center mx-auto gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              Okey
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
                <p className="font-bold text-lg mb-4">You just said yes to trouble. 😏</p>
                <p className="mb-6">I’ll plan something worthy of that answer.<br />Dress cute. I’ll handle the rest.</p>
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
            className="text-2xl md:text-3xl font-bold text-pink-100 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fair enough.
          </motion.h2>
          
          <motion.p 
            className="text-pink-200 mb-8 leading-relaxed text-lg"
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white bg-opacity-5 hover:bg-opacity-10 backdrop-blur-sm text-white px-8 py-3 rounded-full border border-white border-opacity-20 transition-all text-lg font-medium"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">For You</h2>
              <p className="text-gray-600">Tap to open your special message</p>
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
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Will You Go On A Date With Me?
              </h2>
              
              <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent my-6" />
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleConfirmation('yes', e)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Yes, I'd love to! <Heart className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleConfirmation('no', e)}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-full font-medium border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Maybe another time
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Glow effect */}
        <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition duration-300 group-hover:duration-500" />
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#1a001a] via-[#1B0032] to-[#2d0a42]">
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

      {/* Audio Element - Auto-play */}
      <audio ref={audioRef} loop autoPlay>
        <source src="/romantic-instrumental.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      


      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          {renderContent()}
          
          {/* Signature - Only show on main card */}
          {!showConfirmation && (
            <motion.div 
              className="mt-8 text-center text-pink-200 text-sm"
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
