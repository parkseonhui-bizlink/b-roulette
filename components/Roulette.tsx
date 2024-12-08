'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine';
import Link from 'next/link';

export default function Roulette() {
  const [winner, setWinner] = useState<string | null>(null);

  const handleComplete = (selectedMember: string) => {
    setWinner(selectedMember);
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>랜덤 멤버 선택</h1>
        <Link href='/members' className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'>
          멤버 관리하기
        </Link>
      </div>
      <SlotMachine onComplete={handleComplete} />
    </div>
  );
}
