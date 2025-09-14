import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Share, Music, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../ui/utils';
import type { Clip } from '../../lib/supabase';

interface ClipCardProps {
  clip: Clip;
  isActive: boolean;
  currentUserId?: string;
  onLike: (clipId: string, isLiked: boolean) => void;
  onComment?: (clip: Clip) => void;
  onShare?: (clip: Clip) => void;
}

export function ClipCard({ 
  clip, 
  isActive, 
  currentUserId, 
  onLike, 
  onComment, 
  onShare 
}: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(
    clip.clip_likes?.some(like => like.user_id === currentUserId) || false
  );
  const [likesCount, setLikesCount] = useState(clip.clip_likes?.length || 0);
  const [lastTap, setLastTap] = useState(0);

  // Auto-play when active
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
      // Double tap detected - like the clip
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
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);
    onLike(clip.id, isLiked);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={clip.video_url} type="video/mp4" />
      </video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="bg-black/60 rounded-full p-6 backdrop-blur-sm shadow-2xl border border-white/10">
            <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="h-10 w-10 p-0 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0 rounded-full"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Bottom gradient for text readability */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-56 pointer-events-none" />

      {/* Bottom Left Content */}
      <div className="absolute bottom-6 left-4 right-20 text-white">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-white/30 shadow-lg">
            <AvatarImage src={clip.profiles?.avatar_url} />
            <AvatarFallback className="text-white bg-gray-700">
              {clip.profiles?.display_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white leading-tight text-lg drop-shadow-lg">
              {clip.profiles?.display_name}
            </p>
            <p className="text-white/90 leading-tight drop-shadow-md">
              @{clip.profiles?.username}
            </p>
          </div>
        </div>

        {/* Caption */}
        <p className="text-white leading-relaxed mb-3 pr-4 drop-shadow-lg max-w-sm">
          {clip.caption}
        </p>

        {/* Music info */}
        <div className="flex items-center gap-2 text-white/90">
          <Music className="w-4 h-4 text-cyan-400 drop-shadow-md" />
          <span className="text-sm drop-shadow-md">♪ Original Audio</span>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-6 flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105",
            isLiked && "bg-red-500/30"
          )}
          onClick={handleLike}
        >
          <Heart className={cn(
            "w-7 h-7 drop-shadow-lg transition-all duration-200", 
            isLiked ? "fill-red-500 text-red-500 animate-pulse" : "hover:text-red-400"
          )} />
          <span className="text-xs font-semibold drop-shadow-md">
            {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={() => onComment?.(clip)}
        >
          <MessageCircle className="w-7 h-7 drop-shadow-lg hover:text-blue-400 transition-colors duration-200" />
          <span className="text-xs font-semibold drop-shadow-md">0</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-14 h-14 p-0 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex flex-col gap-1 rounded-full border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          onClick={() => onShare?.(clip)}
        >
          <Share className="w-7 h-7 drop-shadow-lg hover:text-green-400 transition-colors duration-200" />
          <span className="text-xs font-semibold drop-shadow-md">Share</span>
        </Button>
      </div>
    </div>
  );
}