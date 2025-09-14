import { supabase } from './supabase';
import type { Profile, Post, Story, Clip, Room, RoomChat, Conversation, Message } from './supabase';

export class DatabaseService {
  // Profile operations
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Post operations
  static async getPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url),
        post_likes (id, user_id),
        post_comments (id)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  static async createPost(userId: string, mediaUrl: string, mediaType: 'image' | 'video', caption: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        media_type: mediaType,
        caption
      })
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async likePost(userId: string, postId: string) {
    const { data, error } = await supabase
      .from('post_likes')
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async unlikePost(userId: string, postId: string) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (error) throw error;
  }

  // Story operations
  static async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createStory(userId: string, mediaUrl: string, mediaType: 'image' | 'video', caption: string) {
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        media_type: mediaType,
        caption
      })
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Clip operations
  static async getClips(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('clips')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url),
        clip_likes (id, user_id)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }

  static async createClip(userId: string, videoUrl: string, caption: string) {
    const { data, error } = await supabase
      .from('clips')
      .insert({
        user_id: userId,
        video_url: videoUrl,
        caption
      })
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async likeClip(userId: string, clipId: string) {
    const { data, error } = await supabase
      .from('clip_likes')
      .insert({ user_id: userId, clip_id: clipId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async unlikeClip(userId: string, clipId: string) {
    const { error } = await supabase
      .from('clip_likes')
      .delete()
      .eq('user_id', userId)
      .eq('clip_id', clipId);
    
    if (error) throw error;
  }

  // Room operations
  static async getRooms(userId: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        room_members!inner (user_id)
      `)
      .eq('room_members.user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createRoom(userId: string, name: string, description: string, isPublic: boolean, iconUrl?: string) {
    // Create room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        name,
        description,
        icon_url: iconUrl,
        is_public: isPublic,
        created_by: userId
      })
      .select()
      .single();
    
    if (roomError) throw roomError;

    // Add creator as member
    const { error: memberError } = await supabase
      .from('room_members')
      .insert({
        room_id: room.id,
        user_id: userId
      });
    
    if (memberError) throw memberError;
    return room;
  }

  static async getRoomChats(roomId: string, limit = 50) {
    const { data, error } = await supabase
      .from('room_chats')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async sendRoomMessage(roomId: string, userId: string, message: string, attachments: any[] = []) {
    const { data, error } = await supabase
      .from('room_chats')
      .insert({
        room_id: roomId,
        user_id: userId,
        message,
        attachments
      })
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  // DM operations
  static async getOrCreateConversation(userId: string, otherUserId: string) {
    // First, try to find existing conversation
    const { data: existing, error: findError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);
    
    if (findError) throw findError;

    if (existing && existing.length > 0) {
      // Check if any of these conversations include the other user
      for (const conv of existing) {
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conv.conversation_id)
          .eq('user_id', otherUserId)
          .single();
        
        if (otherParticipant) {
          return conv.conversation_id;
        }
      }
    }

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();
    
    if (convError) throw convError;

    // Add both participants
    const { error: participantError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: userId },
        { conversation_id: conversation.id, user_id: otherUserId }
      ]);
    
    if (participantError) throw participantError;
    return conversation.id;
  }

  static async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations (
          id,
          created_at,
          updated_at,
          conversation_participants (
            user_id,
            profiles (username, display_name, avatar_url)
          ),
          messages (
            id,
            content,
            created_at
          )
        )
      `)
      .eq('user_id', userId)
      .order('conversations.updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getMessages(conversationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async sendMessage(conversationId: string, userId: string, content: string, attachments: any[] = []) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content,
        attachments
      })
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  }

  // Notification operations
  static async getNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }

  static async markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
  }
}