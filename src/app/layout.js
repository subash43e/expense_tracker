import Sidebar from '@/components/layout/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <div className='flex border h-screen bg-slate-100'>
            <Sidebar />
            <div className='w-full overflow-y-scroll'>
              {children}
            </div>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}