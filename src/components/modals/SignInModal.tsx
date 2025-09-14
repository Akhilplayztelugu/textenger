import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp?: () => void;
}

export function SignInModal({ isOpen, onClose, onSignIn, onSwitchToSignUp }: SignInModalProps) {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email or Username validation
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSignIn(formData.emailOrUsername, formData.password);
      onClose();
      setFormData({ emailOrUsername: '', password: '' });
      setErrors({});
    } catch (error) {
      console.error('Sign in failed:', error);
      setErrors({ password: 'Invalid credentials. Please check your email and password.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ emailOrUsername: '', password: '' });
    setErrors({});
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto glass-card border-purple-500/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Welcome back to <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Textenger</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email or Username */}
          <div className="space-y-2">
            <Label htmlFor="emailOrUsername">Email or Username</Label>
            <Input
              id="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              value={formData.emailOrUsername}
              onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
              className={`transition-colors ${errors.emailOrUsername ? 'border-red-500 focus:border-red-500' : ''}`}
              autoComplete="username"
            />
            {errors.emailOrUsername && (
              <p className="text-sm text-red-500">{errors.emailOrUsername}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pr-10 transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                // Mock forgot password
                console.log('Forgot password clicked');
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 font-semibold transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={() => {
                handleClose();
                onSwitchToSignUp?.();
              }}
              className="text-primary hover:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}