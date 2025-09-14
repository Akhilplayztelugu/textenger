import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Upload, Video, Play, X } from 'lucide-react';
import { useAuthContext } from '../auth/AuthProvider';
import { StorageService } from '../../lib/storage';
import { DatabaseService } from '../../lib/database';

interface CreateClipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClipModal({ isOpen, onClose }: CreateClipModalProps) {
  const { user } = useAuthContext();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      // Check if video is vertical (9:16 aspect ratio preferred)
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        
        // Allow any aspect ratio but prefer vertical
        setSelectedVideo(file);
        setVideoPreview(url);
        
        if (aspectRatio > 1) {
          console.log('Horizontal video detected - vertical videos work best for clips');
        }
      };
      
      video.src = url;
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

  const handleSubmit = async () => {
    if (!selectedVideo || !caption.trim() || !user) return;

    setIsUploading(true);
    try {
      // Upload video to Supabase Storage
      const { publicUrl, error: uploadError } = await StorageService.uploadClipVideo(selectedVideo, user.id);
      
      if (uploadError) throw uploadError;
      if (!publicUrl) throw new Error('Failed to get public URL');

      // Create clip in database
      await DatabaseService.createClip(user.id, publicUrl, caption);

      // Close modal and reset form
      handleClose();
    } catch (error) {
      console.error('Error creating clip:', error);
      alert('Failed to create clip. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    setCaption('');
    setIsPlaying(false);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-purple-950/95 backdrop-blur-md border border-purple-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Video Upload */}
          {!selectedVideo ? (
            <div className="border-2 border-dashed border-purple-500/40 rounded-xl p-8 text-center bg-purple-900/20">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Upload your video</h3>
              <p className="text-purple-300 text-sm mb-4">
                Choose a video file - vertical videos work best!
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
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
              <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-h-80 mx-auto">
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
                    <div className="bg-black/60 rounded-full p-4 backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-purple-900/40 border-purple-500/40 text-purple-200"
              >
                Choose Different Video
              </Button>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Caption</label>
            <Textarea
              placeholder="Write a caption for your clip..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none bg-purple-900/40 border-purple-500/40 text-white placeholder:text-purple-300"
              maxLength={500}
            />
            <div className="text-xs text-purple-400 text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-purple-900/40 border-purple-500/40 text-purple-200"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedVideo || !caption.trim() || isUploading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
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