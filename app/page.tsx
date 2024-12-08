import { MemberProvider } from '@/contexts/MemberContext';
import Roulette from '@/components/Roulette';

export default function Home() {
  return (
    <MemberProvider>
      <main className='min-h-screen bg-gray-100 py-8'>
        <Roulette />
      </main>
    </MemberProvider>
  );
}
