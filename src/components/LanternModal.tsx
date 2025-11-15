import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LanternModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  isRevelation?: boolean;
  revealMessage?: string;
}

export const LanternModal = ({
  isOpen,
  title,
  content,
  onClose,
  isRevelation,
  revealMessage,
}: LanternModalProps) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText("");
      return;
    }

    let currentIndex = 0;
    // Revelation lanterns have slower typewriter effect
    const speed = isRevelation ? 30 : 20;
    const timer = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedText(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isOpen, content, isRevelation]);

  // Falling petals effect
  const petals = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: i * 0.1,
    duration: 2 + Math.random() * 1,
    xOffset: (Math.random() - 0.5) * 100,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto"
          >
            {/* Petal animations */}
            {petals.map((petal) => (
              <motion.div
                key={`petal-${petal.id}`}
                className="absolute w-2 h-2 rounded-full opacity-20"
                style={{
                  background: `rgba(${244}, ${63}, ${94}, 0.6)`,
                  left: `${50 + (Math.random() - 0.5) * 30}%`,
                  top: "-10px",
                }}
                animate={{
                  y: window.innerHeight + 50,
                  x: petal.xOffset,
                  opacity: 0,
                }}
                transition={{
                  duration: petal.duration,
                  delay: petal.delay,
                  ease: "easeIn",
                }}
              />
            ))}

            {/* Modal Content Box - Petal Shape */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl p-8 md:p-12 max-w-2xl w-11/12 shadow-2xl relative overflow-hidden border transition-all ${
                isRevelation
                  ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300/70 shadow-amber-500/30"
                  : "bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-200/50"
              }`}
            >
              {/* Background glow */}
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isRevelation
                    ? "bg-gradient-to-br from-amber-100/30 to-orange-100/30"
                    : "bg-gradient-to-br from-rose-100/20 to-amber-100/20"
                }`}
              />

              {/* Revelation star badge */}
              {isRevelation && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg flex items-center justify-center text-2xl"
                >
                  ⭐
                </motion.div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-2xl md:text-4xl font-playfair mb-6 text-center ${
                    isRevelation ? "text-amber-900" : "text-rose-900"
                  }`}
                >
                  {title}
                  {isRevelation && (
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="block text-sm text-amber-700/70 mt-2 font-normal"
                    >
                      ✨ A Revelation ✨
                    </motion.span>
                  )}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-base md:text-lg font-light leading-relaxed min-h-24 whitespace-pre-wrap font-playfair ${
                    isRevelation ? "text-amber-800" : "text-rose-800"
                  }`}
                >
                  {displayedText}
                  {displayedText !== content && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </motion.div>

                {/* Revelation message - special insight */}
                {isRevelation && revealMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-lg border border-amber-300/50"
                  >
                    <p className="text-sm md:text-base text-amber-900/80 font-playfair italic text-center">
                      💡 {revealMessage}
                    </p>
                  </motion.div>
                )}

                {/* Close hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`text-center text-sm mt-8 font-playfair italic ${
                    isRevelation ? "text-amber-600/70" : "text-rose-600/70"
                  }`}
                >
                  Click to close • Release this memory back to the night
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
