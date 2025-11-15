import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, BookmarkCheck, X } from 'lucide-react';
import { Letter } from '../types';
import {
  isLetterUnlocked,
  getDaysUntilUnlock,
  formatUnlockDate,
  getFirstVisitDate,
} from '../utils/unlockUtils';

interface Props {
  onComplete: () => void;
  letters: Letter[];
  userLetterStates: Record<string, { is_opened: boolean; is_bookmarked: boolean }>;
  onLetterOpened: (letterKey: string) => void;
  onLetterBookmarked: (letterKey: string) => void;
}

export default function Layer5Letters({
  onComplete,
  letters,
  userLetterStates,
  onLetterOpened,
  onLetterBookmarked,
}: Props) {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const firstVisitDate = getFirstVisitDate();

  useEffect(() => {
    if (!selectedLetter) return;

    if (currentIndex < selectedLetter.content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + selectedLetter.content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, selectedLetter]);

  const handleLetterClick = (letter: Letter) => {
    if (isLetterUnlocked(letter, firstVisitDate)) {
      setSelectedLetter(letter);
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
      onLetterOpened(letter.letter_key);
    }
  };

  const handleClose = () => {
    setSelectedLetter(null);
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  };

  const handleBookmark = (e: React.MouseEvent, letterKey: string) => {
    e.stopPropagation();
    onLetterBookmarked(letterKey);
  };

  const sortedLetters = [...letters].sort((a, b) => a.position_order - b.position_order);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center mb-16 max-w-3xl"
      >
        <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed">
          Every word finds its time.<br />
          Letters waiting to be read.
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedLetters.map((letter, index) => {
            const unlocked = isLetterUnlocked(letter, firstVisitDate);
            const state = userLetterStates[letter.letter_key] || { is_opened: false, is_bookmarked: false };
            const daysUntil = getDaysUntilUnlock(letter, firstVisitDate);
            const accent = letter.accent || 'default';
            const openedClass =
              accent === 'violet'
                ? 'bg-gradient-to-br from-purple-100 to-fuchsia-50 border border-purple-200/50'
                : accent === 'emerald'
                ? 'bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200/50'
                : 'bg-gradient-to-br from-blue-100 to-cyan-50 border border-blue-200/50';
            const unlockedClass =
              accent === 'violet'
                ? 'bg-white border border-purple-200/50'
                : accent === 'emerald'
                ? 'bg-white border border-emerald-200/50'
                : 'bg-white border border-gray-200/50';
            const lockedClass =
              accent === 'violet'
                ? 'bg-gray-100 border border-purple-200/30'
                : accent === 'emerald'
                ? 'bg-gray-100 border border-emerald-200/30'
                : 'bg-gray-100 border border-gray-200/30';

            return (
              <motion.div
                key={letter.letter_key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                className="relative h-48"
              >
                <motion.div
                  onClick={() => handleLetterClick(letter)}
                  whileHover={unlocked ? { y: -8, rotateZ: 2 } : {}}
                  className={`relative h-full cursor-${unlocked ? 'pointer' : 'not-allowed'} group`}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      boxShadow: unlocked && state.is_opened
                        ? '0 20px 40px rgba(59, 130, 246, 0.3)'
                        : '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  className={`relative w-full h-full rounded-2xl p-6 transition-all ${
                      unlocked && state.is_opened
                        ? openedClass
                        : unlocked
                        ? unlockedClass
                        : lockedClass
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <Mail
                            className={`w-6 h-6 ${
                              unlocked && state.is_opened
                                ? accent === 'violet'
                                  ? 'text-purple-500'
                                  : accent === 'emerald'
                                  ? 'text-emerald-500'
                                  : 'text-blue-500'
                                : unlocked
                                ? 'text-gray-400'
                                : 'text-gray-300'
                            }`}
                          />
                          {state.is_bookmarked && (
                            <BookmarkCheck className="w-5 h-5 text-rose-400" fill="currentColor" />
                          )}
                        </div>

                        <h3
                          className={`text-lg font-light mb-2 transition-colors ${
                            unlocked && state.is_opened
                              ? 'text-gray-800'
                              : unlocked
                              ? 'text-gray-700'
                              : 'text-gray-500'
                          }`}
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {letter.title}
                        </h3>

                        {!unlocked && daysUntil && (
                          <p className="text-xs text-gray-400 italic">
                            Opens in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                          </p>
                        )}
                      </div>

                      <div>
                        {unlocked && (
                          <div className="text-xs text-gray-500">
                            {state.is_opened ? 'Read' : 'Click to read'}
                          </div>
                        )}
                        {!unlocked && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            Sealed until {formatUnlockDate(letter, firstVisitDate)}
                          </div>
                        )}
                      </div>
                    </div>

                    {unlocked && (
                      <motion.div
                        className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleBookmark(e, letter.letter_key)}
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white rounded-full p-2 shadow-lg border border-gray-200"
                        >
                          <BookmarkCheck
                            className={`w-4 h-4 ${
                              state.is_bookmarked ? 'text-rose-400' : 'text-gray-300'
                            }`}
                            fill={state.is_bookmarked ? 'currentColor' : 'none'}
                          />
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={onComplete}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-20 text-lg"
      >
        Continue Ahead
      </motion.button>

      <AnimatePresence>
        {selectedLetter && (
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
              className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <motion.h2
                  className="text-3xl font-light text-gray-800"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {selectedLetter.title}
                </motion.h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {displayedText.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-lg text-gray-700 leading-relaxed"
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

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={() =>
                      handleBookmark({ stopPropagation: () => {} } as any, selectedLetter.letter_key)
                    }
                    className="flex-1 py-3 px-4 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors font-medium"
                  >
                    <BookmarkCheck className="w-4 h-4 inline mr-2" />
                    Bookmark
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
