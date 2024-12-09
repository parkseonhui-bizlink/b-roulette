'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine';
import Link from 'next/link';

export default function Roulette() {
  const [winner, setWinner] = useState<string | null>(null);

  const handleWinnerSelected = (selectedWinner: string | null) => {
    setWinner(selectedWinner);
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>司会者</h1>
        <Link href='/members' className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'>
          メンバー管理
        </Link>
      </div>
      <SlotMachine onWinnerSelected={handleWinnerSelected} />
      {winner && (
        <div className='mt-8 text-center'>
          <h2 className='text-2xl font-bold'>結果</h2>
          <p className='text-xl mt-2'>{winner}</p>
        </div>
      )}
    </div>
  );
}
