import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface WinnerOverlayProps {
  winner: string | null;
  onClose: () => void;
}

type MotionDivProps = HTMLMotionProps<'div'> & React.HTMLAttributes<HTMLDivElement>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

type MotionButtonProps = HTMLMotionProps<'button'> & React.ButtonHTMLAttributes<HTMLButtonElement>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

export default function WinnerOverlay({ winner, onClose }: WinnerOverlayProps) {
  useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [winner]);

  return (
    <AnimatePresence>
      {winner && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
        >
          <motion.div
            initial={{ scale: 0.5, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{
              background: 'linear-gradient(to right, #9333ea, #ec4899, #ef4444)',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              🎉 おめでとうございます！ 🎉
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              style={{
                fontSize: '3.75rem',
                fontWeight: 800,
                marginBottom: '1.5rem',
                backgroundClip: 'text',
                color: 'transparent',
                backgroundImage: 'linear-gradient(to right, #facc15, #ffffff)',
                padding: '1rem',
              }}
            >
              {winner}
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontSize: '1.25rem' }}>
              {winner}さんが選べました！
              <br />
              来週の司会よろしくお願いいたします！
            </motion.p>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1.5rem',
                backgroundColor: 'white',
                color: '#9333ea',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '1.125rem',
                transition: 'background-color 0.2s',
              }}
              onClick={onClose}
            >
              閉じる
            </MotionButton>
          </motion.div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
