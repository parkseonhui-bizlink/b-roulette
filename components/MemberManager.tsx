'use client';

import { useState } from 'react';
import { useMemberContext } from '@/contexts/MemberContext';

export default function MemberManager() {
  const { members, addMember, removeMember, toggleExclude } = useMemberContext();
  const [newMemberName, setNewMemberName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>멤버 관리</h2>
      <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
        <input
          type='text'
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder='새 멤버 이름'
          className='flex-grow p-2 border rounded'
        />
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
          추가
        </button>
      </form>
      <ul className='space-y-2'>
        {members.map((member) => (
          <li key={member.id} className='flex items-center justify-between p-2 bg-gray-100 rounded'>
            <span className={member.excluded ? 'line-through text-gray-500' : ''}>{member.name}</span>
            <div>
              <button
                onClick={() => toggleExclude(member.id)}
                className={`px-2 py-1 rounded mr-2 ${member.excluded ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors`}
              >
                {member.excluded ? '포함' : '제외'}
              </button>
              <button onClick={() => removeMember(member.id)} className='px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors'>
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
