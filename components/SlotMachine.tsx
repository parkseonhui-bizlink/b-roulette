'use client';

import { useState, useEffect, useCallback, useMemo, ComponentProps } from 'react';
import { motion } from 'framer-motion';
import { useMemberContext } from '@/contexts/MemberContext';
import WinnerOverlay from './WinnerOverlay';

interface SlotMachineProps {
  onWinnerSelected?: (winner: string | null) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SlotMachine({ onWinnerSelected }: SlotMachineProps) {
  const { members, setExclusion } = useMemberContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [displayNames, setDisplayNames] = useState(['?', '?', '?']);

  const activeMembers = useMemo(() => {
    const now = new Date();
    return members.filter((member) => !member.excludedUntil || new Date(member.excludedUntil) < now);
  }, [members]);

  const [shuffledMembers, setShuffledMembers] = useState<string[]>([]);

  useEffect(() => {
    setShuffledMembers(shuffleArray(members.map((m) => m.name)));
  }, [members]);

  const spin = useCallback(async () => {
    if (isSpinning || activeMembers.length === 0) return;

    const spinSound = new Audio('/sounds/spin-sound.mp3');

    setIsSpinning(true);
    setWinner(null);
    if (onWinnerSelected) onWinnerSelected(null);

    const spinDuration = 6000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = spinDuration / interval;

    let currentIndex = 0;

    try {
      await spinSound.play(); // 한 번 재생
    } catch (error) {
      console.error('Failed to play sound:', error);
    }

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      setDisplayNames([
        shuffledMembers[currentIndex % shuffledMembers.length],
        shuffledMembers[(currentIndex + 1) % shuffledMembers.length],
        shuffledMembers[(currentIndex + 2) % shuffledMembers.length],
      ]);
      currentIndex++;
    }

    let selectedWinner: string | null = null;
    do {
      const randomIndex = Math.floor(Math.random() * shuffledMembers.length);
      selectedWinner = shuffledMembers[randomIndex];

      // 활성 멤버인지 확인
      const isActive = activeMembers.some((member) => member.name === selectedWinner);
      if (isActive) break; // 활성 멤버라면 선택 완료
    } while (true);

    setDisplayNames([selectedWinner!, selectedWinner!, selectedWinner!]);
    setWinner(selectedWinner);

    // const randomIndex = Math.floor(Math.random() * shuffledMembers.length);
    // const selectedWinner = shuffledMembers[randomIndex];
    // setDisplayNames([selectedWinner, selectedWinner, selectedWinner]);
    // setWinner(selectedWinner);

    // 30일 후의 날짜 설정
    const exclusionDate = new Date();
    exclusionDate.setDate(exclusionDate.getDate() + 30);

    // 선택된 멤버를 30일 동안 제외
    const selectedMember = members.find((member) => member.name === selectedWinner);
    if (selectedMember) {
      await setExclusion(selectedMember.id, exclusionDate);
    }

    setIsSpinning(false);
    if (onWinnerSelected) onWinnerSelected(selectedWinner);
  }, [isSpinning, activeMembers.length, shuffledMembers, onWinnerSelected, members, setExclusion]);

  const closeOverlay = () => {
    setWinner(null);
  };

  const colors = ['#FFB800', '#FF4B4B', '#FFFFFF', '#FFB4B4'];

  const MotionButton = motion.button as React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & ComponentProps<typeof motion.button>>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div
        style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '2rem',
          width: '700px',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
            width: '1.5rem',
            height: '1.5rem',
            backgroundColor: '#3B82F6',
            borderRadius: '9999px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-0.5rem',
            left: '-0.5rem',
            width: '1.5rem',
            height: '1.5rem',
            backgroundColor: '#FFB800',
            borderRadius: '9999px',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className='w-full'
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            overflow: 'hidden',
          }}
        >
          {displayNames.map((name, index) => (
            <div
              key={index}
              className='text-3xl w-1/3 py-4'
              style={{
                borderRadius: '0.5rem',
                border: '2px solid #E5E7EB',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: colors[index % colors.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'rgb(55, 65, 81)',
              }}
            >
              {name}
            </div>
          ))}
        </div>
        <MotionButton
          className='bg-purple-600 text-3xl'
          onClick={spin}
          disabled={isSpinning || activeMembers.length === 0}
          style={{
            width: '100%',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontWeight: 500,
            transition: 'background-color 0.2s',
            cursor: isSpinning || activeMembers.length === 0 ? 'not-allowed' : 'pointer',
            opacity: isSpinning || activeMembers.length === 0 ? 0.5 : 1,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpinning ? '選択中' : 'ランダム選択'}
        </MotionButton>
      </div>

      <WinnerOverlay winner={winner} onClose={closeOverlay} />
    </div>
  );
}
