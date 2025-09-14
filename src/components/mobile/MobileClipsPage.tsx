import React, { useState, useEffect, useRef } from 'react';
import { MobilePage } from './MobileLayout';
import { MobileTopBar } from './MobileTopBar';
import { DatabaseService } from '../../lib/database';
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime';
import { useAuthContext } from '../auth/AuthProvider';
import { ClipCard } from '../clips/ClipCard';
import type { Clip } from '../../lib/supabase';

export function MobileClipsPage() {
  const { user } = useAuthContext();
  const { subscribeToClips } = useSupabaseRealtime();
  const [clips, setClips] = useState<Clip[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Load initial clips
  useEffect(() => {
    loadClips();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    if (user) {
      subscribeToClips((payload) => {
        console.log('Clips update:', payload);
        loadClips();
      });
    }
  }, [user, subscribeToClips]);

  const loadClips = async () => {
    try {
      const data = await DatabaseService.getClips(20, 0);
      setClips(data || []);
    } catch (error) {
      console.error('Error loading clips:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToClip = (index: number) => {
    if (!containerRef.current || isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    const container = containerRef.current;
    const targetScrollTop = index * container.clientHeight;
    
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });

    setCurrentIndex(index);
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  // Handle touch gestures for clip navigation
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrollingRef.current) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentIndex < clips.length - 1) {
        // Swipe up - next clip
        scrollToClip(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        // Swipe down - previous clip
        scrollToClip(currentIndex - 1);
      }
    }
  };

  const handleLike = async (clipId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await DatabaseService.unlikeClip(user.id, clipId);
      } else {
        await DatabaseService.likeClip(user.id, clipId);
      }
    } catch (error) {
      console.error('Error toggling clip like:', error);
    }
  };

  if (loading) {
    return (
      <MobilePage>
        <MobileTopBar title="Clips" />
        <div className="flex items-center justify-center h-full bg-black">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-purple-300">Loading clips...</p>
          </div>
        </div>
      </MobilePage>
    );
  }

  return (
    <MobilePage hasTopBar={true} hasBottomNav={true}>
      <MobileTopBar title="Clips" showSearch={false} />
      
      {/* Clips Container - Snap scrolling between top and bottom bars */}
      <div 
        ref={containerRef}
        className="h-full overflow-hidden bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {clips.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-6">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <div className="w-10 h-10 border-2 border-purple-400 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">No clips yet</h3>
              <p className="text-purple-300 leading-relaxed">
                Be the first to share a clip! Tap the + button to get started.
              </p>
            </div>
          </div>
        ) : (
          clips.map((clip, index) => (
            <div 
              key={clip.id} 
              className="w-full h-full absolute inset-0"
              style={{ 
                transform: `translateY(${(index - currentIndex) * 100}%)`,
                transition: isScrollingRef.current ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
              }}
            >
              <ClipCard 
                clip={clip} 
                isActive={index === currentIndex}
                currentUserId={user?.id}
                onLike={handleLike}
              />
            </div>
          ))
        )}
      </div>
    </MobilePage>
  );
}