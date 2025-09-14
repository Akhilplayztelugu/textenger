import React from 'react';
import { Home, Zap, Plus, MessageCircle, Users, User } from 'lucide-react';
import { cn } from '../ui/utils';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'profile';

interface MobileBottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onCreateClick: () => void;
  className?: string;
}

const navigationItems = [
  { id: 'feed', icon: Home, label: 'Feed' },
  { id: 'stories', icon: Zap, label: 'Stories' },
  { id: 'create', icon: Plus, label: 'Create', isSpecial: true },
  { id: 'dms', icon: MessageCircle, label: 'Messages' },
  { id: 'rooms', icon: Users, label: 'Rooms' },
] as const;

export function MobileBottomNav({ 
  currentPage, 
  onPageChange, 
  onCreateClick,
  className 
}: MobileBottomNavProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-purple-950/95 backdrop-blur-md border-t border-purple-500/30",
      "px-2 py-2 safe-area-pb",
      "shadow-lg shadow-purple-500/10",
      className
    )}>
      <div className="flex items-center justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isCreate = item.id === 'create';
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isCreate) {
                  onCreateClick();
                } else {
                  onPageChange(item.id as Page);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                "active:scale-95 relative min-h-[48px] min-w-[48px]",
                isCreate
                  ? "bg-gradient-to-t from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30 rounded-full w-12 h-12 neon-glow hover:shadow-purple-500/50"
                  : "py-2 px-3 rounded-lg",
                !isCreate && (isActive 
                  ? "text-purple-100 bg-purple-500/30 shadow-lg shadow-purple-500/20 neon-border" 
                  : "text-purple-300 hover:text-purple-100 hover:bg-purple-500/20")
              )}
            >
              <Icon className={cn(
                "transition-all duration-200",
                isCreate 
                  ? "w-6 h-6" 
                  : isActive 
                    ? "w-5 h-5" 
                    : "w-4 h-4"
              )} />
              {!isCreate && (
                <span className={cn(
                  "text-xs transition-all duration-200 leading-tight text-center mt-1",
                  isActive ? "font-semibold" : "font-medium"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}