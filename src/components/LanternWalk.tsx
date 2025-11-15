import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  lanterns,
  lockedLanterns,
  goldenLanterns,
  hiddenLanterns,
  revelationLanterns,
} from "../data/content";
import { Lantern, LanternPosition, RoadAtmosphere } from "../types";
import {
  generateRoadPositions,
  calculateAtmosphere,
  shouldLanternBeVisible,
  getRoadLanterns,
} from "../utils/roadPathGenerator";
import { LanternModal } from "./LanternModal";

interface LanternWalkProps {
  onComplete: () => void;
}

export const LanternWalk = ({ onComplete }: LanternWalkProps) => {
  const [selectedLantern, setSelectedLantern] = useState<Lantern | null>(null);
  const [openedCount, setOpenedCount] = useState(0);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(
    new Set()
  );
  const [positions, setPositions] = useState<LanternPosition[]>([]);
  const [atmosphere, setAtmosphere] = useState<RoadAtmosphere>({
    fogOpacity: 0.1,
    particleCount: 5,
    skyShade: "from-slate-900 via-rose-900/20 to-slate-900",
    lightIntensity: 1,
  });
  const [visibleLanterns, setVisibleLanterns] = useState<Set<string>>(
    new Set()
  );
  const [showSkipButton, setShowSkipButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeUnlocked, setTimeUnlocked] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Set<string>>(new Set());

  // All lanterns combined
  const allLanterns = useMemo(
    () => [
      ...lanterns,
      ...lockedLanterns,
      ...goldenLanterns,
      ...hiddenLanterns,
      ...revelationLanterns,
    ],
    []
  );
  const lanternMap = useMemo(
    () => new Map(allLanterns.map((l) => [l.id, l])),
    [allLanterns]
  );

  // Initialize positions and load from localStorage
  useEffect(() => {
    setOpenedIds(new Set());
    setOpenedCount(0);
    setRevealedSecrets(new Set());
    localStorage.setItem("lanternWalk_openedIds", JSON.stringify([]));
    localStorage.setItem("lanternWalk_openedCount", "0");
    localStorage.setItem("lanternWalk_revealedSecrets", JSON.stringify([]));

    const userId = localStorage.getItem("lanternWalk_userId") || "default";
    const generatedPositions = generateRoadPositions(allLanterns, userId);
    setPositions(generatedPositions);

    if (!localStorage.getItem("lanternWalk_userId")) {
      localStorage.setItem("lanternWalk_userId", userId);
    }
  }, [allLanterns]);

  useEffect(() => {
    const timeout = setTimeout(() => setTimeUnlocked(true), 90000);
    return () => clearTimeout(timeout);
  }, []);

  // Update atmosphere when secrets revealed
  useEffect(() => {
    const newAtmosphere = calculateAtmosphere(revealedSecrets.size);
    setAtmosphere(newAtmosphere);

    // Check if any skip-layer effects are revealed
    const hasSkipLayer = Array.from(revealedSecrets).some((id) => {
      const lantern = lanternMap.get(id);
      return lantern?.revealEffect === "skip-layer";
    });
    setShowSkipButton(hasSkipLayer);
  }, [revealedSecrets, lanternMap]);

  // Determine visible lanterns based on openedCount and secrets gating
  useEffect(() => {
    const visible = new Set<string>();
    allLanterns.forEach((lantern) => {
      if (shouldLanternBeVisible(lantern, openedCount)) {
        visible.add(lantern.id);
      }
    });

    // Gate revelations: only appear when all non-revelation secrets are revealed
    const nonRevSecrets = [...lockedLanterns, ...hiddenLanterns].map((l) => l.id);
    const allNonRevRevealed = nonRevSecrets.every((id) => revealedSecrets.has(id));
    if (!allNonRevRevealed) {
      revelationLanterns.forEach((l) => visible.delete(l.id));
    }

    setVisibleLanterns(visible);
  }, [openedCount, allLanterns, revealedSecrets]);

  const handleLanternClick = (lantern: Lantern) => {
    if (lantern.type === "locked" && !timeUnlocked) {
      return;
    }

    // Check if hidden/revelation should be visible
    if (!visibleLanterns.has(lantern.id)) {
      return;
    }

    setSelectedLantern(lantern);

    // Track opened lantern
    if (lantern.type === "standard" && !openedIds.has(lantern.id)) {
      const newIds = new Set(openedIds);
      newIds.add(lantern.id);

      const newCount = newIds.size;
      setOpenedCount(newCount);
      setOpenedIds(newIds);

      localStorage.setItem("lanternWalk_openedCount", newCount.toString());
      localStorage.setItem(
        "lanternWalk_openedIds",
        JSON.stringify(Array.from(newIds))
      );
    }

    // Track revealed secrets
    if (
      (lantern.type === "revelation" ||
        lantern.type === "hidden" ||
        lantern.type === "locked") &&
      !revealedSecrets.has(lantern.id)
    ) {
      const newSecrets = new Set(revealedSecrets);
      newSecrets.add(lantern.id);
      setRevealedSecrets(newSecrets);
      localStorage.setItem(
        "lanternWalk_revealedSecrets",
        JSON.stringify(Array.from(newSecrets))
      );

      const newRecent = new Set(recentlyUnlocked);
      newRecent.add(lantern.id);
      setRecentlyUnlocked(newRecent);
      setTimeout(() => {
        setRecentlyUnlocked((prev) => {
          const next = new Set(prev);
          next.delete(lantern.id);
          return next;
        });
      }, 1500);
    }
  };

  const handleModalClose = () => {
    setSelectedLantern(null);
  };

  const roadLanterns = getRoadLanterns(positions, lanternMap);

  return (
    <div className="relative w-full h-full min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900 flex flex-col">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Sky Layer */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className={`absolute inset-0 bg-gradient-to-b ${atmosphere.skyShade}`}
        />

        {/* Fog Layer */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-white/5 via-blue-500/5 to-transparent"
          style={{ opacity: atmosphere.fogOpacity }}
        />

        {/* Ambient Particles */}
        {Array.from({ length: atmosphere.particleCount }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-amber-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 pt-12 px-4 text-center pointer-events-none"
      >
        <h1 className="text-3xl md:text-4xl font-playfair text-rose-100/80 mb-2">
          The Lantern Walk
        </h1>
        <p className="text-rose-200/60 font-playfair italic text-sm md:text-base">
          A journey along a path of memories
        </p>
        {openedCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-300/70 text-xs md:text-sm mt-2"
          >
            {openedCount} lantern{openedCount !== 1 ? "s" : ""} opened
            {revealedSecrets.size > 0 &&
              ` • ${revealedSecrets.size} secret${
                revealedSecrets.size !== 1 ? "s" : ""
              } revealed`}
          </motion.p>
        )}
      </motion.div>

      {/* Road Container - Scrollable */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden z-10 px-4 md:px-8"
      >
        {/* Center road line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent pointer-events-none" />

        {/* Lanterns Container */}
        <div className="relative w-full" style={{ minHeight: "5000px" }}>
          {roadLanterns.map((item, index) => {
            const isVisible = visibleLanterns.has(item.id);
            const lantern = item.lantern;

            if (!isVisible && item.isRevealed) {
              // Show hidden lanterns as dim/ghostly
            } else if (!isVisible) {
              return null;
            }

            const isLocked = lantern.type === "locked" && !timeUnlocked;
            const isOpened = openedIds.has(lantern.id);
            const isSecret = revealedSecrets.has(lantern.id);
            const isHidden = lantern.type === "hidden";
            const isRevelation = lantern.type === "revelation";
            const isGolden = lantern.type === "golden";
            const justUnlocked = recentlyUnlocked.has(lantern.id);

            const xOffset = item.side === "left" ? "35%" : "65%";

            return (
              <motion.button
                key={lantern.id}
                initial={{ opacity: 0, x: item.side === "left" ? -100 : 100 }}
                animate={{ opacity: isVisible ? 1 : 0.3, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => handleLanternClick(lantern)}
                disabled={isLocked || (!isVisible && item.isRevealed)}
                className={`absolute transform transition-all cursor-pointer group ${
                  isLocked || (!isVisible && item.isRevealed)
                    ? "cursor-not-allowed"
                    : ""
                }`}
                style={{
                  top: `${item.y}px`,
                  left: xOffset,
                  width: "150px",
                }}
              >
                {/* Lantern Body */}
                <motion.div
                  whileHover={!isLocked && isVisible ? { scale: 1.1 } : {}}
                  className={`w-full h-40 rounded-lg transition-all duration-300 relative overflow-hidden shadow-lg ${
                    isRevelation
                      ? "bg-gradient-to-b from-purple-200 to-purple-400 shadow-purple-400/50"
                      : isGolden
                      ? "bg-gradient-to-b from-yellow-200 to-yellow-400 shadow-yellow-300/50"
                      : isHidden && !isVisible
                      ? "bg-gradient-to-b from-slate-400/40 to-slate-500/40 shadow-slate-600/30"
                      : isHidden
                      ? "bg-gradient-to-b from-teal-200 to-teal-400 shadow-teal-400/50"
                      : lantern.type === "locked"
                      ? "bg-gradient-to-b from-rose-200 to-rose-400 shadow-rose-400/50"
                      : isOpened
                      ? "bg-gradient-to-b from-rose-200 to-rose-300 shadow-rose-400/50"
                      : "bg-gradient-to-b from-rose-100 to-amber-100 shadow-rose-300/50"
                  }`}
                >
                  {/* Glow Animation */}
                  <motion.div
                    animate={
                      isRevelation
                        ? { opacity: [0.8, 1, 0.8] }
                        : isGolden
                        ? { opacity: [0.7, 1, 0.7] }
                        : { opacity: [0.4, 0.7, 0.4] }
                    }
                    transition={{
                      duration: isRevelation ? 1.2 : isGolden ? 1.5 : 2.5,
                      repeat: Infinity,
                    }}
                    className={`absolute inset-0 rounded-lg bg-gradient-to-b ${
                      isRevelation
                        ? "from-purple-300 to-purple-500"
                        : isGolden
                        ? "from-yellow-300 to-yellow-500"
                        : isHidden
                        ? "from-teal-300 to-teal-500"
                        : lantern.type === "locked"
                        ? "from-rose-300 to-rose-500"
                        : "from-rose-300 to-amber-200"
                    }`}
                  />

                  {/* Text Content */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p
                      className={`text-center text-sm font-playfair font-light leading-tight ${
                        isRevelation
                          ? "text-purple-900/80"
                          : isGolden
                          ? "text-yellow-900/80"
                          : isHidden && !isVisible
                          ? "text-slate-600/50"
                          : isHidden
                          ? "text-teal-900/80"
                          : lantern.type === "locked"
                          ? "text-rose-900/80"
                          : "text-rose-900/70"
                      }`}
                    >
                      {isHidden && !isVisible ? "?" : lantern.title}
                    </p>
                  </div>

                  {/* Revelation Pulse */}
                  {isRevelation && isVisible && (
                    <motion.div
                      animate={{ opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-lg bg-gradient-to-b from-purple-400 to-transparent"
                    />
                  )}

                  {/* Golden Shimmer */}
                  {isGolden && (
                    <motion.div
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg"
                    />
                  )}

                  {/* Unlock burst animation */}
                  {justUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3, 1.6] }}
                      transition={{ duration: 1.2 }}
                      className="absolute -inset-2 rounded-xl ring-2 ring-white/70"
                    />
                  )}
                </motion.div>

                {/* Status Badges */}
                {isOpened && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-amber-400 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">✓</span>
                  </motion.div>
                )}

                {isSecret && isRevelation && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-3 -left-3 w-6 h-6 bg-purple-400 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">★</span>
                  </motion.div>
                )}

                {/* Locked Tooltip */}
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-rose-900/90 text-rose-100 px-3 py-2 rounded-lg text-xs whitespace-nowrap font-playfair z-50 pointer-events-none"
                  >
                    Unlocks after time on page
                  </motion.div>
                )}

                {/* Hidden Tooltip */}
                {isHidden && !isVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-slate-100 px-3 py-2 rounded-lg text-xs whitespace-nowrap font-playfair z-50 pointer-events-none"
                  >
                    Hidden (open {lantern.unlockTrigger! - openedCount} more)
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 px-4 py-8 flex flex-col items-center gap-4"
      >
        {showSkipButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-playfair rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Skip to the Final Whisper
          </motion.button>
        )}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: openedCount >= 2 ? 1 : 0.3, y: 0 }}
          onClick={onComplete}
          disabled={openedCount < 2}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-playfair rounded-full hover:shadow-lg hover:shadow-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {openedCount >= 3
            ? "Continue to the Final Whisper"
            : `Open more lanterns (${openedCount}/3)`}
        </motion.button>
      </motion.div>

      {/* Modal */}
      <LanternModal
        isOpen={selectedLantern !== null}
        title={selectedLantern?.title || ""}
        content={selectedLantern?.content || ""}
        isRevelation={selectedLantern?.type === "revelation"}
        revealMessage={selectedLantern?.revealMessage}
        onClose={handleModalClose}
      />
    </div>
  );
};
