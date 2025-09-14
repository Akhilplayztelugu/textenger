import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload, Video, X, Play } from 'lucide-react';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadVideoModal({ isOpen, onClose }: UploadVideoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedVideo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Uploading video...', { 
      title, 
      description, 
      video: videoFile?.name,
      size: videoFile?.size 
    });
    setIsLoading(false);
    onClose();
    setTitle('');
    setDescription('');
    setSelectedVideo(null);
    setVideoFile(null);
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setDescription('');
    setSelectedVideo(null);
    setVideoFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-md border border-border/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Upload Video
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Video Upload Area */}
          <div className="space-y-4">
            {selectedVideo ? (
              <div className="relative">
                <video
                  src={selectedVideo}
                  className="w-full h-48 object-cover rounded-lg bg-black"
                  controls
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedVideo(null);
                    setVideoFile(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                {videoFile && (
                  <div className="mt-2 p-3 bg-card/60 rounded-lg border border-border/40">
                    <p className="text-sm text-foreground font-medium">{videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center bg-card/40 backdrop-blur-sm">
                <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Upload your video</p>
                <p className="text-xs text-muted-foreground mb-4">Maximum file size: 100MB</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <Button asChild variant="outline" className="bg-card/60 border-border/40">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    Choose Video
                  </label>
                </Button>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="Enter video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Describe your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
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
              onClick={handleUpload}
              disabled={!selectedVideo || !title.trim() || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}