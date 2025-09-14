import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Profile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  friends: string[];
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string;
  created_at: string;
  profiles?: Profile;
  post_likes?: PostLike[];
  post_comments?: PostComment[];
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  profiles?: Profile;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string;
  created_at: string;
  expires_at: string;
  profiles?: Profile;
}

export interface Clip {
  id: string;
  user_id: string;
  video_url: string;
  caption: string;
  created_at: string;
  profiles?: Profile;
  clip_likes?: ClipLike[];
}

export interface ClipLike {
  id: string;
  clip_id: string;
  user_id: string;
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
  room_members?: RoomMember[];
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  profiles?: Profile;
}

export interface RoomChat {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  attachments: any[];
  created_at: string;
  profiles?: Profile;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  conversation_participants?: ConversationParticipant[];
  messages?: Message[];
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  profiles?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  attachments: any[];
  created_at: string;
  profiles?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'room_invite';
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}