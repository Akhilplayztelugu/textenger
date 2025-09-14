import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Mock data for stories
const mockStories = [
  {
    id: 1,
    user: { username: 'gamer_alex', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    createdAt: '2h',
    expiresAt: '22h'
  },
  {
    id: 2,
    user: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
    createdAt: '4h',
    expiresAt: '20h'
  },
  {
    id: 3,
    user: { username: 'code_ninja', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop',
    createdAt: '6h',
    expiresAt: '18h'
  },
  {
    id: 4,
    user: { username: 'neon_dreams', displayName: 'Zoe Park', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    createdAt: '8h',
    expiresAt: '16h'
  }
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
      <div className="w-8 h-8 border-2 border-muted-foreground rounded-full" />
    </div>
    <h3 className="mb-2">No stories yet</h3>
    <p className="text-muted-foreground text-sm">Stories you and your friends share will appear here</p>
  </div>
);

const StoryCard = ({ story, onClick }: { story: typeof mockStories[0], onClick: () => void }) => (
  <Card className="cursor-pointer hover:scale-105 transition-transform duration-200" onClick={onClick}>
    <CardContent className="p-0 relative">
      <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
        <ImageWithFallback 
          src={story.mediaUrl}
          alt={`${story.user.displayName}'s story`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* User Avatar */}
        <div className="absolute top-3 left-3">
          <Avatar className="w-8 h-8 border-2 border-white">
            <AvatarImage src={story.user.avatar} />
            <AvatarFallback>{story.user.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>
        
        {/* User Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-medium">{story.user.displayName}</p>
          <p className="text-white/80 text-sm">{story.createdAt} ago</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StoryViewer = ({ 
  stories, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious 
}: {
  stories: typeof mockStories;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  const currentStory = stories[currentIndex];
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0 bg-black border-0">
        <DialogTitle className="sr-only">
          {currentStory.user.displayName}'s Story
        </DialogTitle>
        <DialogDescription className="sr-only">
          Viewing story posted {currentStory.createdAt} ago by {currentStory.user.displayName}
        </DialogDescription>
        <div className="relative h-full">
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
            {stories.map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index <= currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Story Content */}
          <div className="h-full flex items-center justify-center">
            <ImageWithFallback 
              src={currentStory.mediaUrl}
              alt={`${currentStory.user.displayName}'s story`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Navigation */}
          <div className="absolute inset-0 flex">
            <button 
              className="flex-1 z-10"
              onClick={onPrevious}
              disabled={currentIndex === 0}
            />
            <button 
              className="flex-1 z-10"
              onClick={onNext}
              disabled={currentIndex === stories.length - 1}
            />
          </div>
          
          {/* User Info */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={currentStory.user.avatar} />
                <AvatarFallback>{currentStory.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{currentStory.user.displayName}</p>
                <p className="text-white/80 text-sm">{currentStory.createdAt} ago</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function StoriesPage() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleNext = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < mockStories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const handleClose = () => {
    setSelectedStoryIndex(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      {mockStories.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile Stories Layout */}
          <div className="lg:hidden">
            {/* Horizontal Carousel */}
            <div className="p-4 border-b border-border">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mockStories.map((story, index) => (
                  <div key={story.id} className="flex-shrink-0 w-20">
                    <div 
                      className="cursor-pointer active:scale-95 transition-transform"
                      onClick={() => handleStoryClick(index)}
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-pink-500">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                            <ImageWithFallback 
                              src={story.mediaUrl}
                              alt={`${story.user.displayName}'s story`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-center mt-2 truncate">{story.user.displayName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Stories Grid */}
            <div className="p-4">
              <h3 className="font-medium mb-4">Recent Stories</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockStories.slice(0, 4).map((story, index) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onClick={() => handleStoryClick(index)} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden lg:block p-6">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStories.map((story, index) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onClick={() => handleStoryClick(index)} 
                />
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={mockStories}
          currentIndex={selectedStoryIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}