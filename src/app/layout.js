import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='flex'>
          <Sidebar />
          <div className='flex-1 bg-[#F9FAFB] dark:bg-[#111827]'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}