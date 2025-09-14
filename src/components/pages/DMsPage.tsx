import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowLeft, Send, MessageCircle, MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { cn } from '../ui/utils';
import { useLastSeenScroll } from '../hooks/useLastSeenScroll';

// Mock data for DM conversations
const mockConversations = [
  {
    id: 1,
    user: { username: 'gamer_alex', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
    lastMessage: 'Thanks for the game tips!',
    lastMessageTime: '5m',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 2,
    user: { username: 'pixel_art_pro', displayName: 'Maya Storm', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    lastMessage: 'Can you review my latest artwork?',
    lastMessageTime: '1h',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 3,
    user: { username: 'code_ninja', displayName: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    lastMessage: 'The React component looks great!',
    lastMessageTime: '2h',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 4,
    user: { username: 'neon_dreams', displayName: 'Zoe Park', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    lastMessage: 'See you at the gaming meetup!',
    lastMessageTime: '1d',
    unreadCount: 0,
    isOnline: false
  }
];

// Mock messages for a conversation
const mockMessages = [
  {
    id: 1,
    content: 'Hey! How did your gaming session go yesterday?',
    timestamp: '2:30 PM',
    isOwn: false
  },
  {
    id: 2,
    content: 'It was amazing! We won 5 matches in a row 🎮',
    timestamp: '2:32 PM',
    isOwn: true
  },
  {
    id: 3,
    content: 'That sounds awesome! What game were you playing?',
    timestamp: '2:33 PM',
    isOwn: false
  },
  {
    id: 4,
    content: 'Valorant! We should play together sometime',
    timestamp: '2:35 PM',
    isOwn: true
  },
  {
    id: 5,
    content: 'Definitely! I\'ve been trying to improve my aim',
    timestamp: '2:40 PM',
    isOwn: false
  },
  {
    id: 6,
    content: 'I can give you some tips! Want to hop on a call later?',
    timestamp: '2:42 PM',
    isOwn: true
  }
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6">
      <MessageCircle className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-3 text-foreground">No conversations yet</h3>
    <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
      Search for users above or start a conversation to see your chats here
    </p>
  </div>
);

const ConversationCard = ({ conversation, onClick }: { conversation: typeof mockConversations[0], onClick: () => void }) => (
  <Card className="cursor-pointer hover:bg-accent/60 transition-all duration-200 active:scale-[0.98] border-border/40 bg-card/60 backdrop-blur-sm shadow-sm" onClick={onClick}>
    <CardContent className="p-5">
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="w-14 h-14 ring-2 ring-border/20">
            <AvatarImage src={conversation.user.avatar} />
            <AvatarFallback className="text-lg font-semibold">{conversation.user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-card",
            conversation.isOnline ? "bg-green-500" : "bg-gray-400"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg truncate text-foreground">{conversation.user.displayName}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-muted-foreground font-medium">{conversation.lastMessageTime}</span>
              {conversation.unreadCount > 0 && (
                <div className="bg-primary text-primary-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
          <p className="text-base text-muted-foreground truncate leading-relaxed">{conversation.lastMessage}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChatView = ({ conversation, onBack }: { conversation: typeof mockConversations[0], onBack: () => void }) => {
  const [message, setMessage] = useState('');
  
  // Use last seen scroll hook for this conversation
  const { messagesContainerRef, markAsRead } = useLastSeenScroll({
    conversationId: `dm_${conversation.id}`,
    messages: mockMessages,
    isVisible: true,
    chatType: 'dm'
  });

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      // Mark as read when sending a message (user is actively participating)
      markAsRead();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation.user.avatar} />
            <AvatarFallback>{conversation.user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card",
            conversation.isOnline ? "bg-green-500" : "bg-gray-400"
          )} />
        </div>
        <div className="flex-1">
          <h2 className="font-medium text-foreground">{conversation.user.displayName}</h2>
          <p className="text-xs text-muted-foreground">
            {conversation.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="space-y-6 pb-4">
            {mockMessages.map((msg, index) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex message-item",
                  msg.isOwn ? "justify-end" : "justify-start"
                )}
                data-message-id={msg.id}
              >
                <div className={cn(
                  "max-w-[280px] sm:max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-300",
                  msg.isOwn 
                    ? "bg-primary text-primary-foreground rounded-br-md shadow-md" 
                    : "bg-card/80 border border-border/60 text-foreground rounded-bl-md"
                )}>
                  <p className="text-base leading-relaxed">{msg.content}</p>
                  <p className={cn(
                    "text-xs mt-2 font-medium",
                    msg.isOwn 
                      ? "text-primary-foreground/80" 
                      : "text-muted-foreground"
                  )}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input - Fixed at bottom with proper mobile spacing */}
        <div className="border-t border-border/50 bg-card/95 backdrop-blur-md flex-shrink-0">
          <div className="p-4 pb-safe">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="min-h-[52px] py-4 px-5 text-base leading-normal bg-input-background/90 border-2 border-border/60 focus:border-primary/60 transition-all duration-200 rounded-full pr-12 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
                  autoComplete="off"
                  style={{ fontSize: '16px' }} // Prevents zoom on iOS
                />
                {message.trim() && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSend} 
                disabled={!message.trim()}
                size="lg"
                className={cn(
                  "min-h-[52px] min-w-[52px] p-0 rounded-full font-semibold transition-all duration-200",
                  message.trim() 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function DMsPage() {
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: number, username: string, displayName: string, avatar: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Mock search results - in real app, this would call Supabase
    setTimeout(() => {
      const mockUsers = [
        { id: 1, username: 'gaming_pro', displayName: 'Gaming Pro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { id: 2, username: 'pixel_master', displayName: 'Pixel Master', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
        { id: 3, username: 'code_wizard', displayName: 'Code Wizard', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face' }
      ];
      
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleStartConversation = (user: typeof searchResults[0]) => {
    console.log('Starting conversation with:', user);
    setSearchQuery('');
    setSearchResults([]);
    // In real app, this would create a new conversation
  };

  if (selectedConversation) {
    return <ChatView conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 lg:p-6 pb-safe">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users to start a conversation..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-13 h-14 text-base bg-card border-2 border-border focus:border-primary transition-all duration-200 rounded-2xl"
              style={{ fontSize: '16px' }} // Prevents zoom on iOS
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartConversation(user)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="font-semibold">{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-base text-foreground">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                  <UserPlus className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversations */}
        {mockConversations.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">Recent Conversations</h3>
            <div className="space-y-4">
              {mockConversations.map((conversation) => (
                <ConversationCard 
                  key={conversation.id} 
                  conversation={conversation} 
                  onClick={() => setSelectedConversation(conversation)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}