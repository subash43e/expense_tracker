import Sidebar from '@/components/layout/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='flex border h-screen bg-slate-100'>
          <Sidebar />
          <div className='w-full overflow-y-scroll'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}