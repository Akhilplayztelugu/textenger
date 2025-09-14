import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Image, Bookmark, Video, Users } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';
import { CreateStoryModal } from '../modals/CreateStoryModal';
import { CreateClipModal } from './CreateClipModal';
import { CreateRoomModal } from './CreateRoomModal';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createOptions = [
  { id: 'post', icon: Image, label: 'Post', description: 'Share a photo or video' },
  { id: 'story', icon: Bookmark, label: 'Story', description: 'Share a temporary story' },
  { id: 'clip', icon: Video, label: 'Clip', description: 'Share a short video' },
  { id: 'room', icon: Users, label: 'Room', description: 'Create a chat room' },
];

export function CreateContentModal({ isOpen, onClose }: CreateContentModalProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (type: string) => {
    setActiveModal(type);
    onClose();
  };

  const handleCloseActiveModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-purple-950/95 backdrop-blur-md border border-purple-500/40 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl text-center">Create Content</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {createOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  className="h-24 p-4 flex flex-col items-center gap-3 hover:bg-purple-500/20 border-purple-500/40 bg-purple-900/30 backdrop-blur-sm transition-all duration-200 active:scale-95"
                  onClick={() => handleOpenModal(option.id)}
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white text-sm">{option.label}</div>
                    <div className="text-xs text-purple-300 mt-1">{option.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Creation Modals */}
      <CreatePostModal 
        isOpen={activeModal === 'post'} 
        onClose={handleCloseActiveModal} 
      />
      <CreateStoryModal 
        isOpen={activeModal === 'story'} 
        onClose={handleCloseActiveModal} 
      />
      <CreateClipModal 
        isOpen={activeModal === 'clip'} 
        onClose={handleCloseActiveModal} 
      />
      <CreateRoomModal 
        isOpen={activeModal === 'room'} 
        onClose={handleCloseActiveModal} 
      />
    </>
  );
}