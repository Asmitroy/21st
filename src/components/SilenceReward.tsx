import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { silencePoems } from "../data/content";

interface Props {
  isActive: boolean;
  onExit: () => void;
}

export default function SilenceReward({ isActive, onExit }: Props) {
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    setCurrentPoemIndex(0);
    const rotationInterval = setInterval(() => {
      setCurrentPoemIndex((prev) => (prev + 1) % silencePoems.length);
    }, 7000);

    return () => clearInterval(rotationInterval);
  }, [isActive]);

  const currentPoem = silencePoems[currentPoemIndex];

  // Sparkle burst trigger when poem changes
  const [sparkleTrigger, setSparkleTrigger] = useState(false);
  const sparkleOffsetsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    // prepare random offsets once
    if (sparkleOffsetsRef.current.length === 0) {
      sparkleOffsetsRef.current = [...Array(12)].map(() => ({
        x: (Math.random() - 0.5) * 240,
        y: -Math.random() * 120 - 20,
      }));
    }
  }, []);

  useEffect(() => {
    // trigger a quick sparkle burst on poem change
    if (!isActive) return;
    setSparkleTrigger(true);
    const t = setTimeout(() => setSparkleTrigger(false), 900);
    return () => clearTimeout(t);
  }, [currentPoemIndex, isActive]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onExit();
      setIsExiting(false);
    }, 1200);
  };

  // Diagnostics: log layout and computed styles when active
  useEffect(() => {
    if (!isActive) return;
    console.log("[SilenceReward] Rendering overlay - isActive=true");
    const el = overlayRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      console.log("[SilenceReward] overlay rect:", rect);
      console.log("[SilenceReward] overlay computed styles:", {
        position: style.position,
        zIndex: style.zIndex,
        display: style.display,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
      });
    } else {
      console.log("[SilenceReward] overlayRef is null");
    }
    const bodyRect = document.body.getBoundingClientRect();
    console.log("[SilenceReward] body rect:", bodyRect);
  }, [isActive]);

  const overlay = (
    <AnimatePresence>
      {isActive && (
        <div
          ref={overlayRef}
          onClick={handleExit}
          onTouchStart={handleExit}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            opacity: 1,
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 10000,
              textAlign: "center",
              padding: "0 2rem",
              maxWidth: 640,
            }}
          >
            <motion.div
              key={currentPoemIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "white",
                  lineHeight: 1.4,
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 300,
                }}
              >
                {currentPoem.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < currentPoem.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </motion.div>

            <div
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.8)",
                fontSize: 12,
              }}
            >
              Move to return
            </div>
          </div>

          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {/* continuous gentle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`gentle-${i}`}
                initial={{ opacity: 0, y: -20 }}
                animate={
                  isExiting
                    ? { opacity: [0.9, 0.6, 0], y: 800 }
                    : { opacity: [0.2, 0, 0], y: 200 }
                }
                transition={
                  isExiting
                    ? { delay: i * 0.06, duration: 1.1 }
                    : {
                        delay: i * 0.2,
                        duration: 4 + i * 0.2,
                        repeat: Infinity,
                      }
                }
                style={{
                  position: "absolute",
                  width: 7 + (i % 3),
                  height: 7 + (i % 3),
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.45)",
                  left: `${(i * 13) % 100}%`,
                  top: -10 - i * 6,
                }}
              />
            ))}

            {/* sparkle burst on poem change */}
            {sparkleOffsetsRef.current.map((off, i) => (
              <motion.span
                key={`spark-${i}`}
                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                animate={
                  sparkleTrigger
                    ? {
                        opacity: [1, 1, 0],
                        scale: [1.2, 1, 0],
                        x: off.x,
                        y: off.y,
                      }
                    : { opacity: 0, scale: 0.2, x: 0, y: 0 }
                }
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background:
                    "radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.15) 70%)",
                  transform: "translate(-50%,-50%)",
                  pointerEvents: "none",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
