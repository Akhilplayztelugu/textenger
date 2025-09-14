import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Upload, Image, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Creating post...', { caption, image: selectedImage });
    setIsLoading(false);
    onClose();
    setCaption('');
    setSelectedImage(null);
  };

  const handleClose = () => {
    onClose();
    setCaption('');
    setSelectedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Create Post
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Image Upload Area */}
          <div className="space-y-4">
            {selectedImage ? (
              <div className="relative">
                <ImageWithFallback
                  src={selectedImage}
                  alt="Selected image"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border/60 rounded-lg p-8 text-center bg-card/40 backdrop-blur-sm">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Upload an image for your post</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild variant="outline" className="bg-card/60 border-border/40">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Choose Image
                  </label>
                </Button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Caption</label>
            <Textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground resize-none"
            />
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
              onClick={handlePost}
              disabled={!selectedImage || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Creating...' : 'Share Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}