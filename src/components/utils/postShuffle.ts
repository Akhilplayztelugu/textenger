// Utility functions for post shuffling

/**
 * Fisher-Yates shuffle algorithm for randomizing array order
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a user-specific seed based on session
 */
export function generateUserSeed(): string {
  // Create a unique seed for this session
  const timestamp = Date.now();
  const random = Math.random();
  return `${timestamp}-${random}`;
}

/**
 * Seeded random number generator for consistent shuffling per user session
 */
export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Shuffle posts with a user-specific seed for consistent but unique ordering
 */
export function shufflePostsForUser<T>(posts: T[], userSeed: string): T[] {
  // Guard against invalid inputs
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return [];
  }
  
  if (!userSeed || typeof userSeed !== 'string') {
    return [...posts];
  }
  
  try {
    const random = seededRandom(userSeed);
    const shuffled = [...posts];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      // Ensure we don't create undefined values
      if (j >= 0 && j < shuffled.length && i >= 0 && i < shuffled.length) {
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    }
    
    return shuffled;
  } catch (error) {
    console.warn('Error in shufflePostsForUser:', error);
    return [...posts];
  }
}

/**
 * Get or create a user session seed
 */
export function getUserSessionSeed(): string {
  const storageKey = 'textenger-session-seed';
  
  try {
    // Try to get existing seed from sessionStorage (clears when app is closed)
    let seed = sessionStorage.getItem(storageKey);
    
    if (!seed || typeof seed !== 'string' || seed.length === 0) {
      // Generate new seed if none exists or is invalid
      seed = generateUserSeed();
      sessionStorage.setItem(storageKey, seed);
    }
    
    return seed;
  } catch (error) {
    // Fallback if sessionStorage is not available
    console.warn('SessionStorage not available, using fallback seed');
    return generateUserSeed();
  }
}

/**
 * Clear user session seed (for when app is reopened)
 */
export function clearUserSessionSeed(): void {
  try {
    sessionStorage.removeItem('textenger-session-seed');
  } catch (error) {
    // Silently fail if sessionStorage is not available
  }
}

/**
 * Check if this is a fresh app session (no existing seed)
 */
export function isFreshSession(): boolean {
  try {
    return !sessionStorage.getItem('textenger-session-seed');
  } catch (error) {
    return true;
  }
}