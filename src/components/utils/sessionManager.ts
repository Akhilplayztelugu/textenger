// Session management utilities for Textenger

/**
 * Simulate app closure by clearing session data
 * This is useful for testing the shuffle functionality
 */
export function simulateAppClosure(): void {
  try {
    // Clear session storage to simulate app closure
    sessionStorage.clear();
    console.log('🔄 App closure simulated - session data cleared');
  } catch (error) {
    console.warn('Could not clear session storage:', error);
  }
}

/**
 * Force a new shuffle by clearing the session seed
 */
export function forceNewShuffle(): void {
  try {
    sessionStorage.removeItem('textenger-session-seed');
    console.log('🎲 Forced new shuffle - seed cleared');
  } catch (error) {
    console.warn('Could not clear session seed:', error);
  }
}

/**
 * Get session info for debugging
 */
export function getSessionInfo(): {
  hasActiveSeed: boolean;
  sessionStartTime: string | null;
  seedPreview: string | null;
} {
  try {
    const seed = sessionStorage.getItem('textenger-session-seed');
    return {
      hasActiveSeed: !!seed,
      sessionStartTime: seed ? new Date(parseInt(seed.split('-')[0])).toLocaleString() : null,
      seedPreview: seed ? seed.substring(0, 12) + '...' : null,
    };
  } catch (error) {
    return {
      hasActiveSeed: false,
      sessionStartTime: null,
      seedPreview: null,
    };
  }
}

// Export for global access in development (can be removed in production)
if (typeof window !== 'undefined') {
  (window as any).TextengerDebug = {
    simulateAppClosure,
    forceNewShuffle,
    getSessionInfo,
  };
}