import { Noto_Sans_JP } from 'next/font/google';

import { MemberProvider } from '@/contexts/MemberContext';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Bizlink司会者ランダム',
  description: 'Bizlink司会者ランダム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja' className={notoSansJP.className}>
      <body>
        <MemberProvider>{children}</MemberProvider>
      </body>
    </html>
  );
}
