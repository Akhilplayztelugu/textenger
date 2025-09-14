import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageCircle, Heart, Send, X } from 'lucide-react';
import { cn } from '../ui/utils';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    user: {
      username: string;
      displayName: string;
      avatar: string;
    };
    caption: string;
    comments: number;
  };
}

// Mock comments data
const mockComments = [
  {
    id: 1,
    user: { username: 'alex_gamer', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    content: 'This is amazing! 🔥',
    time: '2h ago',
    likes: 12,
    isLiked: false
  },
  {
    id: 2,
    user: { username: 'maya_pixel', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    content: 'Love the colors and composition! Keep it up 💯',
    time: '1h ago',
    likes: 8,
    isLiked: true
  },
  {
    id: 3,
    user: { username: 'sam_code', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    content: 'How did you achieve this effect?',
    time: '45m ago',
    likes: 3,
    isLiked: false
  }
];

export function CommentsModal({ isOpen, onClose, post }: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: { 
          username: 'you', 
          displayName: 'You', 
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' 
        },
        content: newComment.trim(),
        time: 'now',
        likes: 0,
        isLiked: false
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comments
          </DialogTitle>
        </DialogHeader>
        
        {/* Post Caption */}
        <div className="flex-shrink-0 p-4 bg-card/40 rounded-lg border border-border/30">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.user.avatar} />
              <AvatarFallback>{post.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{post.user.displayName}</span>
                <span className="text-muted-foreground ml-2">{post.caption}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>{comment.user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-card/60 rounded-lg p-3 border border-border/30">
                    <p className="text-sm">
                      <span className="font-semibold">{comment.user.displayName}</span>
                      <span className="text-muted-foreground ml-1">@{comment.user.username}</span>
                    </p>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={cn(
                        "flex items-center gap-1 text-xs transition-colors",
                        comment.isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Heart className={cn("w-3 h-3", comment.isLiked ? "fill-current" : "")} />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="flex-shrink-0 border-t border-border/40 pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                className="bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}