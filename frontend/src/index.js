import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './index.css';
import App from './App';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.warn('Missing Clerk Publishable Key. Please add REACT_APP_CLERK_PUBLISHABLE_KEY to .env.local');
}

// Detect system theme
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const clerkAppearance = {
  baseTheme: isDarkMode ? dark : undefined,
  variables: {
    colorPrimary: '#ef4444', // Red color for buttons
    colorDanger: '#dc2626',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
  },
  elements: {
    formButtonPrimary: {
      backgroundColor: '#ef4444',
      '&:hover': {
        backgroundColor: '#dc2626',
      },
      '&:active': {
        backgroundColor: '#b91c1c',
      },
    },
    socialButtonsBlockButton: {
      '&:hover': {
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
      },
    },
    card: {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    },
    footerActionLink: {
      color: '#ef4444',
      '&:hover': {
        color: '#dc2626',
      },
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
