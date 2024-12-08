import { MemberProvider } from '@/contexts/MemberContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <MemberProvider>{children}</MemberProvider>
      </body>
    </html>
  );
}
