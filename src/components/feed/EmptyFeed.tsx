import React from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyFeedProps {
  onRefresh: () => void;
}

export function EmptyFeed({ onRefresh }: EmptyFeedProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 neon-glow">
        <Heart className="w-10 h-10 text-purple-400" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">Welcome to Textenger!</h3>
      <p className="text-purple-300 text-base leading-relaxed max-w-sm mb-8">
        Your feed is empty. Start following people or create your first post to see content here.
      </p>
      <Button 
        onClick={onRefresh}
        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold px-6 py-3 rounded-xl neon-glow"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Refresh Feed
      </Button>
    </div>
  );
}