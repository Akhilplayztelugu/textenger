import React, { useState } from 'react';
import { MobileLayout } from './mobile/MobileLayout';
import { useAuthContext } from './auth/AuthProvider';
import { Button } from './ui/button';
import { SignUpModal } from './modals/SignUpModal';
import { SignInModal } from './modals/SignInModal';

interface AuthPageProps {
  onAuthenticated: () => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const { signUp, signIn } = useAuthContext();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleSignUp = async (email: string, password: string, username: string, displayName: string) => {
    try {
      const { user, error } = await signUp(email, password, username, displayName);
      if (error) {
        throw error;
      }
      if (user) {
        onAuthenticated();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { user, error } = await signIn(email, password);
      if (error) {
        throw error;
      }
      if (user) {
        onAuthenticated();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSwitchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  return (
    <MobileLayout>
      <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo and Branding */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-2xl ring-4 ring-purple-400/20">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Textenger
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect • Share • Chat
          </p>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome to Textenger
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Join the community where every conversation matters. Share your stories, connect with friends, and discover amazing content.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => setIsSignUpModalOpen(true)}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Button>
          
          <Button
            onClick={() => setIsSignInModalOpen(true)}
            variant="outline"
            className="w-full h-12 font-semibold text-lg border-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-400/70 transition-all duration-300"
          >
            Sign In
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <button className="text-primary hover:underline">Terms of Service</button>{' '}
            and{' '}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </MobileLayout>

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSignUp={handleSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
  );
}