import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layer1Essence from "./components/Layer1Essence";
import Layer2Journey from "./components/Layer2Journey";
import Layer3Words from "./components/Layer3Words";
import Layer4Horizon from "./components/Layer4Horizon";
import Layer5Letters from "./components/Layer5Letters";
import ParticleBackground from "./components/ParticleBackground";
import AudioPlayer from "./components/AudioPlayer";
import SilenceReward from "./components/SilenceReward";
import SequenceTransition from "./components/SequenceTransition";
import WhisperField from "./components/WhisperField";
import { useStillnessDetector } from "./hooks/useStillnessDetector";
import { generateUserIdentifier } from "./utils/unlockUtils";
import {
  fetchLetters,
  fetchUserLetterStates,
  ensureUserVisit,
  updateLetterState,
} from "./utils/supabaseClient";
import { Letter } from "./types";

function App() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [silenceActive, setSilenceActive] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [userLetterStates, setUserLetterStates] = useState<
    Record<string, { is_opened: boolean; is_bookmarked: boolean }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [transitionActive, setTransitionActive] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const userId = generateUserIdentifier();
      await ensureUserVisit(userId);

      const fetchedLetters = await fetchLetters();
      const fetchedStates = await fetchUserLetterStates(userId);

      setLetters(fetchedLetters);

      const statesMap = (fetchedStates as any[]).reduce(
        (
          acc: Record<string, { is_opened: boolean; is_bookmarked: boolean }>,
          state: any
        ) => {
          acc[state.letter_key] = {
            is_opened: state.is_opened,
            is_bookmarked: state.is_bookmarked,
          };
          return acc;
        },
        {} as Record<string, { is_opened: boolean; is_bookmarked: boolean }>
      );
      setUserLetterStates(statesMap);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleStillness = useCallback(() => {
    setSilenceActive(true);
  }, []);

  const handleMovement = useCallback(() => {
    setSilenceActive(false);
  }, []);

  useStillnessDetector(handleStillness, handleMovement, 25000);

  // Debug: manual triggers for SilenceReward overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = (e.key || "").toLowerCase();
      if (e.shiftKey && key === "s") {
        console.log("[Debug] Shift+S pressed: activating SilenceReward");
        setSilenceActive(true);
      }
      if (e.shiftKey && key === "x") {
        console.log("[Debug] Shift+X pressed: deactivating SilenceReward");
        setSilenceActive(false);
      }
      if (e.shiftKey && key === "t") {
        console.log("[Debug] Shift+T pressed: activating SequenceTransition");
        setTransitionActive(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleStartJourney = () => {
    setShowIntro(false);
  };

  const handleLayerComplete = () => {
    // Trigger a short transition overlay between sequences, then advance layer
    setTransitionActive(true);
  };
  const handleSequenceTransitionComplete = () => {
    setCurrentLayer((prev) => prev + 1);
    setTransitionActive(false);
  };

  const handleLetterOpened = async (letterKey: string) => {
    const userId = generateUserIdentifier();
    setUserLetterStates((prev) => ({
      ...prev,
      [letterKey]: { ...prev[letterKey], is_opened: true },
    }));
    await updateLetterState(userId, letterKey, {
      is_opened: true,
      opened_at: new Date().toISOString(),
    });
  };

  const handleLetterBookmarked = async (letterKey: string) => {
    const userId = generateUserIdentifier();
    const currentState = userLetterStates[letterKey] || {
      is_opened: false,
      is_bookmarked: false,
    };
    const newBookmarkedState = !currentState.is_bookmarked;

    setUserLetterStates((prev) => ({
      ...prev,
      [letterKey]: { ...prev[letterKey], is_bookmarked: newBookmarkedState },
    }));

    await updateLetterState(userId, letterKey, {
      is_bookmarked: newBookmarkedState,
    });
  };

  return (
    <div>
      <ParticleBackground />
      <AudioPlayer />
      {/* (debug button removed) */}
      <SilenceReward
        isActive={silenceActive}
        onExit={() => setSilenceActive(false)}
      />
      <SequenceTransition
        isActive={transitionActive}
        onComplete={handleSequenceTransitionComplete}
      />

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
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                For You
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
              >
                A journey through layers of us—
                <br />
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
                <Layer4Horizon onComplete={handleLayerComplete} />
              </motion.div>
            )}
            {currentLayer === 4 && !isLoading && (
              <motion.div
                key="layer5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <Layer5Letters
                  onComplete={handleLayerComplete}
                  letters={letters}
                  userLetterStates={userLetterStates}
                  onLetterOpened={handleLetterOpened}
                  onLetterBookmarked={handleLetterBookmarked}
                />
              </motion.div>
            )}
            {currentLayer === 5 && (
              <motion.div
                key="layer6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                {/* WhisperField: ambient background for final layer (Layer 6) */}
                <WhisperField count={18} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
