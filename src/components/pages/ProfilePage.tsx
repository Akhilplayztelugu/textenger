import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, Users, Heart, MessageCircle, Grid, List } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { EditProfileModal } from '../EditProfileModal';

// Function to get user data from authentication
const getUserFromAuth = () => {
  const storedUser = localStorage.getItem('textenger_user');
  if (storedUser) {
    const authUser = JSON.parse(storedUser);
    return {
      username: authUser.username,
      displayName: authUser.displayName,
      email: authUser.email,
      bio: `Welcome to my profile! I'm ${authUser.displayName} and I'm excited to be part of the Textenger community. 🎉`,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      friendsCount: 0,
      postsCount: 0,
      joinedDate: `Joined ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    };
  }
  
  // Fallback to demo user
  return {
    username: 'demo_user',
    displayName: 'Demo User',
    email: 'demo@textenger.com',
    bio: 'Welcome to my demo profile! Exploring all the amazing features of Textenger. 🚀',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    friendsCount: 12,
    postsCount: 5,
    joinedDate: `Joined ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
  };
};

// Mock posts data
const mockPosts = [
  {
    id: 1,
    mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
    likes: 124,
    comments: 8,
    type: 'image'
  },
  {
    id: 2,
    mediaUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    likes: 89,
    comments: 12,
    type: 'image'
  },
  {
    id: 3,
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop',
    likes: 67,
    comments: 5,
    type: 'image'
  },
  {
    id: 4,
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
    likes: 156,
    comments: 23,
    type: 'image'
  },
  {
    id: 5,
    mediaUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop',
    likes: 203,
    comments: 17,
    type: 'image'
  },
  {
    id: 6,
    mediaUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&h=300&fit=crop',
    likes: 98,
    comments: 9,
    type: 'image'
  }
];

const EmptyPosts = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mb-6">
      <Grid className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-3 text-foreground">No posts yet</h3>
    <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
      Start sharing your content with the world
    </p>
  </div>
);

const PostGrid = ({ posts }: { posts: typeof mockPosts }) => (
  <div className="grid grid-cols-3 gap-1">
    {posts.map((post) => (
      <div key={post.id} className="aspect-square relative group cursor-pointer">
        <ImageWithFallback 
          src={post.mediaUrl}
          alt="Post"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PostList = ({ posts, user }: { posts: typeof mockPosts, user: typeof initialMockUser }) => (
  <div className="space-y-4">
    {posts.map((post) => (
      <Card key={post.id}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <div className="mb-3 rounded-lg overflow-hidden">
            <ImageWithFallback 
              src={post.mediaUrl}
              alt="Post content"
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="w-4 h-4" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export function ProfilePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(getUserFromAuth());

  const handleSaveProfile = (updatedUser: { username: string; displayName: string; avatar: string }) => {
    const newUserData = {
      ...user,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      avatar: updatedUser.avatar
    };
    setUser(newUserData);
    
    // Update localStorage with new profile data
    const storedUser = localStorage.getItem('textenger_user');
    if (storedUser) {
      const authUser = JSON.parse(storedUser);
      const updatedAuthUser = {
        ...authUser,
        username: updatedUser.username,
        displayName: updatedUser.displayName
      };
      localStorage.setItem('textenger_user', JSON.stringify(updatedAuthUser));
    }
    
    console.log('Profile updated:', updatedUser);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-28 h-28 mx-auto mb-6 ring-4 ring-border/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-3xl font-bold">{user.displayName[0]}</AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-2 text-foreground">{user.displayName}</h1>
          <p className="text-muted-foreground mb-4 text-lg">@{user.username}</p>
          
          <p className="text-base mb-6 max-w-md mx-auto leading-relaxed text-muted-foreground">{user.bio}</p>
          
          {/* Stats - Only Friends and Posts */}
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{user.postsCount}</p>
              <p className="text-sm font-medium text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{user.friendsCount}</p>
              <p className="text-sm font-medium text-muted-foreground">Friends</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center mb-6">
            <Button 
              onClick={() => setIsEditModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">{user.joinedDate}</p>
        </div>
        
        {/* Posts Section */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Your Posts</h2>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {mockPosts.length === 0 ? (
              <EmptyPosts />
            ) : viewMode === 'grid' ? (
              <PostGrid posts={mockPosts} />
            ) : (
              <PostList posts={mockPosts} user={user} />
            )}
          </TabsContent>
          
          <TabsContent value="liked" className="mt-6">
            <EmptyPosts />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <EmptyPosts />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}