import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isTouchDevice: boolean;
}

export function useMobileDetection(): MobileDetectionResult {
  const [mobileInfo, setMobileInfo] = useState<MobileDetectionResult>({
    isMobile: false,
    isAndroid: false,
    isIOS: false,
    isTouchDevice: false,
  });

  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check for mobile devices
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // More specific checks
      const isAndroidDevice = /android/i.test(userAgent);
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
      
      // Additional mobile check based on screen size
      const isSmallScreen = window.innerWidth <= 768;
      
      setMobileInfo({
        isMobile: isMobileDevice || (isTouch && isSmallScreen),
        isAndroid: isAndroidDevice,
        isIOS: isIOSDevice,
        isTouchDevice: isTouch,
      });
    };

    checkMobileDevice();
    
    // Listen for resize events to re-check
    window.addEventListener('resize', checkMobileDevice);
    
    return () => {
      window.removeEventListener('resize', checkMobileDevice);
    };
  }, []);

  return mobileInfo;
}