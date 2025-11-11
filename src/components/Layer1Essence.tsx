import { motion } from 'framer-motion';
import { useState } from 'react';
import { qualities } from '../data/content';
import { Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function Layer1Essence({ onComplete }: Props) {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [exploredQualities, setExploredQualities] = useState<Set<string>>(new Set());

  const handleQualityClick = (id: string) => {
    setSelectedQuality(id);
    const newExplored = new Set(exploredQualities);
    newExplored.add(id);
    setExploredQualities(newExplored);
  };

  const handleClose = () => {
    setSelectedQuality(null);
  };

  const allExplored = exploredQualities.size === qualities.length;

  const petalPositions = [
    { top: '20%', left: '50%', rotate: 0 },
    { top: '35%', left: '70%', rotate: 60 },
    { top: '55%', left: '75%', rotate: 120 },
    { top: '70%', left: '50%', rotate: 180 },
    { top: '55%', left: '25%', rotate: 240 },
    { top: '35%', left: '30%', rotate: 300 },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-20 relative z-10 max-w-3xl"
      >
        <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed">
          There are a thousand things I love about you,<br />
          but these are the ones that define your light.
        </p>
      </motion.div>

      <div className="relative w-full max-w-4xl h-96 md:h-[500px]">
        {qualities.map((quality, index) => {
          const position = petalPositions[index];
          const isExplored = exploredQualities.has(quality.id);

          return (
            <motion.div
              key={quality.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 1, duration: 0.8, type: 'spring' }}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -50%)',
              }}
              className="relative z-10"
            >
              <motion.button
                onClick={() => handleQualityClick(quality.id)}
                whileHover={{ scale: 1.15, rotate: position.rotate + 10 }}
                whileTap={{ scale: 0.95 }}
                className={`relative ${
                  isExplored ? 'bg-gradient-to-br from-pink-200 to-rose-300' : 'bg-gradient-to-br from-pink-100 to-rose-200'
                } rounded-full p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                style={{ rotate: position.rotate }}
              >
                <div className="flex flex-col items-center gap-2">
                  {isExplored && (
                    <Sparkles className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="text-lg md:text-xl font-medium text-gray-800">
                    {quality.title}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {selectedQuality && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-light text-gray-800 mb-6 text-center">
              {qualities.find((q) => q.id === selectedQuality)?.title}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed text-center italic">
              "{qualities.find((q) => q.id === selectedQuality)?.description}"
            </p>
            <button
              onClick={handleClose}
              className="mt-8 w-full py-3 text-rose-600 hover:text-rose-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {allExplored && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-20 text-lg"
        >
          Continue the Journey
        </motion.button>
      )}
    </div>
  );
}
