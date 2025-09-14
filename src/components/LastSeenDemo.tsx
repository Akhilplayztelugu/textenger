import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Eye, RotateCcw } from 'lucide-react';
import { lastSeenManager } from './utils/lastSeenManager';

interface LastSeenDemoProps {
  conversationId: string;
  onSimulateReturn: () => void;
}

export function LastSeenDemo({ conversationId, onSimulateReturn }: LastSeenDemoProps) {
  const handleSetLastSeen = () => {
    // Simulate user leaving at message 3 (John's initial message about buying PC)
    lastSeenManager.updateLastSeenPosition(conversationId, 3);
    onSimulateReturn();
  };

  const handleClearLastSeen = () => {
    lastSeenManager.removeLastSeenPosition(conversationId);
    onSimulateReturn();
  };

  const currentLastSeen = lastSeenManager.getLastSeenPosition(conversationId);

  return (
    <Card className="mb-4 bg-card/60 backdrop-blur-sm border-border/40">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Seen Demo</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleSetLastSeen}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Simulate: Left at John's PC message
            </Button>
            
            <Button 
              onClick={handleClearLastSeen}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Position
            </Button>
          </div>
          
          {currentLastSeen && (
            <div className="text-xs text-muted-foreground">
              Current last seen: Message ID {currentLastSeen.messageId}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            Try "Simulate: Left at John's PC message" to see how the chat scrolls to where you left off when reopening. The system tracks your position so when you return after John and Ravi's conversation, you'll resume from John's original message.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}