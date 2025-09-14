import React, { useState } from 'react';
import { Search, Bell, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface MobileTopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function MobileTopBar({
  title,
  showBack = false,
  onBack,
  showSearch = true,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  rightAction,
  className
}: MobileTopBarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  if (isSearchExpanded) {
    return (
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-purple-950/90 backdrop-blur-md border-b border-purple-500/30",
        "px-4 py-3 safe-area-pt",
        "shadow-lg shadow-purple-500/10",
        className
      )}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSearchExpanded(false)}
            className="h-10 w-10 p-0 text-purple-200 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300" />
              <Input
                placeholder="Search users, posts, stories..."
                className="pl-10 h-10 bg-purple-900/50 border-purple-500/40 text-white placeholder:text-purple-300"
                autoFocus
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "bg-purple-950/90 backdrop-blur-md border-b border-purple-500/30",
      "px-4 py-3 safe-area-pt",
      "shadow-lg shadow-purple-500/10",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBack && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="h-10 w-10 p-0 text-purple-200 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-white truncate neon-text">
            {title}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSearchExpanded(true)}
              className="h-10 w-10 p-0 text-purple-200 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onNotificationClick}
              className="relative h-10 w-10 p-0 text-purple-200 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-bold min-w-[20px]"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
}