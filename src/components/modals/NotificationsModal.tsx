import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { cn } from '../ui/utils';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'like',
    user: { username: 'alex_gamer', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    message: 'liked your post',
    time: '2m ago',
    isRead: false,
    postImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    type: 'comment',
    user: { username: 'maya_pixel', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    message: 'commented on your post: "This is amazing! 🔥"',
    time: '5m ago',
    isRead: false,
    postImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    type: 'follow',
    user: { username: 'sam_code', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    message: 'started following you',
    time: '1h ago',
    isRead: true
  },
  {
    id: 4,
    type: 'like',
    user: { username: 'zoe_neon', displayName: 'Zoe Park', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    message: 'liked your story',
    time: '2h ago',
    isRead: true
  },
  {
    id: 5,
    type: 'comment',
    user: { username: 'jordan_react', displayName: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    message: 'commented on your post: "Great work on this project!"',
    time: '3h ago',
    isRead: true,
    postImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop'
  },
  {
    id: 6,
    type: 'like',
    user: { username: 'dev_ninja', displayName: 'Dev Ninja', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face' },
    message: 'liked your post',
    time: '1d ago',
    isRead: true,
    postImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop'
  }
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      default: return Bell;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[700px] flex flex-col glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-foreground text-xl flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </DialogTitle>
            {unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </div>
            )}
          </div>
          <DialogDescription className="sr-only">
            View and manage your notifications from other users
          </DialogDescription>
        </DialogHeader>
        
        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <div className="flex-shrink-0 px-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-primary hover:text-primary/80 text-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all as read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">No notifications yet</h3>
              <p className="text-muted-foreground">When someone interacts with your content, you'll see it here</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                  className={cn(
                    "p-4 hover:bg-accent/40 cursor-pointer transition-colors rounded-lg border border-transparent",
                    !notification.isRead ? "bg-primary/5 border-primary/20" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-border/20">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">
                            <span className="font-semibold">{notification.user.displayName}</span>
                            <span className="text-muted-foreground"> {notification.message}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Icon className="w-3 h-3 text-primary" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                        {notification.postImage && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img 
                              src={notification.postImage} 
                              alt="Post" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex-shrink-0 border-t border-border/40 pt-4">
            <Button variant="ghost" className="w-full text-sm">
              View notification settings
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}