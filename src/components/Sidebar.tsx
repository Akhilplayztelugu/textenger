import React from 'react';
import { Home, Zap, Video, Users, MessageCircle, File, User } from 'lucide-react';
import { cn } from './ui/utils';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'files' | 'profile';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navigationItems = [
  { id: 'feed', icon: Home, label: 'Feed' },
  { id: 'stories', icon: Zap, label: 'Stories' },
  { id: 'clips', icon: Video, label: 'Clips' },
  { id: 'rooms', icon: Users, label: 'Rooms' },
  { id: 'dms', icon: MessageCircle, label: 'DMs' },
  { id: 'files', icon: File, label: 'Files' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-16 xl:w-64 2xl:w-72 bg-purple-950/90 backdrop-blur-md border-r border-purple-500/30 flex flex-col h-screen flex-shrink-0 shadow-lg shadow-purple-500/10">
      {/* Logo */}
      <div className="p-3 xl:p-6 border-b border-purple-500/30">
        <div className="xl:block hidden">
          <h1 className="text-lg xl:text-xl font-bold text-purple-100 tracking-tight neon-text">Textenger</h1>
        </div>
        <div className="xl:hidden block">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25 neon-glow">
            <span className="text-sm xl:text-base font-bold text-white">T</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2 xl:p-4 overflow-y-auto">
        <ul className="space-y-1.5 xl:space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isLastItem = index === navigationItems.length - 1;
            
            return (
              <li key={item.id} className={cn(isLastItem && "xl:mb-2")}>
                <button
                  onClick={() => onPageChange(item.id as Page)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2.5 xl:px-3 xl:py-2.5 rounded-lg xl:rounded-lg transition-all duration-300 relative",
                    "hover:bg-purple-500/20 hover:text-purple-100 active:scale-95",
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25 font-medium neon-glow" 
                      : "text-purple-200 font-normal hover:shadow-purple-500/20"
                  )}
                >
                  <Icon className="w-5 h-5 xl:w-4 xl:h-4 flex-shrink-0 mx-auto xl:mx-0" />
                  <span className="xl:block hidden text-sm font-medium truncate">{item.label}</span>
                  
                  {/* Active indicator for narrow sidebar */}
                  {isActive && (
                    <div className="xl:hidden absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full shadow-md shadow-purple-500/50" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom spacing for better visual balance */}
      <div className="p-2 xl:p-4">
        <div className="h-2"></div>
      </div>
    </div>
  );
}