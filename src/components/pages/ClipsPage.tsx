import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Music, Play, Pause, UserPlus } from 'lucide-react';
import { cn } from '../ui/utils';
import { CommentsModal } from '../modals/CommentsModal';

// Mock data for clips
const mockClips = [
  {
    id: 1,
    user: { 
      username: 'gamer_alex', 
      displayName: 'Alex Chen', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' 
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    caption: 'Epic gaming setup reveal! 🎮✨ #gaming #setup #rgb',
    sound: 'Epic Gaming Music',
    likes: 2847,
    comments: 156,
    isLiked: false,
    isFriend: false
  },
  {
    id: 2,
    user: { 
      username: 'pixel_art_pro', 
      displayName: 'Maya Storm', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' 
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Creating pixel art magic ✨ Time-lapse of my latest character design #pixelart #gamedev',
    sound: 'Lofi Beats',
    likes: 1923,
    comments: 234,
    isLiked: true,
    isFriend: true
  },
  {
    id: 3,
    user: { 
      username: 'code_ninja', 
      displayName: 'Sam Rivera', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' 
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Coding in the dark with RGB vibes 🌈💻 #coding #developer #nightcoding',
    sound: 'Synthwave Vibes',
    likes: 3456,
    comments: 189,
    isLiked: false,
    isFriend: false
  },
  {
    id: 4,
    user: { 
      username: 'neon_dreams', 
      displayName: 'Zoe Park', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' 
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    caption: 'Cyberpunk city exploration 🌃🚗 Late night drives through neon-lit streets',
    sound: 'Cyberpunk City',
    likes: 4521,
    comments: 278,
    isLiked: true,
    isFriend: false
  },
  {
    id: 5,
    user: { 
      username: 'react_master', 
      displayName: 'Jordan Kim', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' 
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    caption: 'React + Framer Motion magic ✨ Building smooth animations for my latest project #react #webdev',
    sound: 'Tech Beats',
    likes: 2134,
    comments: 145,
    isLiked: false,
    isFriend: true
  }
];

interface ClipCardProps {
  clip: typeof mockClips[0];
  isActive: boolean;
  onOpenComments: () => void;
}

const ClipCard = ({ clip, isActive, onOpenComments }: ClipCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(clip.isLiked);
  const [likes, setLikes] = useState(clip.likes);
  const [isFriend, setIsFriend] = useState(clip.isFriend);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Video play failed:', err);
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected - like the video
      e.preventDefault();
      handleLike();
      
      // Create heart animation
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createHeartAnimation(x, y);
    } else {
      // Single tap - toggle play/pause
      togglePlayPause();
    }
    
    setLastTap(now);
  };

  const createHeartAnimation = (x: number, y: number) => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'heartPop 1s ease-out forwards';
    
    const container = videoRef.current?.parentElement;
    if (container) {
      container.appendChild(heart);
      setTimeout(() => {
        if (container.contains(heart)) {
          container.removeChild(heart);
        }
      }, 1000);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Video play failed:', err);
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleAddFriend = () => {
    setIsFriend(!isFriend);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center clips-interface">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted
        playsInline
        onClick={handleVideoClick}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={clip.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="bg-black/60 rounded-full p-6 backdrop-blur-sm shadow-2xl border border-white/10">
            <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" />
          </div>
        </div>
      )}

      {/* Top gradient overlay for better text readability */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32 pointer-events-none" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-56 pointer-events-none" />

      {/* Bottom Left Content */}
      <div className="absolute bottom-6 left-4 right-20 text-white">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-white/30 shadow-lg">
            <AvatarImage src={clip.user.avatar} />
            <AvatarFallback className="text-white bg-gray-700">{clip.user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white leading-tight text-lg drop-shadow-lg">{clip.user.displayName}</p>
            <p className="text-white/90 leading-tight drop-shadow-md">@{clip.user.username}</p>
          </div>
        </div>

        {/* Caption with neon highlight effect */}
        <p className="text-white leading-relaxed mb-3 pr-4 drop-shadow-lg text-shadow-light max-w-sm">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
            {clip.caption.split(' ').slice(0, -1).join(' ')}
          </span>
          {' '}
          <span className="text-cyan-300 font-medium drop-shadow-md">
            {clip.caption.split(' ').slice(-1)[0]}
          </span>
        </p>

        {/* Sound with neon glow */}
        <div className="flex items-center gap-2 text-white/90">
          <Music className="w-4 h-4 text-cyan-400 drop-shadow-md" />
          <span className="text-sm drop-shadow-md">♪ <span className="text-cyan-300">{clip.sound}</span></span>
        </div>
      </div>

      {/* Right Side Actions with enhanced gaming theme */}
      <div className="absolute right-4 bottom-6 flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={handleLike}
        >
          <Heart className={cn(
            "w-7 h-7 drop-shadow-lg transition-all duration-200", 
            isLiked ? "fill-red-500 text-red-500 animate-pulse" : "hover:text-red-400"
          )} />
          <span className="text-xs font-semibold drop-shadow-md">
            {likes > 999 ? `${(likes / 1000).toFixed(1)}k` : likes}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={onOpenComments}
        >
          <MessageCircle className="w-7 h-7 drop-shadow-lg hover:text-blue-400 transition-colors duration-200" />
          <span className="text-xs font-semibold drop-shadow-md">{clip.comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={handleAddFriend}
        >
          <UserPlus className={cn(
            "w-7 h-7 drop-shadow-lg transition-all duration-200", 
            isFriend ? "text-green-400 fill-green-400/20" : "hover:text-green-400"
          )} />
          <span className="text-xs font-semibold drop-shadow-md">
            {isFriend ? "Friend" : "Add"}
          </span>
        </Button>
      </div>

      <style jsx>{`
        @keyframes heartPop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(-10deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.8) translateY(-50px) rotate(10deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export function ClipsPage() {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [selectedClip, setSelectedClip] = useState<typeof mockClips[0] | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToClip = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const containerHeight = container.clientHeight;
    const targetScrollTop = index * containerHeight;
    
    isScrollingRef.current = true;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set timeout to allow scroll to complete
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (isScrollingRef.current) return;
    
    const delta = e.deltaY;
    let newIndex = currentClipIndex;
    
    if (delta > 0 && currentClipIndex < mockClips.length - 1) {
      // Scrolling down
      newIndex = currentClipIndex + 1;
    } else if (delta < 0 && currentClipIndex > 0) {
      // Scrolling up
      newIndex = currentClipIndex - 1;
    }
    
    if (newIndex !== currentClipIndex) {
      setCurrentClipIndex(newIndex);
      scrollToClip(newIndex);
    }
  };

  const handleTouchStart = useRef({ y: 0, time: 0 });
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      return;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaY = handleTouchStart.current.y - touch.clientY;
    const deltaTime = Date.now() - handleTouchStart.current.time;
    
    // Only proceed if it's a quick swipe (less than 300ms) and has sufficient distance (more than 50px)
    if (deltaTime > 300 || Math.abs(deltaY) < 50) return;
    
    let newIndex = currentClipIndex;
    
    if (deltaY > 0 && currentClipIndex < mockClips.length - 1) {
      // Swiping up (next clip)
      newIndex = currentClipIndex + 1;
    } else if (deltaY < 0 && currentClipIndex > 0) {
      // Swiping down (previous clip)
      newIndex = currentClipIndex - 1;
    }
    
    if (newIndex !== currentClipIndex) {
      setCurrentClipIndex(newIndex);
      scrollToClip(newIndex);
    }
  };

  const handleTouchStartCapture = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleTouchStart.current = {
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleOpenComments = (clip: typeof mockClips[0]) => {
    setSelectedClip(clip);
    setIsCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsModalOpen(false);
    setSelectedClip(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Clips Container with enhanced snap scrolling */}
      <div 
        ref={containerRef}
        className="h-full overflow-hidden clips-container"
        onWheel={handleWheel}
        onTouchStart={handleTouchStartCapture}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {mockClips.map((clip, index) => (
          <div 
            key={clip.id} 
            className="w-full h-full absolute inset-0"
            style={{ 
              transform: `translateY(${(index - currentClipIndex) * 100}%)`,
              transition: isScrollingRef.current ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            <ClipCard 
              clip={clip} 
              isActive={index === currentClipIndex}
              onOpenComments={() => handleOpenComments(clip)}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Comments Modal */}
      {selectedClip && (
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={handleCloseComments}
          post={{
            id: selectedClip.id,
            user: selectedClip.user,
            mediaUrl: selectedClip.videoUrl,
            caption: selectedClip.caption,
            createdAt: '2h',
            likes: selectedClip.likes,
            comments: selectedClip.comments,
            isLiked: selectedClip.isLiked
          }}
        />
      )}
    </div>
  );
}