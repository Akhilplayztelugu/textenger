import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileNavigation } from './components/MobileNavigation';
import { FeedPage } from './components/pages/FeedPage';
import { StoriesPage } from './components/pages/StoriesPage';
import { ClipsPage } from './components/pages/ClipsPage';
import { RoomsPage } from './components/pages/RoomsPage';
import { DMsPage } from './components/pages/DMsPage';
import { FilesPage } from './components/pages/FilesPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { LoadingPage } from './components/LoadingPage';
import { AuthPage } from './components/AuthPage';

import { UploadModal } from './components/UploadModal';
import { useAndroidBackButton } from './components/hooks/useAndroidBackButton';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'files' | 'profile';
type AppState = 'loading' | 'auth' | 'authenticated';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(['feed']);
  const [userData, setUserData] = useState<{
    username: string;
    displayName: string;
    email: string;
    password: string;
  } | null>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const storedUser = localStorage.getItem('textenger_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setAppState('authenticated');
      } else {
        setAppState('auth');
      }
    };
    
    checkAuth();
  }, []);

  // Handle page changes and update navigation history
  const handlePageChange = useCallback((page: Page) => {
    setCurrentPage(page);
    setNavigationHistory(prev => {
      // Add new page to history, but avoid duplicates of consecutive pages
      if (prev[prev.length - 1] !== page) {
        return [...prev, page];
      }
      return prev;
    });
  }, []);

  // Handle back navigation
  const handleNavigateBack = useCallback((page: Page) => {
    setCurrentPage(page);
    setNavigationHistory(prev => {
      // Remove the current page from history
      const newHistory = prev.slice(0, -1);
      return newHistory.length > 0 ? newHistory : ['feed'];
    });
  }, []);

  // Handle authentication
  const handleAuthenticated = (user: {
    username: string;
    displayName: string;
    email: string;
    password: string;
  }) => {
    setUserData(user);
    setAppState('authenticated');
  };

  // Set up Android back button handling (only when authenticated)
  useAndroidBackButton({
    currentPage,
    navigationHistory,
    onNavigateBack: handleNavigateBack,
  });

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'feed':
        return <FeedPage />;
      case 'stories':
        return <StoriesPage />;
      case 'clips':
        return <ClipsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'dms':
        return <DMsPage />;
      case 'files':
        return <FilesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <FeedPage />;
    }
  };

  // Render based on app state
  if (appState === 'loading') {
    return <LoadingPage />;
  }

  if (appState === 'auth') {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  // Authenticated app layout
  return (
    <div className="h-screen w-screen overflow-hidden dark fixed inset-0" style={{ background: 'var(--background)' }}>
      {/* Responsive Layout Container */}
      <div className="flex flex-col h-full lg:flex-row relative">
        {/* Desktop Sidebar - Hidden on mobile and small tablets */}
        <div className="hidden xl:block flex-shrink-0">
          <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
        
        {/* Main Content Area - Responsive container */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 relative overflow-hidden">
          {/* Top Bar - Fixed with responsive height */}
          <TopBar currentPage={currentPage} />
          
          {/* Page Content - Properly contained within viewport */}
          <main className="flex-1 overflow-hidden pt-16 pb-16 lg:pt-16 lg:pb-0 xl:pt-0 xl:pb-0 relative">
            <div className="h-full w-full overflow-hidden">
              {renderCurrentPage()}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation - Progressive display based on screen size */}
          <div className="xl:hidden flex-shrink-0">
            <MobileNavigation 
              currentPage={currentPage} 
              onPageChange={handlePageChange}
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
          </div>
        </div>
      </div>
      
      {/* Desktop Floating Action Button - Responsive positioning */}
      {['feed', 'stories', 'files'].includes(currentPage) && (
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="hidden xl:block fixed bottom-6 right-6 2xl:bottom-8 2xl:right-8 w-12 h-12 lg:w-14 lg:h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-95 ring-2 ring-purple-400/40 ring-offset-2 ring-offset-transparent backdrop-blur-sm flex items-center justify-center text-white neon-glow"
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
      
      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}