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
  const { members } = useMemberContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [displayNames, setDisplayNames] = useState(['?', '?', '?']);

  const activeMembers = useMemo(() => members.filter((member) => !member.excluded), [members]);
  const [shuffledMembers, setShuffledMembers] = useState(() => shuffleArray(activeMembers.map((m) => m.name)));

  useEffect(() => {
    setShuffledMembers(shuffleArray(activeMembers.map((m) => m.name)));
  }, [activeMembers]);

  const spin = useCallback(async () => {
    if (isSpinning || activeMembers.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    if (onWinnerSelected) onWinnerSelected(null);

    const spinDuration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = spinDuration / interval;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      setDisplayNames(shuffledMembers.slice(0, 3).map(() => shuffledMembers[Math.floor(Math.random() * shuffledMembers.length)]));
    }

    const randomIndex = Math.floor(Math.random() * shuffledMembers.length);
    const selectedWinner = shuffledMembers[randomIndex];
    setDisplayNames([selectedWinner, selectedWinner, selectedWinner]);
    setWinner(selectedWinner);
    setIsSpinning(false);
    if (onWinnerSelected) onWinnerSelected(selectedWinner);
  }, [isSpinning, activeMembers.length, shuffledMembers, onWinnerSelected]);

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
          width: '400px',
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
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            height: '60px',
            overflow: 'hidden',
          }}
        >
          {displayNames.map((name, index) => (
            <div
              key={index}
              style={{
                width: '100px',
                height: '60px',
                borderRadius: '0.5rem',
                border: '2px solid #E5E7EB',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: colors[index % colors.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'rgb(55, 65, 81)',
              }}
            >
              {name}
            </div>
          ))}
        </div>
        <MotionButton
          className='bg-purple-600'
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
