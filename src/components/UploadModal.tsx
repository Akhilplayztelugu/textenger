import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Image, Bookmark, Video } from 'lucide-react';
import { CreatePostModal } from './modals/CreatePostModal';
import { CreateStoryModal } from './modals/CreateStoryModal';
import { CreateReelModal } from './modals/CreateReelModal';


interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const uploadOptions = [
  { id: 'post', icon: Image, label: 'Post', description: 'Share a photo or video' },
  { id: 'story', icon: Bookmark, label: 'Story', description: 'Share a temporary story' },
  { id: 'reel', icon: Video, label: 'Upload to Explore', description: 'Share a 9:16 video reel' },
];

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (type: string) => {
    setActiveModal(type);
    onClose(); // Close the main upload modal
  };

  const handleCloseActiveModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md glass-card border-purple-500/40 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">What would you like to create?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose the type of content you want to share with your followers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {uploadOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/60 border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-200 active:scale-95 neon-border"
                  onClick={() => handleOpenModal(option.id)}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center neon-glow">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Modals */}
      <CreatePostModal 
        isOpen={activeModal === 'post'} 
        onClose={handleCloseActiveModal} 
      />
      <CreateStoryModal 
        isOpen={activeModal === 'story'} 
        onClose={handleCloseActiveModal} 
      />
      <CreateReelModal 
        isOpen={activeModal === 'reel'} 
        onClose={handleCloseActiveModal} 
      />

    </>
  );
}