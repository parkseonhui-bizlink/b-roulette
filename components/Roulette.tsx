'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine'; // 랜덤 선택 컴포넌트
import TaskTypeModal from './TaskTypeModal';

export default function Roulette() {
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = process.env.NEXT_PUBLIC_MEMBER_PASSWORD || '';

  // SlotMachine에서 선택된 winner를 업데이트
  const handleWinnerSelected = (selectedWinner: string | null) => {
    setWinner(selectedWinner);
  };

  const openModal = () => {
    if (!winner) {
      alert('選ばれた司会者がいません！');
      return;
    }
    setModalOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      window.location.href = '/members'; // 비밀번호가 맞으면 페이지 이동
    } else {
      alert('PWを間違えました');
    }
  };

  const createChatworkTask = async (selectedType: string) => {
    setLoading(true);

    if (!winner) {
      alert('選ばれた司会者がいません！');
      return;
    }

    try {
      // Chatwork API 호출
      const chatworkResponse = await fetch('/api/chatwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner, taskType: selectedType }),
      });

      if (!chatworkResponse.ok) {
        const chatworkError = await chatworkResponse.json();
        throw new Error(chatworkError.error || 'Failed to create Chatwork task.');
      }

      // Google Sheets API 호출
      const googleSheetsResponse = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner }),
      });

      if (!googleSheetsResponse.ok) {
        const googleSheetsError = await googleSheetsResponse.json();
        throw new Error(googleSheetsError.error || 'Failed to update Google Sheets.');
      }

      alert('ChatworkタスクとGoogle Sheetsが更新されました！');
    } catch (error) {
      console.error('Error:', error);
      alert((error as Error).message || 'タスク作成に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto h-screen flex flex-col justify-center relative top-[-5rem]'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-4'>司会者</h1>
        <button
          onClick={() => setPasswordModalOpen(true)}
          className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'
        >
          メンバー管理
        </button>
      </div>
      <SlotMachine onWinnerSelected={handleWinnerSelected} />
      {winner && (
        <div className='mt-8 text-center'>
          <h2 className='text-2xl font-bold'>結果</h2>
          <p className='text-xl mt-2'>{winner}さんが選ばれました！</p>
          <button onClick={openModal} className='mt-4 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors' disabled={loading}>
            {loading ? '作成中...' : 'Chatworkタスク作成'}
          </button>
        </div>
      )}
      <TaskTypeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={createChatworkTask} />
      {/* 비밀번호 모달 */}
      {isPasswordModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>パスワード入力</h2>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border border-gray-300 rounded-md px-4 py-2 w-full mb-4'
              placeholder='パスワードを入力してください。'
            />
            <button onClick={handlePasswordSubmit} className='bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors w-full'>
              確認
            </button>
            <button onClick={() => setPasswordModalOpen(false)} className='mt-2 text-gray-600 underline'>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
