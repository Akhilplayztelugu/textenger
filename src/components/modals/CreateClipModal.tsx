import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Video, Play, Pause, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CreateClipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClipModal({ isOpen, onClose }: CreateClipModalProps) {
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
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
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
      console.log('Clip uploaded:', {
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
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Create Clip</DialogTitle>
          <DialogDescription className="text-slate-300">
            Share a short video with your followers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Video Upload */}
          {!selectedVideo ? (
            <div className="border-2 border-dashed border-slate-600/60 rounded-xl p-8 text-center bg-slate-800/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <Video className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Upload your video</h3>
              <p className="text-slate-400 text-sm mb-4">
                Choose a video file (MP4, MOV, AVI) - Gaming clips work best!
              </p>
              <Button 
                onClick={handleVideoUpload}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25"
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
              <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl overflow-hidden aspect-[9/16] max-h-80 mx-auto border border-slate-700/50">
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
                    <div className="bg-black/60 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
                      <Play className="w-8 h-8 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                )}

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24 pointer-events-none" />

                {/* Mock User Info Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Avatar className="w-7 h-7 ring-2 ring-white/30">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="bg-gray-700 text-white">You</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold drop-shadow-lg">Your username</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleVideoUpload}
                className="w-full bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
              >
                Choose Different Video
              </Button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="text-slate-200">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption... Use hashtags to reach more people! #gaming #epic"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              maxLength={500}
            />
            <div className="text-xs text-slate-400 text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Sound Input */}
          <div className="space-y-2">
            <Label htmlFor="sound" className="text-slate-200">Sound (Optional)</Label>
            <Input
              id="sound"
              placeholder="Add music or sound name... e.g., 'Epic Gaming Music'"
              value={sound}
              onChange={(e) => setSound(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <p className="text-xs text-slate-400">
              Leave empty to use original audio from your video
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedVideo || !caption.trim() || isUploading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Share Clip'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}