"use client"

import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { ToastProvider } from '@/components/common/Toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <DarkModeProvider>
          <AuthProvider>
            <ToastProvider>
              {/* Skip to main content link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
              >
                Skip to main content
              </a>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ToastProvider>
          </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}