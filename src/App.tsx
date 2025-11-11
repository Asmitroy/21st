import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layer1Essence from './components/Layer1Essence';
import Layer2Journey from './components/Layer2Journey';
import Layer3Words from './components/Layer3Words';
import Layer4Horizon from './components/Layer4Horizon';
import ParticleBackground from './components/ParticleBackground';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const handleStartJourney = () => {
    setShowIntro(false);
  };

  const handleLayerComplete = () => {
    setCurrentLayer((prev) => prev + 1);
  };

  return (
    <div className="relative">
      <ParticleBackground />
      <AudioPlayer />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50" />
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="text-5xl md:text-7xl font-light text-gray-800 mb-8"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                For You
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
              >
                A journey through layers of us—<br />
                each revealing a piece of my heart.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartJourney}
                className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all text-xl"
              >
                Begin
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {currentLayer === 0 && (
              <motion.div
                key="layer1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Layer1Essence onComplete={handleLayerComplete} />
              </motion.div>
            )}
            {currentLayer === 1 && (
              <motion.div
                key="layer2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Layer2Journey onComplete={handleLayerComplete} />
              </motion.div>
            )}
            {currentLayer === 2 && (
              <motion.div
                key="layer3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Layer3Words onComplete={handleLayerComplete} />
              </motion.div>
            )}
            {currentLayer === 3 && (
              <motion.div
                key="layer4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Layer4Horizon />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
