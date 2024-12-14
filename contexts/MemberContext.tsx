'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '@prisma/client';

interface MemberContextType {
  members: Member[];
  addMember: (name: string, chatworkId?: string) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  toggleExclude: (id: string) => Promise<void>;
  setExclusion: (id: string, until: Date) => void;
  loading: boolean;
  error: string | null;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      setError('Failed to fetch members');
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addMember(name: string, chatworkId?: string) {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, chatworkId }),
      });
      if (!response.ok) throw new Error('Failed to add member');
      const newMember = await response.json();
      setMembers([...members, newMember]);
    } catch (error) {
      setError('Failed to add member');
      console.error('Error adding member:', error);
    }
  }

  async function removeMember(id: string) {
    try {
      const response = await fetch('/api/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to remove member');
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      setError('Failed to remove member');
      console.error('Error removing member:', error);
    }
  }

  async function toggleExclude(id: string) {
    try {
      const memberToUpdate = members.find((member) => member.id === id);
      if (!memberToUpdate) return;

      // 제외 상태 토글
      const now = new Date();
      const excludedUntil = memberToUpdate.excluded
        ? null // 포함으로 전환: excludedUntil 초기화
        : new Date(now.setDate(now.getDate() + 30)); // 제외로 전환: 30일 후로 설정

      const response = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          excluded: !memberToUpdate.excluded,
          excludedUntil,
        }),
      });

      if (!response.ok) throw new Error('Failed to update member exclusion state');
      const updatedMember = await response.json();

      // 상태 업데이트
      setMembers((prev) => prev.map((member) => (member.id === id ? updatedMember : member)));
    } catch (error) {
      setError('Failed to toggle member exclusion');
      console.error('Error toggling exclusion:', error);
    }
  }

  async function setExclusion(id: string, until: Date) {
    try {
      const response = await fetch('/api/members/exclusion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, excludedUntil: until }),
      });

      if (!response.ok) throw new Error('Failed to update exclusion');

      const updatedMember = await response.json();
      setMembers((prev) => prev.map((member) => (member.id === id ? updatedMember : member)));
    } catch (error) {
      setError('Failed to update exclusion');
      console.error('Error updating exclusion:', error);
    }
  }

  return <MemberContext.Provider value={{ members, addMember, removeMember, toggleExclude, setExclusion, loading, error }}>{children}</MemberContext.Provider>;
}

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
}
