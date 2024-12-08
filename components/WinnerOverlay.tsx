import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface WinnerOverlayProps {
  winner: string | null;
  onClose: () => void;
}

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
        <motion.div
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
            className='bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-8 rounded-xl shadow-2xl text-white text-center'
            onClick={(e) => e.stopPropagation()}
          >
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-4xl font-bold mb-4'>
              🎉 축하합니다! 🎉
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className='text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white p-4'
            >
              {winner}
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className='text-xl'>
              당신이 선택되었습니다!
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-8 px-6 py-2 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors'
              onClick={onClose}
            >
              닫기
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
