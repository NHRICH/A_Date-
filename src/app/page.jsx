"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Coffee, Sparkles, Loader2, Volume2, VolumeX } from "lucide-react"

// Phases
const PHASES = {
  LOADING: 'loading',
  COUNTDOWN: 'countdown',
  PROPOSAL: 'proposal',
  CELEBRATION: 'celebration',
  REJECTION: 'rejection'
}

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(PHASES.LOADING)
  const [isMuted, setIsMuted] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [countdown, setCountdown] = useState(15)
  const [showYesResponse, setShowYesResponse] = useState(false)
  const [teaserIndex, setTeaserIndex] = useState(0)
  const audioRef = useRef(null)
  const countdownInterval = useRef(null)
  const [showReminder, setShowReminder] = useState(false)
  const loadingInterval = useRef(null)

  const teasers = [
    "Decrypting obsession…",
    "Running background checks…",
    "Loading your effect on me…"
  ]

  const countdownMessages = [
    "I've been building this just for one answer…",
    "Don't say yes yet… just feel this first.",
    "When you see it, you'll know why I couldn't just text.",
    "Every moment with you feels like this…",
    "Get ready for something special…"
  ]

  // Initialize audio
  useEffect(() => {
    // Add timestamp to prevent caching
    audioRef.current = new Audio(`/romantic-piano.mp3?t=${Date.now()}`)
    audioRef.current.loop = true
    audioRef.current.volume = 0.1

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])


  // Simulate loading phase
  useEffect(() => {
    if (currentPhase !== PHASES.LOADING) return

    loadingInterval.current = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval.current)
          setTimeout(() => setCurrentPhase(PHASES.COUNTDOWN), 1000)
          return 100
        }
        return prev + (100 / 15) // 15 steps to 100%
      })
    }, 100)

    // Cycle through teasers
    const teaserInterval = setInterval(() => {
      setTeaserIndex(prev => (prev + 1) % teasers.length)
    }, 2000)

    return () => {
      clearInterval(loadingInterval.current)
      clearInterval(teaserInterval)
    }
  }, [currentPhase, teasers.length])

  // Handle countdown phase
  useEffect(() => {
    if (currentPhase !== PHASES.COUNTDOWN) return

    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current)
          setCurrentPhase(PHASES.PROPOSAL)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval.current)
  }, [currentPhase])

  const toggleMute = () => {
    if (!audioRef.current) return
    
    if (isMuted) {
      audioRef.current.volume = 0.1
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    } else {
      audioRef.current.volume = 0
    }
    setIsMuted(!isMuted)
  }

  const handleSendReminder = async () => {
    try {
      await fetch('https://formspree.io/f/mzbnqlbb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: 'Reminder requested' }),
      })
    } catch (e) {
      console.error('reminder failed', e)
    } finally {
      setShowReminder(true)
    }
  }

  const handleYes = () => {
    setCurrentPhase(PHASES.CELEBRATION)
    if (!isMuted) {
      audioRef.current.volume = 0.2 // Slightly increase volume for celebration
    }
  }

  const handleNo = () => {
    setCurrentPhase(PHASES.REJECTION)
  }

  // Render loading phase
  if (currentPhase === PHASES.LOADING) {
    return (
      <div className="min-h-screen flicker-overlay bg-gradient-to-b from-black to-[#1B0032] flex flex-col items-center justify-center text-white p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6 font-serif">Something is unfolding…</h1>
          <p className="text-purple-300 mb-8">For your eyes only.</p>
          
          <div className="h-1 bg-purple-800 rounded-full w-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <motion.p 
            key={teaserIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-purple-400 h-6"
          >
            {teasers[teaserIndex]}
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Render countdown phase
  if (currentPhase === PHASES.COUNTDOWN) {
    const messageIndex = Math.min(
      Math.floor((15 - countdown) / 3),
      countdownMessages.length - 1
    )

    return (
      <div className="min-h-screen flicker-overlay bg-gradient-to-b from-black to-[#1B0032] flex flex-col items-center justify-center text-white p-4 text-center relative overflow-hidden">
        {/* Mute / unmute button */}
        <button onClick={toggleMute} className="absolute top-4 right-4 z-20 text-purple-400 hover:text-pink-400 transition-colors">
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-pink-500/20"
              style={{
                width: Math.random() * 8 + 2,
                height: Math.random() * 8 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50],
                opacity: [0.1, 0.8, 0.1],
                x: [0, (Math.random() - 0.5) * 20],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg mx-auto"
        >
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-xl mb-12 min-h-[4rem] font-serif"
          >
            {countdownMessages[messageIndex]}
          </motion.div>
          
          <motion.div 
            className="text-8xl font-bold mb-8"
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {countdown}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Render proposal phase
  if (currentPhase === PHASES.PROPOSAL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        {/* Rose petals animation */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400 text-2xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${-10}%`,
              opacity: 0.7,
            }}
            animate={{
              y: ['-10%', '110%'],
              rotate: [0, 360],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          >
            ❀
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-auto border border-pink-900/50 shadow-2xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 text-pink-100 font-cormorant italic leading-relaxed"
          >
            <p className="mb-4">I've had this idea in my head...</p>
            <p className="mb-4">It ends with you, across from me, laughing at something I say that isn't even funny.</p>
            <p className="mb-6">And I knew I had to ask:</p>
            <p className="text-xl text-center italic text-pink-300">
              Can I borrow a piece of your evening<br />
              for a night that might just be a little unforgettable?
            </p>
          </motion.div>

          {/* Romantic highlights */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 justify-center mb-8">
            {[
              { title: 'Dinner', icon: <Coffee className="mx-auto w-8 h-8" /> },
              { title: 'Stroll', icon: <Sparkles className="mx-auto w-8 h-8" /> },
              { title: 'Surprise', icon: <Heart className="mx-auto w-8 h-8" /> },
            ].map((c, i) => (
              <div key={i} className="bg-black/30 border border-pink-900/40 rounded-lg p-3 sm:p-4 text-pink-200 flex flex-col items-center shadow-md backdrop-blur-sm w-20 h-16 sm:w-24 sm:h-20 hover:scale-105 transition-transform">
                {c.icon}
                <span className="mt-2 font-medium tracking-wide">{c.title}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleYes}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium text-lg shadow-lg hover:shadow-pink-500/30 transition-all"
            >
              Yes — I like the 11% of you I've seen so far
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNo}
              className="bg-transparent border border-pink-500/30 text-pink-300 py-3 px-6 rounded-full font-medium text-lg hover:bg-pink-500/10 transition-all"
            >
              Maybe — depends if you're bringing coffee or chaos
            </motion.button>
          </div>
        </motion.div>

        {/* Mute toggle */}
        <motion.button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-pink-900/50 text-pink-200 hover:bg-pink-500/20 transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
      </div>
    )
  }

  // Render celebration phase
  if (currentPhase === PHASES.CELEBRATION) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        {/* Confetti effect */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10}%`,
              width: '10px',
              height: '10px',
              backgroundColor: [
                '#FF5252',
                '#FFD740',
                '#69F0AE',
                '#40C4FF',
                '#E040FB',
                '#FF4081',
                '#FFD600',
              ][Math.floor(Math.random() * 7)],
              borderRadius: ['50%', '0%'][Math.floor(Math.random() * 2)],
            }}
            animate={{
              y: ['-10%', '110%'],
              rotate: [0, 360],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-auto border border-pink-900/50 shadow-2xl relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-6xl mb-6 text-pink-400"
          >
            🎉
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You just made my week!
          </motion.h2>
          
          <motion.p 
            className="text-pink-100 mb-8 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            I'll plan something worthy of that yes.
            <br />
            You'll hear from me soon.
          </motion.p>
          
          <motion.p 
            className="text-sm text-pink-300/70 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            I might even wear black — just to match your dark book plots.
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendReminder}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-full font-medium text-lg shadow-lg hover:shadow-pink-500/30 transition-all mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Send me a reminder
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Render rejection phase
  if (currentPhase === PHASES.REJECTION) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-auto border border-pink-900/50 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-6xl mb-6 text-pink-400"
          >
            💔
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fair enough.
          </motion.h2>
          
          <motion.p 
            className="text-pink-100 mb-8 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Good things are worth the wait.
            <br />
            If you change your mind…
            <br />
            this page isn't going anywhere. Neither am I.
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="bg-transparent border border-pink-500/30 text-pink-300 py-3 px-8 rounded-full font-medium text-lg hover:bg-pink-500/10 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Change your mind?
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // This should never be reached, but just in case
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      {isBirthday && <Confetti />}
      <FloatingHearts />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        <motion.div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl shadow-rose-100 p-8 border-2 border-rose-200"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}>
          <AnimatePresence mode="wait">
            {isBirthday ? (
              <BirthdayCelebration key="celebration" />
            ) : (
              <Countdown key="countdown" targetDate={birthdayDate} onCountdownEnd={() => setShowForYouBtn(true)} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {showForYouBtn && <motion.div
        key="start-button"
        className="flex flex-col items-center justify-center mt-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          onClick={startCelebration}
          className="bg-gradient-to-r z-10 from-pink-500 to-purple-500 shadow-lg hover:shadow-xl transition-all rounded-full font-medium text-white py-4 px-8 cursor-pointer border-2 border-white flex items-center gap-3"
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <PartyPopper className="w-6 h-6" />
          <span className="text-xl">For you</span>
          <MoveRight className="w-5 stroke-3 h-6" />
        </motion.button>
      </motion.div>}

      {/* You can change the background song if you want */}
      <audio ref={audioRef} src="/birthday.mp3" preload="auto" loop />

      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {bubbles.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: bubble.left, top: bubble.top }}
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
            }}
          >
            <div
              className={`rounded-full ${bubble.color} opacity-60`}
              style={{ width: `${bubble.size}px`, height: `${bubble.size}px` }}
            />
          </motion.div>
        ))}
      </div>
    </main>
  )
}
