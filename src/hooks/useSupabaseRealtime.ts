import { useEffect, useRef } from 'react';
import { RealtimeService } from '../lib/realtime';

export function useSupabaseRealtime() {
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // Subscribe to feed updates
  const subscribeToFeed = (callback: (payload: any) => void) => {
    if (!subscriptionsRef.current.has('feed')) {
      RealtimeService.subscribeToFeed(callback);
      subscriptionsRef.current.add('feed');
    }
  };

  // Subscribe to stories updates
  const subscribeToStories = (callback: (payload: any) => void) => {
    if (!subscriptionsRef.current.has('stories')) {
      RealtimeService.subscribeToStories(callback);
      subscriptionsRef.current.add('stories');
    }
  };

  // Subscribe to clips updates
  const subscribeToClips = (callback: (payload: any) => void) => {
    if (!subscriptionsRef.current.has('clips')) {
      RealtimeService.subscribeToClips(callback);
      subscriptionsRef.current.add('clips');
    }
  };

  // Subscribe to room chat
  const subscribeToRoomChat = (roomId: string, callback: (payload: any) => void) => {
    const channelName = `room-${roomId}`;
    if (!subscriptionsRef.current.has(channelName)) {
      RealtimeService.subscribeToRoomChat(roomId, callback);
      subscriptionsRef.current.add(channelName);
    }
  };

  // Subscribe to DM conversation
  const subscribeToDMConversation = (conversationId: string, callback: (payload: any) => void) => {
    const channelName = `conversation-${conversationId}`;
    if (!subscriptionsRef.current.has(channelName)) {
      RealtimeService.subscribeToDMConversation(conversationId, callback);
      subscriptionsRef.current.add(channelName);
    }
  };

  // Subscribe to notifications
  const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
    if (!subscriptionsRef.current.has('notifications')) {
      RealtimeService.subscribeToNotifications(userId, callback);
      subscriptionsRef.current.add('notifications');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      RealtimeService.unsubscribeAll();
      subscriptionsRef.current.clear();
    };
  }, []);

  return {
    subscribeToFeed,
    subscribeToStories,
    subscribeToClips,
    subscribeToRoomChat,
    subscribeToDMConversation,
    subscribeToNotifications,
    unsubscribe: RealtimeService.unsubscribe,
    unsubscribeAll: RealtimeService.unsubscribeAll
  };
}