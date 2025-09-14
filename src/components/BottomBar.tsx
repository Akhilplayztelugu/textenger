import React from 'react';
import { Home, Compass, Plus } from 'lucide-react';
import { cn } from './ui/utils';

type FeedTab = 'home' | 'explore' | 'upload';

interface BottomBarProps {
  currentTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const tabItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'upload', icon: Plus, label: 'Upload' },
] as const;

export function BottomBar({ currentTab, onTabChange }: BottomBarProps) {
  return (
    <div className="lg:hidden bg-card border-t border-border px-4 py-2">
      <nav className="flex justify-around">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as FeedTab)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}