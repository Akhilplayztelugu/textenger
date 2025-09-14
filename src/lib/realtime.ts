import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to posts updates
  static subscribeToFeed(callback: (payload: any) => void) {
    const channel = supabase
      .channel('feed-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments'
        },
        callback
      )
      .subscribe();

    this.channels.set('feed', channel);
    return channel;
  }

  // Subscribe to stories updates
  static subscribeToStories(callback: (payload: any) => void) {
    const channel = supabase
      .channel('stories-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories'
        },
        callback
      )
      .subscribe();

    this.channels.set('stories', channel);
    return channel;
  }

  // Subscribe to clips updates
  static subscribeToClips(callback: (payload: any) => void) {
    const channel = supabase
      .channel('clips-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clips'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clip_likes'
        },
        callback
      )
      .subscribe();

    this.channels.set('clips', channel);
    return channel;
  }

  // Subscribe to room chat
  static subscribeToRoomChat(roomId: string, callback: (payload: any) => void) {
    const channelName = `room-${roomId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_chats',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to DM conversation
  static subscribeToDMConversation(conversationId: string, callback: (payload: any) => void) {
    const channelName = `conversation-${conversationId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to notifications
  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    this.channels.set('notifications', channel);
    return channel;
  }

  // Unsubscribe from channel
  static unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  static unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  // Send typing indicator for room
  static sendRoomTyping(roomId: string, userId: string, isTyping: boolean) {
    const channel = this.channels.get(`room-${roomId}`);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: userId, is_typing: isTyping }
      });
    }
  }

  // Send typing indicator for DM
  static sendDMTyping(conversationId: string, userId: string, isTyping: boolean) {
    const channel = this.channels.get(`conversation-${conversationId}`);
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: userId, is_typing: isTyping }
      });
    }
  }
}