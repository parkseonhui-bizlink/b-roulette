'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '@/types/member';

interface MemberContextType {
  members: Member[];
  addMember: (name: string) => void;
  removeMember: (id: string) => void;
  toggleExclude: (id: string) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  const addMember = (name: string) => {
    setMembers((prev) => [...prev, { id: uuidv4(), name, excluded: false }]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const toggleExclude = (id: string) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, excluded: !member.excluded } : member)));
  };

  return <MemberContext.Provider value={{ members, addMember, removeMember, toggleExclude }}>{children}</MemberContext.Provider>;
}

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
}
