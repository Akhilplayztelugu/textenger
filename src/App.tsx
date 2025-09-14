import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuthContext } from './components/auth/AuthProvider';
import { MobileLayout } from './components/mobile/MobileLayout';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileFeedPage } from './components/mobile/MobileFeedPage';
import { MobileClipsPage } from './components/mobile/MobileClipsPage';
import { LoadingPage } from './components/LoadingPage';
import { AuthPage } from './components/AuthPage';
import { CreateContentModal } from './components/upload/CreateContentModal';

type Page = 'feed' | 'stories' | 'clips' | 'rooms' | 'dms' | 'files' | 'profile';

function AppContent() {
  const { user, loading } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'feed':
        return <MobileFeedPage />;
      case 'stories':
        return <div>Stories Page - Coming Soon</div>;
      case 'clips':
        return <MobileClipsPage />;
      case 'rooms':
        return <div>Rooms Page - Coming Soon</div>;
      case 'dms':
        return <div>DMs Page - Coming Soon</div>;
      case 'profile':
        return <div>Profile Page - Coming Soon</div>;
      default:
        return <MobileFeedPage />;
    }
  };

  // Show loading while checking auth
  if (loading) {
    return <LoadingPage />;
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage onAuthenticated={() => {}} />;
  }

  // Main app layout for mobile
  return (
    <MobileLayout>
      {/* Main Content */}
      {renderCurrentPage()}
      
      {/* Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />
      
      {/* Create Content Modal */}
      <CreateContentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </MobileLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}