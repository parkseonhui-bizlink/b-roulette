'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { MemberProvider } from '@/contexts/MemberContext';
import MemberManager from '@/components/MemberManager';
import Link from 'next/link';

export default function MembersPage() {
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = process.env.NEXT_PUBLIC_MEMBER_PASSWORD || '';

  useEffect(() => {
    const savedPassword = Cookies.get('password'); // 쿠키에서 비밀번호 확인
    if (savedPassword === correctPassword) {
      setPasswordVerified(true); // 비밀번호가 맞으면 인증 완료 상태로 설정
    } else {
      setPasswordModalOpen(true); // 비밀번호가 없거나 틀리면 모달 열기
    }
  }, [correctPassword]);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      Cookies.set('password', password, { expires: 1 }); // 쿠키에 비밀번호 저장
      setPasswordVerified(true); // 인증 완료 상태로 설정
      setPasswordModalOpen(false); // 모달 닫기
    } else {
      alert('PWを間違えました');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      {passwordVerified ? (
        <MemberProvider>
          <main className='min-h-screen bg-gray-100 py-8'>
            <div className='max-w-2xl mx-auto px-4'>
              <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold mb-4'>Bizlinkメンバー管理</h1>
                <Link href='/' className='inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors'>
                  ルーレットに戻る
                </Link>
              </div>
              <MemberManager />
            </div>
          </main>
        </MemberProvider>
      ) : null}
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
          </div>
        </div>
      )}
    </div>
  );
}
