import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Upload, Image, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuthContext } from '../auth/AuthProvider';
import { StorageService } from '../../lib/storage';
import { DatabaseService } from '../../lib/database';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user } = useAuthContext();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePost = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      // Upload media to Supabase Storage
      const { publicUrl, error: uploadError } = await StorageService.uploadPostMedia(selectedFile, user.id);
      
      if (uploadError) throw uploadError;
      if (!publicUrl) throw new Error('Failed to get public URL');

      // Create post in database
      const mediaType = selectedFile.type.startsWith('video/') ? 'video' : 'image';
      await DatabaseService.createPost(user.id, publicUrl, mediaType, caption);

      // Close modal and reset form
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setCaption('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-purple-950/95 backdrop-blur-md border border-purple-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-400" />
            Create Post
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Media Upload */}
          {previewUrl ? (
            <div className="relative">
              {selectedFile?.type.startsWith('video/') ? (
                <video
                  src={previewUrl}
                  className="w-full h-64 object-cover rounded-lg"
                  controls
                />
              ) : (
                <ImageWithFallback
                  src={previewUrl}
                  alt="Selected media"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-purple-500/40 rounded-lg p-8 text-center bg-purple-900/20">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 mb-4">Upload a photo or video</p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="post-media-upload"
              />
              <Button asChild variant="outline" className="bg-purple-900/40 border-purple-500/40 text-purple-200">
                <label htmlFor="post-media-upload" className="cursor-pointer">
                  Choose Media
                </label>
              </Button>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Caption</label>
            <Textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] bg-purple-900/40 border-purple-500/40 text-white placeholder:text-purple-300 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-purple-400 text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-purple-900/40 border-purple-500/40 text-purple-200 hover:bg-purple-800/40"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePost}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                'Share Post'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}