import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  isActive: boolean;
  duration?: number; // ms
  onComplete: () => void;
}

export default function SequenceTransition({
  isActive,
  duration = 1200,
  onComplete,
}: Props) {
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => onComplete(), duration);
    return () => clearTimeout(t);
  }, [isActive, duration, onComplete]);

  // Debug logs to verify activation in Chrome/Edge consoles
  useEffect(() => {
    if (isActive) {
      console.log("[SequenceTransition] Activated");
    } else {
      console.log("[SequenceTransition] Deactivated");
    }
  }, [isActive]);

  const overlay = (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration / 1000 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            // Avoid blend modes for Chrome consistency
            backgroundColor: "rgba(0,0,0,0.9)",
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
          }}
        >
          {/* Debug badge to confirm overlay is mounted */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              color: "#fff",
              fontSize: 12,
              background: "rgba(255,105,180,0.25)",
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            Transition Active
          </div>
          {/* Visibility booster: quick white fade layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          />

          {/* Roaming pink dots (Chrome-safe) */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            {[...Array(24)].map((_, i) => {
              const left = 50 + (Math.random() - 0.5) * 80; // %
              const top = 50 + (Math.random() - 0.5) * 60; // %
              const dx = (Math.random() - 0.5) * 80; // px drift
              const dy = (Math.random() - 0.5) * 60; // px drift
              const size = 3 + Math.random() * 4;
              const delay = Math.random() * 0.1;
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.9 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: dx,
                    y: dy,
                    scale: [0.9, 1.05, 1],
                  }}
                  transition={{ duration: duration / 1000, delay, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: size,
                    height: size,
                    borderRadius: 9999,
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,182,193,1), rgba(255,105,180,0.9) 40%, rgba(255,105,180,0.2) 80%)",
                    boxShadow: "0 0 10px rgba(255,105,180,0.6)",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              );
            })}
          </div>
          {/* Center bloom */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 3.2, opacity: 0.28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 9999,
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95), rgba(255,255,255,0.7) 35%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0))",
              boxShadow: "0 0 80px rgba(255,255,255,0.7)",
              filter: "blur(0.3px)",
            }}
          />

          {/* Diagonal sweep lines */}
          <motion.div
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 1, 0] }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "40%",
              left: 0,
              width: "50%",
              height: 4,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))",
              transform: "rotate(20deg)",
              borderRadius: 9999,
              willChange: "transform, opacity",
            }}
          />
          <motion.div
            initial={{ x: "120%", opacity: 0 }}
            animate={{ x: "-120%", opacity: [0, 1, 0] }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "60%",
              left: 0,
              width: "45%",
              height: 3,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))",
              transform: "rotate(-18deg)",
              borderRadius: 9999,
              willChange: "transform, opacity",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
