'use client';

import { useState, useEffect } from 'react';
import { useMemberContext } from '@/contexts/MemberContext';
import { Search } from 'lucide-react';

export default function MemberManager() {
  const { members, addMember, removeMember, toggleExclude, loading, error } = useMemberContext();
  const [newMemberName, setNewMemberName] = useState('');
  const [chatworkId, setChatworkId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 제외 상태가 만료된 멤버를 확인하고 업데이트
  useEffect(() => {
    const now = new Date();

    members.forEach((member) => {
      if (member.excludedUntil && new Date(member.excludedUntil) <= now && member.excluded) {
        // 제외 상태 만료 -> 포함 상태로 전환
        toggleExclude(member.id);
      }
    });
  }, [members, toggleExclude]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      await addMember(newMemberName.trim(), chatworkId.trim());
      setNewMemberName('');
      setChatworkId('');
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || (member.chatworkId && member.chatworkId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>メンバーを読み込み中...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Bizlinkメンバー管理</h2>

      {/* 신규 멤버 추가 */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 mb-4'>
        <div className='flex gap-4'>
          <div className='flex gap-2 w-full'>
            <input
              type='text'
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder='メンバー名'
              className='w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
            <input
              type='text'
              value={chatworkId}
              onChange={(e) => setChatworkId(e.target.value)}
              placeholder='Chatwork ID'
              className='w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>
          <button
            type='submit'
            className='w-28 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            追加
          </button>
        </div>
      </form>

      {/* 검색 입력 */}
      <div className='relative mb-4'>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='メンバー検索'
          className='w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
        />
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
      </div>

      {/* 멤버 리스트 */}
      <ul className='space-y-2'>
        {filteredMembers.map((member) => {
          const isExcluded = member.excludedUntil && new Date(member.excludedUntil) > new Date();
          const remainingDays = member.excludedUntil ? Math.ceil((new Date(member.excludedUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

          return (
            <li key={member.id} className='flex items-center justify-between p-2 bg-gray-100 rounded'>
              <div>
                {/* 멤버 이름과 제외 상태 */}
                <span className={isExcluded ? 'line-through text-gray-500' : ''}>{member.name}</span>
                <p className='text-sm text-gray-400'>
                  {member.chatworkId || '未設定'}
                  {isExcluded && <span className='ml-2 text-yellow-600'>除外中 ({remainingDays}日)</span>}
                </p>
              </div>
              <div>
                {/* 제외 상태 토글 버튼 */}
                <button
                  onClick={() => toggleExclude(member.id)}
                  className={`px-2 py-1 rounded mr-2 ${
                    isExcluded ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
                  } text-white transition-colors`}
                >
                  {isExcluded ? '含む' : '除外'}
                </button>
                {/* 멤버 삭제 버튼 */}
                <button onClick={() => removeMember(member.id)} className='px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors'>
                  削除
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 검색 결과 없음 */}
      {filteredMembers.length === 0 && <p className='text-center text-gray-500 mt-4'>検索結果がないです。</p>}
    </div>
  );
}
