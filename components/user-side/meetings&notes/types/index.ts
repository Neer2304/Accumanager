// app/components/user-side/meetings&notes/types/index.ts
export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  meetingType: 'internal' | 'client' | 'partner' | 'team';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  location?: string;
  agenda?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  hostEmail: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  isRecording: boolean;
  allowJoinBeforeHost: boolean;
  waitingRoom: boolean;
  autoRecord: boolean;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: 'meeting' | 'project' | 'personal' | 'ideas' | 'todo';
  tags: string[];
  isPinned: boolean;
  meetingId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  attachments?: string[];
  color?: string;
  isEncrypted: boolean;
}

export interface MeetingInvite {
  _id: string;
  meetingId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  receiverEmail: string;
  meetingTitle: string;
  meetingLink: string;
  meetingTime: Date;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}