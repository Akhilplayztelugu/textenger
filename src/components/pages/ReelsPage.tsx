import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Share, Music, MoreHorizontal, Play, Pause } from 'lucide-react';
import { cn } from '../ui/utils';
import { CommentsModal } from '../modals/CommentsModal';

// Mock data for reels
const mockReels = [
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
    shares: 89,
    isLiked: false,
    isFollowing: false
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
    shares: 67,
    isLiked: true,
    isFollowing: true
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
    shares: 123,
    isLiked: false,
    isFollowing: false
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
    shares: 156,
    isLiked: true,
    isFollowing: true
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
    shares: 78,
    isLiked: false,
    isFollowing: false
  }
];

interface ReelCardProps {
  reel: typeof mockReels[0];
  isActive: boolean;
  onOpenComments: () => void;
}

const ReelCard = ({ reel, isActive, onOpenComments }: ReelCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likes);
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing);

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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    console.log('Share reel:', reel.id);
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center reels-interface">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        onClick={togglePlayPause}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={reel.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-48 pointer-events-none" />

      {/* Bottom Left Content */}
      <div className="absolute bottom-6 left-4 right-20 text-white">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 ring-2 ring-white/30">
            <AvatarImage src={reel.user.avatar} />
            <AvatarFallback className="text-white bg-gray-700">{reel.user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white leading-tight">{reel.user.displayName}</p>
            <p className="text-white/80 text-sm leading-tight">@{reel.user.username}</p>
          </div>
          {!isFollowing && (
            <Button 
              size="sm" 
              className="bg-white text-black hover:bg-white/90 font-semibold px-4 py-1 h-8"
              onClick={handleFollow}
            >
              Follow
            </Button>
          )}
        </div>

        {/* Caption */}
        <p className="text-white text-sm leading-relaxed mb-2 pr-4">{reel.caption}</p>

        {/* Sound */}
        <div className="flex items-center gap-2 text-white/80">
          <Music className="w-4 h-4" />
          <span className="text-sm">♪ {reel.sound}</span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-6 flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex flex-col gap-1"
          onClick={handleLike}
        >
          <Heart className={cn("w-6 h-6", isLiked ? "fill-red-500 text-red-500" : "")} />
          <span className="text-xs">{likes > 999 ? `${(likes / 1000).toFixed(1)}k` : likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex flex-col gap-1"
          onClick={onOpenComments}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">{reel.comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex flex-col gap-1"
          onClick={handleShare}
        >
          <Share className="w-6 h-6" />
          <span className="text-xs">{reel.shares}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
        >
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export function ReelsPage() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [selectedReel, setSelectedReel] = useState<typeof mockReels[0] | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / containerHeight);
    
    if (newIndex !== currentReelIndex && newIndex >= 0 && newIndex < mockReels.length) {
      setCurrentReelIndex(newIndex);
    }
  };

  const handleOpenComments = (reel: typeof mockReels[0]) => {
    setSelectedReel(reel);
    setIsCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsModalOpen(false);
    setSelectedReel(null);
  };

  return (
    <div className="h-full bg-black">
      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory reels-container"
        onScroll={handleScroll}
      >
        {mockReels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="w-full h-full snap-start flex-shrink-0"
            style={{ height: '100vh', maxHeight: '100vh' }}
          >
            <ReelCard 
              reel={reel} 
              isActive={index === currentReelIndex}
              onOpenComments={() => handleOpenComments(reel)}
            />
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {selectedReel && (
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={handleCloseComments}
          post={{
            id: selectedReel.id,
            user: selectedReel.user,
            mediaUrl: selectedReel.videoUrl,
            caption: selectedReel.caption,
            createdAt: '2h',
            likes: selectedReel.likes,
            comments: selectedReel.comments,
            isLiked: selectedReel.isLiked
          }}
        />
      )}


    </div>
  );
}