// components/googleleads/hooks/useMembers.ts
import { useState, useEffect, useCallback } from 'react';
import { Member } from '../types';
import { companyService } from '@/services/companyService';

export function useMembers(companyId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      const res = await companyService.getMembers(companyId);
      if (res.success) {
        // Transform members to include user object with name
        const formattedMembers = (res.members || []).map((member: any) => ({
          memberId: member.memberId,
          userId: member.memberId, // The memberId is the userId
          user: {
            _id: member.memberId,
            name: member.memberName,
            email: member.memberEmail,
            avatar: member.memberAvatar
          },
          role: member.role,
          status: member.status
        }));
        
        // Filter only active members
        const activeMembers = formattedMembers.filter((m: Member) => m.status === 'active');
        setMembers(activeMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers
  };
}