import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Upload, Bookmark, Camera, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStoryModal({ isOpen, onClose }: CreateStoryModalProps) {
  const [storyText, setStoryText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedMedia(e.target?.result as string);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Creating story...', { text: storyText, media: selectedMedia, type: mediaType });
    setIsLoading(false);
    onClose();
    setStoryText('');
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handleClose = () => {
    onClose();
    setStoryText('');
    setSelectedMedia(null);
    setMediaType(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Create Story
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Media Upload Area */}
          <div className="space-y-4">
            {selectedMedia ? (
              <div className="relative">
                {mediaType === 'video' ? (
                  <video
                    src={selectedMedia}
                    className="w-full h-64 object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <ImageWithFallback
                    src={selectedMedia}
                    alt="Selected media"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedMedia(null);
                    setMediaType(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center bg-card/40 backdrop-blur-sm">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Upload a photo or video for your story</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="story-media-upload"
                />
                <Button asChild variant="outline" className="bg-card/60 border-border/40">
                  <label htmlFor="story-media-upload" className="cursor-pointer">
                    Choose Media
                  </label>
                </Button>
              </div>
            )}
          </div>

          {/* Story Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Story Text (Optional)</label>
            <Input
              placeholder="Add text to your story..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Stories disappear after 24 hours</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-card/60 border-border/40 text-foreground hover:bg-accent/60"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateStory}
              disabled={!selectedMedia || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Creating...' : 'Share Story'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}