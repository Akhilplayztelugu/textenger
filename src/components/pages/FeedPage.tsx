import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Heart, MessageCircle, MoreHorizontal, Compass, Home, Bookmark, Flag, EyeOff, UserMinus, Pin, Share, VolumeX } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CommentsModal } from '../modals/CommentsModal';
import { ReelsExplore } from '../ReelsExplore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { shufflePostsForUser, getUserSessionSeed, isFreshSession } from '../utils/postShuffle';
import '../utils/sessionManager'; // Import for debugging utilities
import { cn } from '../ui/utils';


// Mock data for posts
const mockPosts = [
  {
    id: 1,
    user: { username: 'gamer_alex', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop',
    caption: 'Just finished building my new gaming setup! RGB everything 🌈',
    createdAt: '2h',
    likes: 124,
    comments: 8,
    isLiked: false
  },
  {
    id: 2,
    user: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
    caption: 'Working on some retro pixel art for my upcoming indie game ✨',
    createdAt: '4h',
    likes: 89,
    comments: 12,
    isLiked: true
  },
  {
    id: 3,
    user: { username: 'code_ninja', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=600&fit=crop',
    caption: 'Late night coding session. Coffee is life ☕',
    createdAt: '6h',
    likes: 67,
    comments: 5,
    isLiked: false
  }
];

const explorePosts = [
  {
    id: 4,
    user: { username: 'neon_dreams', displayName: 'Zoe Park', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop',
    caption: 'Cyberpunk vibes in the city tonight 🌃',
    createdAt: '8h',
    likes: 156,
    comments: 23,
    isLiked: false
  },
  {
    id: 5,
    user: { username: 'react_master', displayName: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop',
    caption: 'New React features are incredible! 🚀',
    createdAt: '1d',
    likes: 203,
    comments: 17,
    isLiked: false
  }
];

const EmptyState = ({ tab }: { tab: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6">
      <Heart className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-3 text-foreground">No posts yet</h3>
    <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
      Follow some people to see their posts in your feed
    </p>
  </div>
);

const PostCard = ({ post, onOpenComments }: { 
  post: typeof mockPosts[0];
  onOpenComments: (post: typeof mockPosts[0]) => void;
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handlePinPost = () => {
    console.log('Pin post:', post.id);
  };

  const handleMuteUser = () => {
    console.log('Mute user:', post.user.username);
  };

  const handleSharePost = () => {
    console.log('Share post:', post.id);
  };

  const handleReportPost = () => {
    console.log('Report post:', post.id);
  };

  return (
    <Card className="mb-4 border-0 lg:border lg:mb-6 bg-card/60 lg:bg-card/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4 lg:p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="w-11 h-11 ring-2 ring-border/20 flex-shrink-0">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback className="font-semibold">{post.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <p className="font-semibold text-foreground leading-tight">{post.user.displayName}</p>
              <p className="text-sm text-muted-foreground leading-tight">@{post.user.username} • {post.createdAt}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 flex-shrink-0 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-slate-900/50">
              <DropdownMenuItem 
                onClick={handlePinPost} 
                className="cursor-pointer text-slate-200 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 focus:bg-slate-700/50 focus:text-white rounded-md mx-1 my-0.5"
              >
                <Pin className="w-4 h-4 mr-3 text-blue-400" />
                Pin Post
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleMuteUser} 
                className="cursor-pointer text-slate-200 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 focus:bg-slate-700/50 focus:text-white rounded-md mx-1 my-0.5"
              >
                <VolumeX className="w-4 h-4 mr-3 text-orange-400" />
                Mute User
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSharePost} 
                className="cursor-pointer text-slate-200 hover:bg-slate-700/50 hover:text-white transition-colors duration-200 focus:bg-slate-700/50 focus:text-white rounded-md mx-1 my-0.5"
              >
                <Share className="w-4 h-4 mr-3 text-green-400" />
                Share Post
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700/50 my-1" />
              <DropdownMenuItem 
                onClick={handleReportPost} 
                className="cursor-pointer text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors duration-200 focus:bg-red-900/30 focus:text-red-300 rounded-md mx-1 my-0.5"
              >
                <Flag className="w-4 h-4 mr-3" />
                Report Content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Post Media */}
        <div className="mb-4 rounded-lg overflow-hidden -mx-4 lg:mx-0">
          <ImageWithFallback 
            src={post.mediaUrl}
            alt="Post content"
            className="w-full h-80 lg:h-64 object-cover"
          />
        </div>
        
        {/* Post Actions */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "gap-2 h-8 px-2 -ml-1 flex items-center justify-center",
                isLiked ? "text-red-500" : ""
              )}
              onClick={handleLike}
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-current" : "")} />
              <span className="text-sm">{likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 h-8 px-2 flex items-center justify-center"
              onClick={() => onOpenComments(post)}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-8 w-8 p-0 flex items-center justify-center",
              isSaved ? "text-primary" : ""
            )}
            onClick={handleSave}
          >
            <Bookmark className={cn("w-5 h-5", isSaved ? "fill-current" : "")} />
          </Button>
        </div>
        
        {/* Post Caption */}
        <div className="space-y-1 px-1">
          <p className="text-sm leading-relaxed">{post.caption}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export function FeedPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore'>('home');
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [userSeed, setUserSeed] = useState<string>('');

  // Initialize user session seed and shuffle posts
  useEffect(() => {
    try {
      const seed = getUserSessionSeed();
      if (seed && typeof seed === 'string') {
        setUserSeed(seed);
        
        // Log shuffling info for development
        console.log('🔀 Posts shuffled for user session:', seed.substring(0, 8) + '...');
        console.log('📱 Fresh session:', isFreshSession());
        console.log('📊 Home posts count:', mockPosts?.length || 0);
        console.log('📊 Explore posts count:', explorePosts?.length || 0);
      } else {
        console.warn('Invalid seed generated, using fallback');
        setUserSeed('fallback-' + Date.now());
      }
    } catch (error) {
      console.error('Error initializing user session:', error);
      setUserSeed('error-fallback-' + Date.now());
    }
  }, []);

  // Shuffle posts based on user session
  const shuffledHomePosts = useMemo(() => {
    if (!userSeed || !mockPosts || mockPosts.length === 0) return mockPosts || [];
    try {
      const shuffled = shufflePostsForUser(mockPosts, userSeed);
      // Filter out any undefined values just in case
      return shuffled.filter(post => post && post.id);
    } catch (error) {
      console.warn('Error shuffling home posts:', error);
      return mockPosts;
    }
  }, [userSeed]);

  const shuffledExplorePosts = useMemo(() => {
    if (!userSeed || !explorePosts || explorePosts.length === 0) return explorePosts || [];
    try {
      const shuffled = shufflePostsForUser(explorePosts, userSeed + '-explore');
      // Filter out any undefined values just in case
      return shuffled.filter(post => post && post.id);
    } catch (error) {
      console.warn('Error shuffling explore posts:', error);
      return explorePosts;
    }
  }, [userSeed]);

  const currentPosts = useMemo(() => {
    const posts = activeTab === 'explore' ? shuffledExplorePosts : shuffledHomePosts;
    // Ensure we always return a valid array with valid posts
    return Array.isArray(posts) ? posts.filter(post => post && typeof post === 'object' && post.id) : [];
  }, [activeTab, shuffledExplorePosts, shuffledHomePosts]);

  const handleOpenComments = (post: typeof mockPosts[0]) => {
    setSelectedPost(post);
    setIsCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Subtle shuffle indicator for development */}
      {process.env.NODE_ENV === 'development' && userSeed && (
        <div className="hidden lg:block fixed bottom-4 right-4 z-50">
          <div className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            Session: {userSeed.substring(0, 8)}...
          </div>
        </div>
      )}
      
      {/* Mobile Tab Navigation */}
      <div className="bg-card border-b border-border z-10 lg:hidden flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
              activeTab === 'home' 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground"
            )}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
              activeTab === 'explore' 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground"
            )}
          >
            <Compass className="w-4 h-4" />
            <span className="font-medium">Explore</span>
          </button>
        </div>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden lg:block p-6 border-b border-border flex-shrink-0">
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'home' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('home')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
          <Button 
            variant={activeTab === 'explore' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('explore')}
            className="gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore
          </Button>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'explore' ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ReelsExplore />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="w-full flex justify-center">
              <div className="w-full max-w-lg lg:max-w-2xl">
                {currentPosts.length === 0 ? (
                  <EmptyState tab={activeTab} />
                ) : (
                  <div className="lg:p-6">
                    {currentPosts.map((post) => (
                      <PostCard key={post.id} post={post} onOpenComments={handleOpenComments} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Modal */}
          {selectedPost && (
            <CommentsModal
              isOpen={isCommentsModalOpen}
              onClose={handleCloseComments}
              post={selectedPost}
            />
          )}
        </div>
      )}
    </div>
  );
}