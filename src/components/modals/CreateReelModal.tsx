import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Video, Play, Pause } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateReelModal({ isOpen, onClose }: CreateReelModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [sound, setSound] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      // Create a video element to check aspect ratio
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const targetAspectRatio = 9 / 16;
        const tolerance = 0.1; // Allow small deviation
        
        if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
          alert('Please select a 9:16 aspect ratio video (vertical format). Your video ratio is ' + 
                (video.videoWidth) + 'x' + (video.videoHeight));
          URL.revokeObjectURL(url);
          return;
        }
        
        setSelectedVideo(file);
        setVideoPreview(url);
      };
      
      video.src = url;
    }
  };

  const handleVideoUpload = () => {
    fileInputRef.current?.click();
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

  const handleSubmit = async () => {
    if (!selectedVideo || !caption.trim()) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      console.log('Reel uploaded:', {
        video: selectedVideo.name,
        caption,
        sound: sound || 'Original Audio'
      });
      
      setIsUploading(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setCaption('');
    setSound('');
    setIsPlaying(false);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-card border-purple-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Upload to Explore</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share a 9:16 vertical video to the explore section
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Video Upload */}
          {!selectedVideo ? (
            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center bg-muted/30">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload your video</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Choose a 9:16 vertical video file (MP4, MOV, AVI)
              </p>
              <Button 
                onClick={handleVideoUpload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Video
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-h-96 max-w-[216px] mx-auto border border-border/40">
                <video
                  ref={videoRef}
                  src={videoPreview || ''}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  onClick={togglePlayPause}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={togglePlayPause}
                  >
                    <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20 pointer-events-none" />

                {/* Mock User Info Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Your username</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleVideoUpload}
                className="w-full"
              >
                Choose Different Video
              </Button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your explore video... Use hashtags to reach more people!"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Sound Input */}
          <div className="space-y-2">
            <Label htmlFor="sound">Sound (Optional)</Label>
            <Input
              id="sound"
              placeholder="Add music or sound name..."
              value={sound}
              onChange={(e) => setSound(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use original audio from your video
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedVideo || !caption.trim() || isUploading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Upload to Explore'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}