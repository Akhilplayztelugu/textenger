import React, { useState } from 'react';
import { Search, Bell, Settings, Menu, ArrowLeft, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NotificationsModal } from './modals/NotificationsModal';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'files' | 'profile';

interface TopBarProps {
  currentPage: Page;
}

const pageLabels = {
  feed: 'Feed',
  stories: 'Stories',
  clips: 'Clips',
  rooms: 'Rooms',
  dms: 'Messages',
  files: 'Files',
  profile: 'Profile'
};

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: { username: 'alex_gamer', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    message: 'liked your post',
    time: '2m ago',
    isRead: false
  },
  {
    id: 2,
    type: 'comment',
    user: { username: 'maya_pixel', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    message: 'commented on your post',
    time: '5m ago',
    isRead: false
  },
  {
    id: 3,
    type: 'follow',
    user: { username: 'sam_code', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    message: 'started following you',
    time: '1h ago',
    isRead: true
  }
];

export function TopBar({ currentPage }: TopBarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      default: return Bell;
    }
  };

  if (isSearchExpanded) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-purple-950/80 backdrop-blur-md border-b border-purple-500/30 px-[16px] py-[16px] sm:px-[20px] sm:py-[18px] safe-area-pt z-50 shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-2 sm:gap-3 px-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSearchExpanded(false)}
            className="flex-shrink-0 text-foreground hover:bg-accent/50 h-8 w-8 sm:h-9 sm:w-9 p-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users, posts, stories..."
                className="pl-10 bg-input-background/80 border border-border/30 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground text-sm sm:text-base"
                autoFocus
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-purple-950/80 backdrop-blur-md border-b border-purple-500/30 px-[16px] py-[16px] sm:px-[20px] sm:py-[18px] lg:px-[28px] lg:py-[16px] xl:px-[36px] safe-area-pt z-50 shadow-lg shadow-purple-500/10">
      <div className="flex items-center justify-between relative max-w-full px-1">
        {/* Logo and Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0 ml-1">
          <div className="xl:hidden">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate max-w-[120px] sm:max-w-none neon-text text-right mx-[8px] my-[0px] px-[0px] py-[10px]">Textenger</h1>
          </div>
          <div className="hidden xl:block">
            <h2 className="text-lg font-semibold text-purple-100">{pageLabels[currentPage]}</h2>
          </div>
        </div>
        
        {/* Mobile Page Title */}
        <div className="xl:hidden absolute left-1/2 transform -translate-x-1/2 pointer-events-none max-w-[100px] sm:max-w-[140px]">
          <h2 className="text-sm sm:text-base font-medium text-purple-300 whitespace-nowrap text-center truncate">{pageLabels[currentPage]}</h2>
        </div>
        
        {/* Desktop Search Bar */}
        <div className="hidden lg:block xl:flex-1 xl:max-w-md xl:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted border-0 focus-visible:ring-1 w-full lg:w-64 xl:w-full"
            />
          </div>
        </div>
        
        {/* Actions - Better alignment with corner */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0 ml-2 mr-1">
          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 p-0"
            onClick={() => setIsSearchExpanded(true)}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          {/* Notifications */}
          {currentPage === 'feed' ? (
            // On feed page, open full modal
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 p-0"
              onClick={() => setIsNotificationsModalOpen(true)}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-[10px] sm:text-xs font-semibold min-w-[16px] sm:min-w-[20px]"
              >
                {mockNotifications.filter(n => !n.isRead).length}
              </Badge>
            </Button>
          ) : (
            // On other pages, use dropdown
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 p-0">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center text-[10px] sm:text-xs font-semibold min-w-[16px] sm:min-w-[20px]"
                  >
                    {mockNotifications.filter(n => !n.isRead).length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-card/95 backdrop-blur-md border border-border/50 shadow-xl" align="end">
                <div className="p-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {mockNotifications.slice(0, 5).map((notification) => {
                        const Icon = getNotificationIcon(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className={`p-3 hover:bg-accent/40 cursor-pointer transition-colors ${
                              !notification.isRead ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={notification.user.avatar} />
                                <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm">
                                    <span className="font-medium">{notification.user.displayName}</span>
                                    <span className="text-muted-foreground"> {notification.message}</span>
                                  </p>
                                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {mockNotifications.length > 0 && (
                  <div className="p-3 border-t border-border/40">
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setIsNotificationsModalOpen(true);
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
          
          {/* Settings - Progressive display */}
          <Button variant="ghost" size="sm" className="hidden md:flex h-8 w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 p-0 mr-1">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
        </div>
      </div>

      {/* Notifications Modal - only on feed page */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </header>
  );
}