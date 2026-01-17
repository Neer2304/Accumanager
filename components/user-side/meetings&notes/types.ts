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

export interface MeetingFormData {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  meetingType: 'internal' | 'client' | 'partner' | 'team';
  location?: string;
  agenda?: string[];
  notes?: string;
  allowJoinBeforeHost: boolean;
  waitingRoom: boolean;
  autoRecord: boolean;
  isRecording: boolean;
}

export interface NoteFormData {
  title: string;
  content: string;
  category: 'meeting' | 'project' | 'personal' | 'ideas' | 'todo';
  tags: string[];
  isPinned: boolean;
  meetingId?: string;
  isEncrypted: boolean;
  color?: string;
}

export interface MeetingStats {
  ongoingMeetings: number;
  upcomingMeetings: number;
  totalParticipants: number;
  meetingHours: number;
}