import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Save, X } from 'lucide-react';
import { cn } from './ui/utils';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    displayName: string;
    avatar: string;
  };
  onSave: (updatedUser: { username: string; displayName: string; avatar: string }) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [usernameChangesLeft] = useState(3); // Mock remaining username changes
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock save operation
    setTimeout(() => {
      onSave({
        username: username.trim(),
        displayName: displayName.trim(),
        avatar
      });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const handleAvatarChange = () => {
    // Mock avatar change - in real app, this would open file picker
    console.log('Opening avatar picker...');
  };

  const isUsernameValid = username.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(username.trim());
  const isDisplayNameValid = displayName.trim().length >= 2;
  const isFormValid = isUsernameValid && isDisplayNameValid;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground text-xl">Edit Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update your profile information. You can change your username {usernameChangesLeft} more times this week.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-xl">{displayName[0] || 'U'}</AvatarFallback>
              </Avatar>
              <Button
                onClick={handleAvatarChange}
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Click to change profile picture</p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className={cn(
                "h-12 text-base bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground",
                !isDisplayNameValid && displayName.length > 0 && "border-destructive focus:border-destructive"
              )}
            />
            {!isDisplayNameValid && displayName.length > 0 && (
              <p className="text-sm text-destructive">Display name must be at least 2 characters</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="your_username"
                className={cn(
                  "pl-8 h-12 text-base bg-input-background/80 border-border/40 text-foreground placeholder:text-muted-foreground",
                  !isUsernameValid && username.length > 0 && "border-destructive focus:border-destructive"
                )}
              />
            </div>
            {!isUsernameValid && username.length > 0 && (
              <p className="text-sm text-destructive">
                Username must be 3+ characters and contain only letters, numbers, and underscores
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {usernameChangesLeft} username changes remaining this week
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/30">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-card/60 border-border/40 text-foreground hover:bg-accent/60"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}