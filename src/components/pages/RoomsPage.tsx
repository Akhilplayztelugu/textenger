import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowLeft, Send, Users, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '../ui/utils';
import { CreateRoomModal } from '../modals/CreateRoomModal';
import { useLastSeenScroll } from '../hooks/useLastSeenScroll';

// Mock data for rooms
const mockRooms = [
  {
    id: 1,
    name: 'Gaming Squad',
    description: 'Daily gaming discussions and LFG',
    memberCount: 124,
    lastMessage: 'Anyone up for Valorant?',
    lastMessageTime: '2m',
    unreadCount: 3,
    isOnline: true
  },
  {
    id: 2,
    name: 'React Developers',
    description: 'React tips, tricks, and help',
    memberCount: 89,
    lastMessage: 'Check out this new hook I made',
    lastMessageTime: '15m',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 3,
    name: 'Pixel Art Community',
    description: 'Share your pixel art creations',
    memberCount: 67,
    lastMessage: 'Love the new character design!',
    lastMessageTime: '1h',
    unreadCount: 1,
    isOnline: false
  },
  {
    id: 4,
    name: 'Indie Game Devs',
    description: 'Support and feedback for indie games',
    memberCount: 156,
    lastMessage: 'Beta testing starts tomorrow',
    lastMessageTime: '3h',
    unreadCount: 0,
    isOnline: true
  }
];

// Mock messages for a room
const mockMessages = [
  {
    id: 1,
    user: { username: 'gamer_alex', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    content: 'Hey everyone! Anyone up for some Valorant tonight?',
    timestamp: '2:30 PM',
    isOwn: false
  },
  {
    id: 2,
    user: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    content: "I'm in! What time are we thinking?",
    timestamp: '2:32 PM',
    isOwn: false
  },
  {
    id: 3,
    user: { username: 'john_gamer', displayName: 'John', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    content: 'Hey Ravi, I gonna buy a new PC tomorrow!',
    timestamp: '2:35 PM',
    isOwn: false
  },
  {
    id: 4,
    user: { username: 'ravi_dev', displayName: 'Ravi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    content: 'That\'s awesome John! What specs are you thinking?',
    timestamp: '2:40 PM',
    isOwn: false
  },
  {
    id: 5,
    user: { username: 'john_gamer', displayName: 'John', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    content: 'RTX 4080, 32GB RAM, and a Ryzen 9 7900X',
    timestamp: '2:45 PM',
    isOwn: false
  },
  {
    id: 6,
    user: { username: 'ravi_dev', displayName: 'Ravi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    content: 'Wow that\'s a beast! That should handle any game at 4K',
    timestamp: '2:50 PM',
    isOwn: false
  },
  {
    id: 7,
    user: { username: 'john_gamer', displayName: 'John', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    content: 'Yeah! Can\'t wait to test it with Cyberpunk 2077',
    timestamp: '2:55 PM',
    isOwn: false
  },
  {
    id: 8,
    user: { username: 'ravi_dev', displayName: 'Ravi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    content: 'You should definitely stream some gameplay when you get it!',
    timestamp: '3:00 PM',
    isOwn: false
  },
  {
    id: 9,
    user: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    content: 'That PC sounds amazing John! When are you getting it?',
    timestamp: '3:05 PM',
    isOwn: false
  },
  {
    id: 10,
    user: { username: 'john_gamer', displayName: 'John', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    content: 'Ordering it tonight, should arrive by Friday!',
    timestamp: '3:10 PM',
    isOwn: false
  }
];

const EmptyState = ({ onCreateRoom }: { onCreateRoom: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6">
      <Users className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-3 text-foreground">No rooms yet</h3>
    <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-6">
      Join or create a room to start chatting with groups
    </p>
    <Button 
      onClick={onCreateRoom}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl"
    >
      <Plus className="w-5 h-5 mr-2" />
      Create Room
    </Button>
  </div>
);

const RoomCard = ({ room, onClick }: { room: typeof mockRooms[0], onClick: () => void }) => (
  <Card className="cursor-pointer hover:bg-accent/60 transition-all duration-200 active:scale-95 lg:active:scale-100 bg-card/60 backdrop-blur-sm border-border/40 shadow-sm" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{room.name}</h3>
            <div className={cn(
              "w-2 h-2 rounded-full",
              room.isOnline ? "bg-green-500" : "bg-gray-400"
            )} />
            {room.unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center ml-auto">
                {room.unreadCount}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mb-1">{room.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm truncate flex-1">{room.lastMessage}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
              <span>{room.memberCount}</span>
              <span>•</span>
              <span>{room.lastMessageTime}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChatView = ({ room, onBack }: { room: typeof mockRooms[0], onBack: () => void }) => {
  const [message, setMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const conversationId = `room_${room.id}`;
  
  // Use last seen scroll hook for this room
  const { messagesContainerRef, markAsRead, scrollToLastSeenMessage } = useLastSeenScroll({
    conversationId,
    messages: mockMessages,
    isVisible: true,
    chatType: 'room'
  });

  const handleSimulateReturn = () => {
    // Force re-scroll to last seen position
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      scrollToLastSeenMessage();
    }, 100);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      // Mark as read when sending a message (user is actively participating)
      markAsRead();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border/50 p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-medium">{room.name}</h2>
          <p className="text-sm text-muted-foreground">{room.memberCount} members</p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>



      {/* Messages */}
      <div 
        key={refreshKey}
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {mockMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-3 message-item transition-all duration-300",
              msg.isOwn ? "justify-end" : "justify-start"
            )}
            data-message-id={msg.id}
          >
            {!msg.isOwn && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.user.avatar} />
                <AvatarFallback>{msg.user.displayName[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className={cn(
              "max-w-xs lg:max-w-md",
              msg.isOwn ? "order-1" : "order-2"
            )}>
              {!msg.isOwn && (
                <p className="text-xs text-muted-foreground mb-1">{msg.user.displayName}</p>
              )}
              <div className={cn(
                "rounded-lg px-3 py-2 backdrop-blur-sm",
                msg.isOwn 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-card/80 border border-border/60 text-foreground"
              )}>
                <p className="text-sm">{msg.content}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-border/50 bg-card/95 backdrop-blur-md p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<typeof mockRooms[0] | null>(null);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const handleCreateRoom = () => {
    setIsCreateRoomModalOpen(true);
  };

  if (selectedRoom) {
    return <ChatView room={selectedRoom} onBack={() => setSelectedRoom(null)} />;
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        {mockRooms.length === 0 ? (
          <EmptyState onCreateRoom={handleCreateRoom} />
        ) : (
          <div className="p-4 lg:p-6">
            {/* Header with Create Room button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Rooms</h2>
                <p className="text-sm text-muted-foreground">Connect with communities and groups</p>
              </div>
              <Button 
                onClick={handleCreateRoom}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-lg lg:px-6 lg:py-3 lg:rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Create Room</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockRooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onClick={() => setSelectedRoom(room)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal 
        isOpen={isCreateRoomModalOpen} 
        onClose={() => setIsCreateRoomModalOpen(false)} 
      />
    </>
  );
}