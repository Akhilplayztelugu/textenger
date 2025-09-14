// Utility for managing last seen message positions in chats and rooms
export interface LastSeenPosition {
  messageId: number | string;
  timestamp: number;
  userId?: string;
}

export interface ConversationLastSeen {
  [conversationId: string]: LastSeenPosition;
}

const STORAGE_KEY = 'textenger_last_seen_positions';

export class LastSeenManager {
  private static instance: LastSeenManager;
  private lastSeenPositions: ConversationLastSeen = {};

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): LastSeenManager {
    if (!LastSeenManager.instance) {
      LastSeenManager.instance = new LastSeenManager();
    }
    return LastSeenManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.lastSeenPositions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load last seen positions:', error);
      this.lastSeenPositions = {};
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lastSeenPositions));
    } catch (error) {
      console.warn('Failed to save last seen positions:', error);
    }
  }

  /**
   * Update the last seen message position for a conversation
   */
  public updateLastSeenPosition(
    conversationId: string, 
    messageId: number | string, 
    userId?: string
  ): void {
    this.lastSeenPositions[conversationId] = {
      messageId,
      timestamp: Date.now(),
      userId
    };
    this.saveToStorage();
  }

  /**
   * Get the last seen message position for a conversation
   */
  public getLastSeenPosition(conversationId: string): LastSeenPosition | null {
    return this.lastSeenPositions[conversationId] || null;
  }

  /**
   * Remove last seen position for a conversation (cleanup)
   */
  public removeLastSeenPosition(conversationId: string): void {
    delete this.lastSeenPositions[conversationId];
    this.saveToStorage();
  }

  /**
   * Clear all last seen positions (useful for logout)
   */
  public clearAllPositions(): void {
    this.lastSeenPositions = {};
    this.saveToStorage();
  }

  /**
   * Get all last seen positions (useful for debugging or sync)
   */
  public getAllPositions(): ConversationLastSeen {
    return { ...this.lastSeenPositions };
  }

  /**
   * Check if a message should be marked as "new" based on last seen position
   */
  public isMessageNew(
    conversationId: string, 
    messageId: number | string, 
    messageTimestamp?: number
  ): boolean {
    const lastSeen = this.getLastSeenPosition(conversationId);
    
    if (!lastSeen) {
      return true; // No last seen position means all messages are new
    }

    // If we have message timestamps, use those for comparison
    if (messageTimestamp && lastSeen.timestamp) {
      return messageTimestamp > lastSeen.timestamp;
    }

    // Otherwise, compare message IDs (assuming they're sequential)
    if (typeof messageId === 'number' && typeof lastSeen.messageId === 'number') {
      return messageId > lastSeen.messageId;
    }

    // For string IDs, we can't easily compare, so use timestamp
    return messageTimestamp ? messageTimestamp > lastSeen.timestamp : false;
  }

  /**
   * Mark all messages in a conversation as seen (when user actively views chat)
   */
  public markConversationAsRead(conversationId: string, latestMessageId: number | string): void {
    this.updateLastSeenPosition(conversationId, latestMessageId);
  }
}

// Export singleton instance
export const lastSeenManager = LastSeenManager.getInstance();