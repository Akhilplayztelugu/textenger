import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Heart, MessageCircle, MoreHorizontal, Share } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { cn } from '../ui/utils';
import type { Post } from '../../lib/supabase';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string, isLiked: boolean) => void;
  onComment?: (post: Post) => void;
  onShare?: (post: Post) => void;
}

export function PostCard({ 
  post, 
  currentUserId, 
  onLike, 
  onComment, 
  onShare 
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(
    post.post_likes?.some(like => like.user_id === currentUserId) || false
  );
  const [likesCount, setLikesCount] = useState(post.post_likes?.length || 0);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);
    onLike(post.id, isLiked);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-purple-950/40 border-purple-500/30 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback className="bg-purple-600 text-white">
                {post.profiles?.display_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white">{post.profiles?.display_name}</p>
              <p className="text-sm text-purple-300">
                @{post.profiles?.username} • {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-300">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Post Media */}
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.media_type === 'video' ? (
            <video
              src={post.media_url}
              className="w-full h-80 object-cover"
              controls
              playsInline
            />
          ) : (
            <ImageWithFallback 
              src={post.media_url}
              alt="Post content"
              className="w-full h-80 object-cover"
            />
          )}
        </div>
        
        {/* Post Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "gap-2 h-10 px-3 rounded-full",
                isLiked ? "text-red-400 bg-red-500/20" : "text-purple-300 hover:text-white"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("w-5 h-5", isLiked ? "fill-current" : "")} />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 h-10 px-3 rounded-full text-purple-300 hover:text-white"
              onClick={() => onComment?.(post)}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.post_comments?.length || 0}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 text-purple-300 hover:text-white"
            onClick={() => onShare?.(post)}
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Post Caption */}
        {post.caption && (
          <div className="space-y-1">
            <p className="text-sm leading-relaxed text-purple-100">{post.caption}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}