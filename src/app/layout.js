import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='flex border h-screen'>
          <Sidebar />
          <div className='w-full overflow-scroll'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}