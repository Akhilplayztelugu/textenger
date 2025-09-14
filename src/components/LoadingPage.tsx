import React from 'react';

export function LoadingPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Textenger
          </h1>
          <p className="text-muted-foreground mt-2">Connect • Share • Chat</p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-violet-500 rounded-full animate-spin" style={{ animationDelay: '0.15s', animationDirection: 'reverse' }}></div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground animate-pulse">Loading your experience...</p>
      </div>
    </div>
  );
}