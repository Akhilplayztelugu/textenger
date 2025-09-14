import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Users, Hash, Globe, Lock, Camera, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roomIcons = [
  { id: 'users', icon: Users, label: 'Users', color: 'text-blue-600' },
  { id: 'hash', icon: Hash, label: 'General', color: 'text-green-600' },
  { id: 'globe', icon: Globe, label: 'Public', color: 'text-purple-600' },
  { id: 'lock', icon: Lock, label: 'Private', color: 'text-red-600' },
];

const gradientOptions = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-blue-600',
  'from-purple-500 to-pink-600',
  'from-red-500 to-orange-600',
  'from-indigo-500 to-purple-600',
  'from-teal-500 to-green-600',
];

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('users');
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Creating room...', { 
      name: roomName,
      description,
      icon: selectedIcon,
      gradient: selectedGradient,
      customImage,
      isPublic
    });
    setIsLoading(false);
    onClose();
    // Reset form
    setRoomName('');
    setDescription('');
    setSelectedIcon('users');
    setSelectedGradient(gradientOptions[0]);
    setCustomImage(null);
    setIsPublic(true);
  };

  const handleClose = () => {
    onClose();
    setRoomName('');
    setDescription('');
    setSelectedIcon('users');
    setSelectedGradient(gradientOptions[0]);
    setCustomImage(null);
    setIsPublic(true);
  };

  const selectedIconData = roomIcons.find(icon => icon.id === selectedIcon);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-md border border-border/50 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Create Room
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Room Icon Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {customImage ? (
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-border/20">
                  <ImageWithFallback
                    src={customImage}
                    alt="Room icon"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-20 h-20 bg-gradient-to-br ${selectedGradient} rounded-full flex items-center justify-center ring-4 ring-border/20`}>
                  {selectedIconData && React.createElement(selectedIconData.icon, {
                    className: "w-10 h-10 text-white"
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Room Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Room Name *</label>
            <Input
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              placeholder="Describe what this room is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Room Icon</label>
            
            {/* Custom Image Upload */}
            <div className="p-3 bg-card/40 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Custom Image</span>
                <div className="flex items-center gap-2">
                  {customImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomImage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="room-icon-upload"
                  />
                  <Button asChild variant="outline" size="sm" className="bg-card/60 border-border/40">
                    <label htmlFor="room-icon-upload" className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            {/* Preset Icons */}
            {!customImage && (
              <div className="grid grid-cols-4 gap-3">
                {roomIcons.map((icon) => {
                  const Icon = icon.icon;
                  return (
                    <button
                      key={icon.id}
                      onClick={() => setSelectedIcon(icon.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        selectedIcon === icon.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/40 bg-card/40 hover:bg-accent/40'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-1 ${icon.color}`} />
                      <p className="text-xs text-foreground">{icon.label}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gradient Selection */}
          {!customImage && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Background Color</label>
              <div className="grid grid-cols-6 gap-2">
                {gradientOptions.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedGradient(gradient)}
                    className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg border-2 transition-all duration-200 ${
                      selectedGradient === gradient
                        ? 'border-primary shadow-md scale-110'
                        : 'border-border/30 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Room Visibility */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Room Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPublic(true)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isPublic
                    ? 'border-primary bg-primary/10'
                    : 'border-border/40 bg-card/40 hover:bg-accent/40'
                }`}
              >
                <Globe className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-foreground">Public</p>
                <p className="text-xs text-muted-foreground">Anyone can join</p>
              </button>
              <button
                onClick={() => setIsPublic(false)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  !isPublic
                    ? 'border-primary bg-primary/10'
                    : 'border-border/40 bg-card/40 hover:bg-accent/40'
                }`}
              >
                <Lock className="w-5 h-5 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium text-foreground">Private</p>
                <p className="text-xs text-muted-foreground">Invite only</p>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/30">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 bg-card/60 border-border/40 text-foreground hover:bg-accent/60"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={!roomName.trim() || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}