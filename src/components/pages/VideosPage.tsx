import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Play, MoreHorizontal, Clock } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Mock data for videos
const mockVideos = [
  {
    id: 1,
    title: 'Epic Gaming Montage - Best Moments 2024',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop',
    duration: '12:34',
    uploader: { username: 'gamer_alex', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    views: '2.1K',
    uploadedAt: '2 days ago'
  },
  {
    id: 2,
    title: 'Pixel Art Tutorial: Creating Retro Characters',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=225&fit=crop',
    duration: '18:47',
    uploader: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    views: '5.4K',
    uploadedAt: '1 week ago'
  },
  {
    id: 3,
    title: 'Full Stack Development in 2024: Complete Guide',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
    duration: '45:22',
    uploader: { username: 'code_ninja', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    views: '12.8K',
    uploadedAt: '3 days ago'
  },
  {
    id: 4,
    title: 'Cyberpunk City Design Process',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
    duration: '23:15',
    uploader: { username: 'neon_dreams', displayName: 'Zoe Park', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    views: '8.9K',
    uploadedAt: '5 days ago'
  },
  {
    id: 5,
    title: 'React Performance Optimization Tips',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: '31:08',
    uploader: { username: 'react_master', displayName: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    views: '15.2K',
    uploadedAt: '1 week ago'
  },
  {
    id: 6,
    title: 'Blender 3D Animation Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=225&fit=crop',
    duration: '1:12:45',
    uploader: { username: '3d_wizard', displayName: 'Alex Taylor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    views: '21.3K',
    uploadedAt: '2 weeks ago'
  }
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <Play className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="mb-2">No videos yet</h3>
    <p className="text-muted-foreground text-sm">Upload your first video to get started</p>
  </div>
);

const VideoCard = ({ video }: { video: typeof mockVideos[0] }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 lg:active:scale-100">
    <CardContent className="p-0">
      {/* Video Thumbnail */}
      <div className="relative aspect-video">
        <ImageWithFallback 
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center opacity-80 lg:opacity-0 lg:hover:opacity-100 transition-opacity duration-200">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-3 lg:p-4">
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={video.uploader.avatar} />
            <AvatarFallback>{video.uploader.displayName[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 mb-1 text-sm lg:text-base leading-snug">{video.title}</h3>
            <p className="text-sm text-muted-foreground">{video.uploader.displayName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function VideosPage() {
  return (
    <div className="h-full overflow-y-auto">
      {mockVideos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}