import { MemberProvider } from '@/contexts/MemberContext';
import MemberManager from '@/components/MemberManager';
import Link from 'next/link';

export default function MembersPage() {
  return (
    <MemberProvider>
      <main className='min-h-screen bg-gray-100 py-8'>
        <div className='max-w-2xl mx-auto px-4'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold mb-4'>멤버 관리</h1>
            <Link href='/' className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'>
              룰렛으로 돌아가기
            </Link>
          </div>
          <MemberManager />
        </div>
      </main>
    </MemberProvider>
  );
}
