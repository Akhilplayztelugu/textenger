import React, { useState, useEffect } from 'react';
import { MobilePage } from './MobileLayout';
import { MobileTopBar } from './MobileTopBar';
import { DatabaseService } from '../../lib/database';
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime';
import { useAuthContext } from '../auth/AuthProvider';
import { PostCard } from '../feed/PostCard';
import { EmptyFeed } from '../feed/EmptyFeed';
import type { Post } from '../../lib/supabase';

export function MobileFeedPage() {
  const { user } = useAuthContext();
  const { subscribeToFeed } = useSupabaseRealtime();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    if (user) {
      subscribeToFeed((payload) => {
        console.log('Feed update:', payload);
        // Refresh posts when there are changes
        loadPosts();
      });
    }
  }, [user, subscribeToFeed]);

  const loadPosts = async () => {
    try {
      const data = await DatabaseService.getPosts(20, 0);
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await DatabaseService.unlikePost(user.id, postId);
      } else {
        await DatabaseService.likePost(user.id, postId);
      }
      // Posts will update via realtime
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <MobilePage>
        <MobileTopBar title="Textenger" />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-300">Loading feed...</p>
          </div>
        </div>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileTopBar 
        title="Textenger"
        showNotifications={true}
        notificationCount={0}
      />
      
      <div className="h-full overflow-y-auto">
        {posts.length === 0 ? (
          <EmptyFeed onRefresh={handleRefresh} />
        ) : (
          <div className="space-y-4 p-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </MobilePage>
  );
}