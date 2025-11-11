import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { letterContent } from '../data/content';
import { Heart } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function Layer3Words({ onComplete }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < letterContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + letterContent[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex]);

  const paragraphs = displayedText.split('\n\n');

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center text-9xl md:text-[20rem] font-serif text-gray-400 select-none pointer-events-none"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        ∞
      </motion.div>

      <div className="relative z-10 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-center mb-12"
        >
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" fill="currentColor" />
          <p className="text-2xl md:text-3xl text-gray-700 font-light">
            If feelings could write themselves...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50"
        >
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {paragraph}
              </motion.p>
            ))}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1 h-6 bg-gray-700 ml-1"
              />
            )}
          </div>
        </motion.div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-600 mb-8 italic">
              "You've read my words — now feel what they meant."
            </p>
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-rose-400 to-orange-400 text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all text-lg font-medium"
            >
              Feel the Promise
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
