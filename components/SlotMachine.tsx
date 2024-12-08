'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemberContext } from '@/contexts/MemberContext';
import WinnerOverlay from './WinnerOverlay';

interface SlotMachineProps {
  onComplete: (winner: string) => void;
}

export default function SlotMachine({ onComplete }: SlotMachineProps) {
  const { members } = useMemberContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNames, setDisplayNames] = useState(['?', '?', '?']);
  const [winner, setWinner] = useState<string | null>(null);

  const activeMembers = members.filter((member) => !member.excluded);

  const getRandomName = () => {
    const index = Math.floor(Math.random() * activeMembers.length);
    return activeMembers[index].name;
  };

  const spin = () => {
    if (isSpinning || activeMembers.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const selectedWinner = getRandomName();

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      setDisplayNames((prev) => prev.map(() => getRandomName()));
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setDisplayNames([selectedWinner, selectedWinner, selectedWinner]);
        setIsSpinning(false);
        setWinner(selectedWinner);
        onComplete(selectedWinner);
      }
    }, 100);
  };

  const closeOverlay = () => {
    setWinner(null);
  };

  const colors = [
    '#FFB800', // 노란색
    '#FF4B4B', // 빨간색
    '#FFFFFF', // 흰색
    '#FFB4B4', // 연한 분홍색
  ];

  return (
    <div className='flex flex-col items-center gap-8'>
      <div className='relative bg-white rounded-xl shadow-xl p-8 w-[400px]'>
        <div className='absolute -top-2 -right-2'>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className='w-6 h-6 bg-blue-500 rounded-full' />
        </div>
        <div className='absolute -bottom-2 -left-2'>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className='w-6 h-6 bg-yellow-500 rounded-full'
          />
        </div>

        <div className='flex justify-center gap-2 mb-4'>
          {displayNames.map((name, index) => (
            <div
              key={index}
              className='w-[100px] h-[60px] rounded-lg border-2 border-gray-200 overflow-hidden relative'
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              <AnimatePresence>
                <motion.div
                  key={name + index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700'
                >
                  {name}
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <motion.button
          onClick={spin}
          disabled={isSpinning || activeMembers.length === 0}
          className='w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpinning ? '선택 중...' : '랜덤 선택'}
        </motion.button>
      </div>

      <WinnerOverlay winner={winner} onClose={closeOverlay} />
    </div>
  );
}
