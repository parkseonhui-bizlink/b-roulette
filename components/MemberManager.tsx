'use client';

import { useState } from 'react';
import { useMemberContext } from '@/contexts/MemberContext';
import { Search } from 'lucide-react';

export default function MemberManager() {
  const { members, addMember, removeMember, toggleExclude, loading, error } = useMemberContext();
  const [newMemberName, setNewMemberName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      await addMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Bizlinkメンバー管理</h2>
      <form onSubmit={handleSubmit} className='flex gap-2 mb-4'>
        <input
          type='text'
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder='メンバー追加'
          className='flex-grow p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          追加
        </button>
      </form>
      <div className='relative mb-4'>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='メンバー検索'
          className='w-full p-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
        />
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
      </div>
      <ul className='space-y-2'>
        {filteredMembers.map((member) => (
          <li key={member.id} className='flex items-center justify-between p-2 bg-gray-100 rounded'>
            <span className={member.excluded ? 'line-through text-gray-500' : ''}>{member.name}</span>
            <div>
              <button
                onClick={() => toggleExclude(member.id)}
                className={`px-2 py-1 rounded mr-2 ${member.excluded ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors`}
              >
                {member.excluded ? '含む' : '除外'}
              </button>
              <button onClick={() => removeMember(member.id)} className='px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors'>
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
      {filteredMembers.length === 0 && <p className='text-center text-gray-500 mt-4'>検索結果がないです。</p>}
    </div>
  );
}
