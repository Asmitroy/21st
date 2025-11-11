import { motion } from 'framer-motion';
import { useState } from 'react';
import { memories } from '../data/content';
import { Star } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function Layer2Journey({ onComplete }: Props) {
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [exploredMemories, setExploredMemories] = useState<Set<string>>(new Set());

  const handleMemoryClick = (id: string) => {
    setSelectedMemory(id);
    const newExplored = new Set(exploredMemories);
    newExplored.add(id);
    setExploredMemories(newExplored);
  };

  const handleClose = () => {
    setSelectedMemory(null);
  };

  const allExplored = exploredMemories.size === memories.length;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-12 relative z-10 max-w-3xl"
      >
        <p className="text-2xl md:text-3xl text-gray-200 font-light leading-relaxed">
          Each moment was a thread,<br />
          weaving us together.
        </p>
      </motion.div>

      <div className="relative w-full max-w-5xl h-[500px] md:h-[600px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {memories.map((memory, index) => {
            if (index < memories.length - 1) {
              const nextMemory = memories[index + 1];
              return (
                <motion.line
                  key={`line-${memory.id}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ delay: index * 0.3 + 1, duration: 1 }}
                  x1={`${memory.position.x}%`}
                  y1={`${memory.position.y}%`}
                  x2={`${nextMemory.position.x}%`}
                  y2={`${nextMemory.position.y}%`}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            }
            return null;
          })}
        </svg>

        {memories.map((memory, index) => {
          const isExplored = exploredMemories.has(memory.id);

          return (
            <motion.div
              key={memory.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.3 + 0.5, duration: 0.8, type: 'spring' }}
              style={{
                position: 'absolute',
                top: `${memory.position.y}%`,
                left: `${memory.position.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="relative z-10"
            >
              <motion.button
                onClick={() => handleMemoryClick(memory.id)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer group"
              >
                <motion.div
                  animate={
                    isExplored
                      ? { scale: [1, 1.2, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isExplored
                      ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                      : {}
                  }
                  className={`w-4 h-4 rounded-full ${
                    isExplored
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                      : 'bg-white/70'
                  }`}
                />
                <Star
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 ${
                    isExplored ? 'text-yellow-400' : 'text-white/50'
                  } group-hover:text-yellow-300 transition-colors`}
                  fill={isExplored ? 'currentColor' : 'none'}
                />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {selectedMemory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 max-w-lg shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="currentColor" />
            <h3 className="text-3xl font-light text-white mb-2 text-center">
              {memories.find((m) => m.id === selectedMemory)?.title}
            </h3>
            {memories.find((m) => m.id === selectedMemory)?.date && (
              <p className="text-sm text-gray-400 mb-6 text-center">
                {memories.find((m) => m.id === selectedMemory)?.date}
              </p>
            )}
            <p className="text-xl text-gray-300 leading-relaxed text-center italic">
              "{memories.find((m) => m.id === selectedMemory)?.description}"
            </p>
            <button
              onClick={handleClose}
              className="mt-8 w-full py-3 text-yellow-400 hover:text-yellow-300 transition-colors"
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
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-20 text-lg font-medium"
        >
          Read the Words
        </motion.button>
      )}
    </div>
  );
}
