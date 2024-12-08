'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine';
import Link from 'next/link';

export default function Roulette() {
  const [winner, setWinner] = useState<string | null>(null);

  const handleWinnerSelected = (selectedWinner: string | null) => {
    setWinner(selectedWinner);
    // 여기에서 필요한 추가 로직을 수행할 수 있습니다.
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>랜덤 멤버 선택</h1>
        <Link href='/members' className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'>
          멤버 관리하기
        </Link>
      </div>
      <SlotMachine onWinnerSelected={handleWinnerSelected} />
      {winner && (
        <div className='mt-8 text-center'>
          <h2 className='text-2xl font-bold'>당첨자</h2>
          <p className='text-xl mt-2'>{winner}</p>
        </div>
      )}
    </div>
  );
}
