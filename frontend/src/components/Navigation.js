import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from './theme-provider';

const Navigation = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Upload', path: '/upload' },
    { text: 'Train', path: '/train' },
    { text: 'Predict', path: '/predict' },
    { text: 'Compare', path: '/compare' },
    { text: 'Explain', path: '/explain' },
    { text: 'History', path: '/history' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/defpred-logo.png"
              alt="DefPred Logo"
              className="w-12 h-12 object-contain rounded-full"
            />
            <span className="font-bold text-2xl tracking-tight">DefPred</span>
          </Link>

          <div className="hidden md:flex items-center bg-card rounded-full px-2 py-2 border border-border shadow-lg">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'rounded-full px-6 py-2 font-medium transition-all',
                      isActive
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    {item.text}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-full px-4 py-2 bg-card hover:bg-secondary border border-border font-medium flex items-center gap-2"
              onClick={() => setTheme(nextTheme)}
              title={`Theme: ${themeLabel} (click to switch)`}
            >
              <ThemeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{themeLabel}</span>
            </Button>

            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-10 w-10',
                  },
                }}
              />
            ) : (
              <>
                <Link to="/features">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-3 bg-white text-black hover:bg-gray-100 border border-border shadow-md font-medium"
                  >
                    Features
                  </Button>
                </Link>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-8 py-3 bg-card hover:bg-secondary border border-border font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
