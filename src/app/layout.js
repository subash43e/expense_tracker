import Sidebar from '@/components/layout/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <div className='flex border h-screen bg-slate-100'>
            <Sidebar />
            <main 
              id="main-content" 
              className='w-full overflow-y-scroll'
              role="main"
              aria-label="Main content"
            >
              {children}
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}