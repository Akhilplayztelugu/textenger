import { useEffect, useRef, useCallback } from 'react';
import { lastSeenManager } from '../utils/lastSeenManager';

interface Message {
  id: number | string;
  timestamp?: string;
  content?: string;
}

interface UseLastSeenScrollOptions {
  conversationId: string;
  messages: Message[];
  isVisible: boolean; // Whether the chat is currently visible
  chatType?: 'dm' | 'room'; // Type of chat - determines scroll behavior
}

export function useLastSeenScroll({
  conversationId,
  messages,
  isVisible,
  chatType = 'room'
}: UseLastSeenScrollOptions) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef<number>(0);
  const hasScrolledToLastSeen = useRef<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll to last seen message when chat opens
  const scrollToLastSeenMessage = useCallback(() => {
    if (!messagesContainerRef.current || !messages.length || hasScrolledToLastSeen.current) {
      return;
    }

    // For DM chats, always scroll to bottom regardless of last seen
    if (chatType === 'dm') {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      hasScrolledToLastSeen.current = true;
      return;
    }

    // For rooms, use last seen behavior but without visual indicators
    const lastSeen = lastSeenManager.getLastSeenPosition(conversationId);
    
    if (!lastSeen) {
      // No last seen position, scroll to bottom (latest messages)
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      hasScrolledToLastSeen.current = true;
      return;
    }

    // Find the last seen message in the current message list
    const lastSeenMessageIndex = messages.findIndex(msg => 
      msg.id.toString() === lastSeen.messageId.toString()
    );

    if (lastSeenMessageIndex !== -1) {
      // Scroll to the last seen message silently (no visual indicators)
      const messageElement = messagesContainerRef.current.children[lastSeenMessageIndex] as HTMLElement;
      if (messageElement) {
        // Scroll to show the last seen message at the top of the container
        const containerTop = messagesContainerRef.current.scrollTop;
        const elementTop = messageElement.offsetTop - messagesContainerRef.current.offsetTop;
        
        messagesContainerRef.current.scrollTo({
          top: elementTop - 100, // Add some padding
          behavior: 'smooth'
        });
        
        // No visual indicators for rooms - just silent scroll
      }
    } else {
      // Last seen message not found in current list, scroll to bottom
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    hasScrolledToLastSeen.current = true;
  }, [conversationId, messages, chatType]);

  // Update last seen position when user scrolls
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || !isVisible) {
      return;
    }

    lastScrollPosition.current = messagesContainerRef.current.scrollTop;
    
    // Find which messages are currently visible
    const container = messagesContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const children = Array.from(container.children) as HTMLElement[];
    
    // Find the last message that's visible in the viewport
    let lastVisibleMessageIndex = -1;
    
    children.forEach((child, index) => {
      const childRect = child.getBoundingClientRect();
      const isVisible = childRect.top < containerRect.bottom && childRect.bottom > containerRect.top;
      
      if (isVisible) {
        lastVisibleMessageIndex = index;
      }
    });

    // Update last seen position if we found a visible message
    if (lastVisibleMessageIndex !== -1 && messages[lastVisibleMessageIndex]) {
      const messageId = messages[lastVisibleMessageIndex].id;
      lastSeenManager.updateLastSeenPosition(conversationId, messageId);
    }
  }, [conversationId, messages, isVisible]);

  // Set up intersection observer for automatic scroll position tracking
  useEffect(() => {
    if (!messagesContainerRef.current || !isVisible) {
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageElement = entry.target as HTMLElement;
            const messageIndex = Array.from(messagesContainerRef.current!.children).indexOf(messageElement);
            
            if (messageIndex !== -1 && messages[messageIndex]) {
              const messageId = messages[messageIndex].id;
              lastSeenManager.updateLastSeenPosition(conversationId, messageId);
            }
          }
        });
      },
      {
        root: messagesContainerRef.current,
        rootMargin: '0px',
        threshold: 0.5 // Message needs to be 50% visible
      }
    );

    // Observe all message elements
    const children = Array.from(messagesContainerRef.current.children);
    children.forEach(child => {
      observerRef.current!.observe(child);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [conversationId, messages, isVisible]);

  // Scroll to last seen message when component mounts or conversation changes
  useEffect(() => {
    if (isVisible && messages.length > 0) {
      // Reset scroll flag when conversation changes
      hasScrolledToLastSeen.current = false;
      
      // Small delay to ensure DOM is updated
      setTimeout(scrollToLastSeenMessage, 100);
    }
  }, [conversationId, isVisible, scrollToLastSeenMessage]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Function to mark conversation as fully read (scroll to bottom)
  const markAsRead = useCallback(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      lastSeenManager.markConversationAsRead(conversationId, latestMessage.id);
      
      // Scroll to bottom
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [conversationId, messages]);

  return {
    messagesContainerRef,
    markAsRead,
    scrollToLastSeenMessage
  };
}