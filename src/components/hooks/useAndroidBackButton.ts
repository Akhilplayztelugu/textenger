import { useEffect, useCallback } from 'react';
import { useMobileDetection } from './useMobileDetection';

type Page = 'feed' | 'stories' | 'rooms' | 'dms' | 'files' | 'profile';

interface UseAndroidBackButtonProps {
  currentPage: Page;
  navigationHistory: Page[];
  onNavigateBack: (page: Page) => void;
  onAppExit?: () => void;
}

export function useAndroidBackButton({
  currentPage,
  navigationHistory,
  onNavigateBack,
  onAppExit,
}: UseAndroidBackButtonProps) {
  const { isMobile, isAndroid } = useMobileDetection();

  const handleBackButton = useCallback((event: PopStateEvent) => {
    // Only handle back button on mobile devices
    if (!isMobile) {
      return;
    }

    event.preventDefault();
    
    // If we're on the feed page, exit the app
    if (currentPage === 'feed') {
      simulateAppExit();
      return;
    }

    // Otherwise, navigate to the previous page
    if (navigationHistory.length > 1) {
      // Get the previous page (second to last in history)
      const previousPage = navigationHistory[navigationHistory.length - 2];
      onNavigateBack(previousPage);
    } else {
      // If no history, go to feed
      onNavigateBack('feed');
    }
  }, [currentPage, navigationHistory, onNavigateBack, isMobile]);

  useEffect(() => {
    // Only set up back button handling on mobile devices
    if (!isMobile) {
      return;
    }

    // Push a state to enable back button detection
    window.history.pushState({ page: currentPage }, '', window.location.href);

    // Listen for popstate events (back button presses)
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [handleBackButton, currentPage, isMobile]);

  // Function to simulate app exit (for demonstration)
  const simulateAppExit = useCallback(() => {
    if (isMobile) {
      // On mobile web, we can't actually close the app, but we can:
      // 1. Show a confirmation dialog
      // 2. Navigate to a blank page
      // 3. Try to close the window (may not work on all browsers)
      
      const confirmExit = window.confirm('Do you want to exit Textenger?');
      if (confirmExit) {
        // Try to close the window/tab
        try {
          window.close();
        } catch (e) {
          // If that fails, navigate away or show a message
          document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);"><div style="text-align: center;"><h1>Textenger</h1><p>You can safely close this tab now.</p></div></div>';
        }
      }
    }
  }, [isMobile]);

  return {
    isMobile,
    isAndroid,
    simulateAppExit,
  };
}