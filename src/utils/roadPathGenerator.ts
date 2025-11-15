import { Lantern, LanternPosition } from "../types";

/**
 * Simple seeded random number generator for reproducible lantern positioning
 * Uses a hash-based approach to generate deterministic random numbers
 */
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert string seed to number via hash
    this.seed = seed.split("").reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

/**
 * Generate randomized lantern positions along a vertical road
 * Ensures spacing, alternates sides, and is reproducible with same seed
 */
export function generateRoadPositions(
  lanterns: Lantern[],
  userId: string = "default-user"
): LanternPosition[] {
  const rng = new SeededRandom(userId);

  const MIN_SPACING = 100;
  const MAX_OFFSET = 150;
  const START_Y = 200;

  const positions: LanternPosition[] = [];
  let currentY = START_Y;

  lanterns.forEach((lantern, index) => {
    // Generate random Y offset
    const offset = MIN_SPACING + rng.nextInt(MAX_OFFSET - MIN_SPACING);
    currentY += offset;

    // Alternate sides (left, right, left, ...)
    const side = index % 2 === 0 ? "left" : "right";

    // Determine if this lantern is revealed based on type
    const isRevealed =
      lantern.type === "standard" ||
      lantern.type === "locked";

    positions.push({
      id: lantern.id,
      y: currentY,
      side,
      isRevealed,
    });
  });

  return positions;
}

/**
 * Update atmosphere based on revealed secrets
 */
export function calculateAtmosphere(revealedSecretCount: number) {
  const baseAtmosphere = {
    fogOpacity: 0.1,
    particleCount: 5,
    skyShade: "from-slate-900 via-rose-900/20 to-slate-900",
    lightIntensity: 1,
  };

  if (revealedSecretCount === 0) {
    return baseAtmosphere;
  }

  // After 1st revelation: slight atmosphere shift
  if (revealedSecretCount >= 1) {
    return {
      fogOpacity: 0.15,
      particleCount: 8,
      skyShade: "from-slate-800 via-purple-900/30 to-slate-800",
      lightIntensity: 0.9,
    };
  }

  // After 2nd revelation: more dramatic shift
  if (revealedSecretCount >= 2) {
    return {
      fogOpacity: 0.2,
      particleCount: 12,
      skyShade: "from-slate-900 via-indigo-900/40 to-purple-900",
      lightIntensity: 0.8,
    };
  }

  return baseAtmosphere;
}

/**
 * Determine if a lantern should be visible based on opened count
 */
export function shouldLanternBeVisible(
  lantern: Lantern,
  openedCount: number
): boolean {
  if (
    lantern.type === "standard" ||
    lantern.type === "locked"
  ) {
    return true;
  }

  if (lantern.type === "golden") {
    const threshold = lantern.unlockThreshold ?? 3;
    return openedCount >= threshold;
  }

  if (lantern.type === "hidden" && lantern.unlockTrigger !== undefined) {
    return openedCount >= lantern.unlockTrigger;
  }

  if (lantern.type === "revelation" && lantern.unlockTrigger !== undefined) {
    return openedCount >= lantern.unlockTrigger;
  }

  return false;
}

/**
 * Get all lanterns in order with their positions
 */
export function getRoadLanterns(
  positions: LanternPosition[],
  lanternMap: Map<string, Lantern>
): Array<LanternPosition & { lantern: Lantern }> {
  return positions
    .map((pos) => ({
      ...pos,
      lantern: lanternMap.get(pos.id)!,
    }))
    .sort((a, b) => a.y - b.y);
}
