import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='flex'>
          <Sidebar />
          <div className='w-full'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}