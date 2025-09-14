import React, { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Music, Volume2, VolumeX } from 'lucide-react';
import { cn } from './ui/utils';

// Mock data for reels
const mockReels = [
  {
    id: 1,
    user: {
      username: 'gamer_alex',
      displayName: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=800&fit=crop',
    caption: 'Building an epic gaming setup! What do you think? 🎮',
    music: 'Original audio',
    likes: 1240,
    comments: 89,
    shares: 45,
    isLiked: false,
    duration: '0:15'
  },
  {
    id: 2,
    user: {
      username: 'pixel_art_pro',
      displayName: 'Maya Storm',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=800&fit=crop',
    caption: 'Creating pixel art magic ✨ Time-lapse of my latest character design!',
    music: 'Synthwave Vibes',
    likes: 890,
    comments: 124,
    shares: 67,
    isLiked: true,
    duration: '0:30'
  },
  {
    id: 3,
    user: {
      username: 'code_ninja',
      displayName: 'Sam Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=800&fit=crop',
    caption: 'Coding at 3 AM hits different 👨‍💻 Building something amazing!',
    music: 'Lo-fi Coding Beats',
    likes: 2340,
    comments: 156,
    shares: 89,
    isLiked: false,
    duration: '0:45'
  },
  {
    id: 4,
    user: {
      username: 'neon_dreams',
      displayName: 'Zoe Park',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=800&fit=crop',
    caption: 'Cyberpunk aesthetics in my room setup 🌟 RGB overload!',
    music: 'Cyberpunk 2077 OST',
    likes: 1870,
    comments: 203,
    shares: 112,
    isLiked: true,
    duration: '0:25'
  },
  {
    id: 5,
    user: {
      username: 'react_master',
      displayName: 'Jordan Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=800&fit=crop',
    caption: 'React 18 features that will blow your mind! 🚀 Swipe for code snippets',
    music: 'Tech House Mix',
    likes: 3450,
    comments: 287,
    shares: 178,
    isLiked: false,
    duration: '1:00'
  },
  {
    id: 6,
    user: {
      username: 'indie_dev',
      displayName: 'Riley Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
    },
    videoUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=800&fit=crop',
    caption: 'Day in the life of an indie game developer 🎮 Follow for more dev content!',
    music: 'Indie Game OST',
    likes: 1560,
    comments: 134,
    shares: 78,
    isLiked: false,
    duration: '0:35'
  }
];

interface ReelCardProps {
  reel: typeof mockReels[0];
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, isActive, onLike, onComment }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likes);
  const [isMuted, setIsMuted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike();
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full snap-start snap-always bg-black overflow-hidden aspect-[9/16]">
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={reel.thumbnail}
          alt={`Reel by ${reel.user.displayName}`}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          {/* Music info box - Hidden */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 pointer-events-none">
            <Music className="w-3 h-3" />
            <span className="text-xs font-medium truncate max-w-32">{reel.music}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMute}
              className="h-8 w-8 p-0 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="flex items-end justify-between">
          {/* User Info & Caption */}
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-8 h-8 ring-2 ring-white/20">
                <AvatarImage src={reel.user.avatar} />
                <AvatarFallback className="text-xs">{reel.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">{reel.user.displayName}</span>
              <span className="text-xs text-white/70">@{reel.user.username}</span>
            </div>
            <p className="text-sm line-clamp-3 leading-relaxed">
              {reel.caption}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "h-12 w-12 p-0 rounded-full backdrop-blur-sm border-0 flex flex-col gap-1",
                isLiked 
                  ? "bg-red-500/80 hover:bg-red-500/90 text-white" 
                  : "bg-black/30 hover:bg-black/50 text-white"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-current" : "")} />
              <span className="text-xs font-medium">
                {likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="h-12 w-12 p-0 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0 flex flex-col gap-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">
                {reel.comments > 999 ? `${(reel.comments / 1000).toFixed(1)}K` : reel.comments}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Duration Badge - Hidden */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 pointer-events-none">
        {reel.duration}
      </div>
    </div>
  );
};

export function ReelsExplore() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Handle vertical scroll with snap
  const scrollToIndex = (index: number) => {
    if (!containerRef.current || isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    const container = containerRef.current;
    const targetScrollTop = index * container.clientHeight;
    
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });

    setCurrentIndex(index);
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  // Handle wheel events for desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;

      if (e.deltaY > 0 && currentIndex < mockReels.length - 1) {
        // Scroll down
        scrollToIndex(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scroll up
        scrollToIndex(currentIndex - 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]);

  // Handle touch events for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent default scrolling
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      
      touchEndY.current = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY.current;
      
      // Minimum swipe distance to trigger scroll
      const minSwipeDistance = 50;
      
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && currentIndex < mockReels.length - 1) {
          // Swipe up - next reel
          scrollToIndex(currentIndex + 1);
        } else if (deltaY < 0 && currentIndex > 0) {
          // Swipe down - previous reel
          scrollToIndex(currentIndex - 1);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex]);

  const handleReelAction = (action: string, reelId: number) => {
    console.log(`${action} on reel ${reelId}`);
  };

  return (
    <div className="h-full w-full relative bg-black overflow-hidden">
      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-hidden reels-container reel-scroll"
      >
        {mockReels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="h-full w-full reel-item flex-shrink-0"
          >
            <ReelCard
              reel={reel}
              isActive={index === currentIndex}
              onLike={() => handleReelAction('like', reel.id)}
              onComment={() => handleReelAction('comment', reel.id)}
            />
          </div>
        ))}
      </div>

      {/* Progress Indicator - Hidden */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 pointer-events-none">
        {mockReels.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-4 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-white" 
                : "bg-white/30"
            )}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}