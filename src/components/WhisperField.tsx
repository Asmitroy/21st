import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { whispers as defaultWhispers } from "../data/content";

interface Props {
  whispers?: string[];
  count?: number;
}

export default function WhisperField({
  whispers = defaultWhispers,
  count = 14,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      text: whispers[Math.floor(Math.random() * whispers.length)],
      top: Math.random() * 92 + 2,
      left: Math.random() * 92 + 2,
      size: 0.9 + Math.random() * 1.6,
      delay: Math.random() * 12,
      duration: 35 + Math.random() * 35,
      opacity: 0.35 + Math.random() * 0.6,
    }));
  }, [whispers, count]);

  useEffect(() => {
    const onVisibility = () => {
      /* no-op: framer-motion respects prefers-reduced-motion and document visibility */
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      {items.map((it, i) => (
        <motion.span
          key={i}
          className="absolute text-rose-900/65 select-none"
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            fontSize: `${it.size}rem`,
            opacity: it.opacity,
            transform: "translate3d(-50%, -50%, 0)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: it.opacity, y: -40 }}
          transition={{
            delay: it.delay,
            duration: it.duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          {it.text}
        </motion.span>
      ))}
    </div>
  );
}
