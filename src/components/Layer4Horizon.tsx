import { motion } from 'framer-motion';
import { useState } from 'react';
import { promises } from '../data/content';
import { Circle } from 'lucide-react';

interface Props {
  onComplete?: () => void;
}

export default function Layer4Horizon({ onComplete }: Props) {
  const [showFinal, setShowFinal] = useState(false);
  const [circlesMerged, setCirclesMerged] = useState(false);

  const handleMerge = () => {
    setCirclesMerged(true);
    setTimeout(() => {
      setShowFinal(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden">
      <motion.div
        initial={{ background: 'linear-gradient(to bottom, #1e293b, #334155, #64748b)' }}
        animate={{
          background: showFinal
            ? 'linear-gradient(to bottom, #fef3c7, #fde68a, #fcd34d)'
            : 'linear-gradient(to bottom, #312e81, #6366f1, #a5b4fc, #fef3c7)',
        }}
        transition={{ duration: 3 }}
        className="absolute inset-0"
      />

      {!showFinal ? (
        <div className="relative z-10 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center mb-16"
          >
            <p className="text-2xl md:text-4xl text-white font-light leading-relaxed drop-shadow-lg">
              We've built a thousand little worlds together.<br />
              Here's to the next one.
            </p>
          </motion.div>

          <div className="space-y-8 mb-20">
            {promises.map((promise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 + 1, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed drop-shadow">
                  {promise}
                </p>
              </motion.div>
            ))}
          </div>

          {!circlesMerged ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: promises.length * 0.5 + 1.5 }}
              className="flex items-center justify-center gap-8"
            >
              <motion.button
                onClick={handleMerge}
                className="relative cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ x: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Circle
                    className="w-24 h-24 text-rose-300"
                    strokeWidth={3}
                    fill="rgba(251, 207, 232, 0.5)"
                  />
                </motion.div>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute top-0 left-12"
                >
                  <Circle
                    className="w-24 h-24 text-blue-300"
                    strokeWidth={3}
                    fill="rgba(191, 219, 254, 0.5)"
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-medium drop-shadow">
                    Click
                  </span>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2 }}
              className="flex items-center justify-center"
            >
              <Circle
                className="w-32 h-32 text-purple-400"
                strokeWidth={4}
                fill="rgba(216, 180, 254, 0.8)"
              />
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-4xl md:text-6xl text-gray-800 font-light mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Forever,<br />
            in every small thing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <p className="text-xl text-gray-700 italic mb-4">
              This journey has no end.
            </p>
            <p className="text-lg text-gray-600 mb-12">
              Because you are my constant,<br />
              my light,<br />
              my home.
            </p>
            {onComplete && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                onClick={onComplete}
                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                Read My Letters
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
