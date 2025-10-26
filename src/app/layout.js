import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='flex'>
          <Sidebar />
          <div className='flex-1 p-6 bg-slate-100 dark:bg-[#111827]'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}