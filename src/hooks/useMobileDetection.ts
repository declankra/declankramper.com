'use client';

import { useState, useEffect } from 'react';

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check screen width (mobile breakpoint)
      const isMobileWidth = window.innerWidth < 768;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'mobile', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      // Check for touch support
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Device is considered mobile if it meets width criteria OR is a mobile device with touch
      const mobile = isMobileWidth || (isMobileDevice && isTouchDevice);
      
      setIsMobile(mobile);
      setIsLoaded(true);
    };

    // Initial check
    checkMobile();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return { isMobile, isLoaded };
}