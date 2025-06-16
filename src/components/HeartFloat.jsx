"use client";
import { useEffect, useState } from "react";

/**
 * HeartFloat component – renders subtle floating PNG hearts.
 *
 * Props:
 *  - src: string – path to PNG asset (e.g. "/hearts/pngwing.com (11).png")
 *  - count?: number – how many hearts to generate over time (default 10)
 *  - duration?: number – total seconds each heart takes to float up (default 15)
 *
 * Usage:
 *  <HeartFloat src="/hearts/pngwing.com (11).png" count={8} duration={12} />
 */
export default function HeartFloat({ src, count = 10, duration = 15 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Emit `count` hearts over time (one every ~duration/count seconds)
    const interval = setInterval(() => {
      const id = Math.random().toString(36).slice(2);
      const left = Math.random() * 100; // percentage
      const size = Math.random() * 40 + 20; // px 20–60

      setHearts((h) => [...h, { id, left, size }]);

      // Remove heart after it finishes its animation
      setTimeout(() => {
        setHearts((h) => h.filter((heart) => heart.id !== id));
      }, duration * 1000);
    }, (duration * 1000) / count);

    return () => clearInterval(interval);
  }, [count, duration]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {hearts.map(({ id, left, size }) => (
        <img
          key={id}
          src={src}
          alt="heart"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: "auto",
            animation: `float-up ${duration}s linear`,
            position: "absolute",
            bottom: -50,
          }}
          className="opacity-70 select-none" // ensure no interaction
        />
      ))}
    </div>
  );
}
