import React from 'react';
import { cn } from '../ui/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn(
      "h-screen w-screen overflow-hidden fixed inset-0",
      "bg-gradient-to-br from-purple-950 via-slate-900 to-black",
      "text-white",
      className
    )}>
      {children}
    </div>
  );
}

interface MobilePageProps {
  children: React.ReactNode;
  className?: string;
  hasTopBar?: boolean;
  hasBottomNav?: boolean;
}

export function MobilePage({ 
  children, 
  className, 
  hasTopBar = true, 
  hasBottomNav = true 
}: MobilePageProps) {
  return (
    <div className={cn(
      "flex flex-col h-full w-full overflow-hidden",
      className
    )}>
      {/* Content area with proper spacing for top bar and bottom nav */}
      <main className={cn(
        "flex-1 overflow-hidden relative",
        hasTopBar && "pt-16",
        hasBottomNav && "pb-16"
      )}>
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function MobileContainer({ children, className, padding = true }: MobileContainerProps) {
  return (
    <div className={cn(
      "w-full h-full overflow-hidden",
      padding && "px-4 py-4",
      className
    )}>
      {children}
    </div>
  );
}