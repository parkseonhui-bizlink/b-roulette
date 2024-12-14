'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine'; // 랜덤 선택 컴포넌트
import Link from 'next/link';

export default function Roulette() {
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // SlotMachine에서 선택된 winner를 업데이트
  const handleWinnerSelected = (selectedWinner: string | null) => {
    setWinner(selectedWinner);
  };

  // Chatwork 태스크 생성 API 호출
  const createChatworkTask = async () => {
    if (!winner) {
      alert('選ばれた司会者がいません！');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/chatwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner }), // winner 이름을 서버로 보냄
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create Chatwork task.');
      }

      alert('Chatworkタスクが作成されました！');
    } catch (error) {
      console.error('Failed to create task:', (error as Error).message);
      alert((error as Error).message || 'タスク作成に失敗しました。');
    } finally {
      setLoading(false);
    }
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
          <p className='text-xl mt-2'>{winner}さんが選ばれました！</p>
          <button
            onClick={createChatworkTask}
            className='mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors'
            disabled={loading}
          >
            {loading ? '作成中...' : 'Chatworkタスク作成'}
          </button>
        </div>
      )}
    </div>
  );
}
