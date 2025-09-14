import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-24 right-5 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-primary hover:bg-primary/90 lg:bottom-8 lg:right-8 lg:w-14 lg:h-14 active:scale-95 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent backdrop-blur-sm"
    >
      <Plus className="w-6 h-6 lg:w-5 lg:h-5" />
    </Button>
  );
}