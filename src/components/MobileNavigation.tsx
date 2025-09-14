import React from 'react';
import { Home, Users, MessageCircle, User, Plus, Zap, Video } from 'lucide-react';
import { cn } from './ui/utils';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'files' | 'profile';

interface MobileNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onUploadClick?: () => void;
}

const navigationItems = [
  { id: 'feed', icon: Home, label: 'Feed' },
  { id: 'stories', icon: Zap, label: 'Stories' },
  { id: 'upload', icon: Plus, label: 'Create', isSpecial: true },
  { id: 'dms', icon: MessageCircle, label: 'Messages' },
  { id: 'rooms', icon: Users, label: 'Rooms' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export function MobileNavigation({ currentPage, onPageChange, onUploadClick }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-950/90 backdrop-blur-md border-t border-purple-500/30 safe-area-pb z-50 shadow-lg shadow-purple-500/10">
      <nav className="flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 md:px-4">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isUpload = item.id === 'upload';
          const isLastItem = index === navigationItems.length - 1;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isUpload && onUploadClick) {
                  onUploadClick();
                } else {
                  onPageChange(item.id as Page);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all duration-200",
                "active:scale-95 relative",
                isUpload
                  ? "bg-gradient-to-t from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 active:bg-purple-500/80 hover:shadow-purple-500/50 hover:shadow-xl ring-2 ring-purple-400/40 w-11 h-11 sm:w-12 sm:h-12 neon-glow"
                  : "py-1.5 px-2 sm:py-2 sm:px-2.5 min-w-[44px] sm:min-w-[48px] flex-1 max-w-[64px] sm:max-w-[68px]",
                !isUpload && (isActive 
                  ? "text-purple-100 bg-purple-500/30 shadow-lg shadow-purple-500/20 backdrop-blur-sm active:bg-purple-500/40 neon-border" 
                  : "text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 active:bg-purple-500/30"),
                // Add margin to last item to align with corner
                isLastItem && !isUpload ? "mr-1 sm:mr-2" : ""
              )}
            >
              <Icon className={cn(
                "flex-shrink-0 transition-all duration-200",
                isUpload 
                  ? "w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" 
                  : isActive 
                    ? "w-4 h-4 sm:w-5 sm:h-5" 
                    : "w-3.5 h-3.5 sm:w-4 sm:h-4"
              )} />
              {!isUpload && (
                <span className={cn(
                  "text-[9px] sm:text-[10px] transition-all duration-200 leading-tight text-center",
                  isActive 
                    ? "font-semibold" 
                    : "font-medium"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}