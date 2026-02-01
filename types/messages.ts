export interface Message {
  _id: string;
  type: 'meeting_invite' | 'direct_message' | 'system_notification';
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  subject: string;
  content: string;
  meetingId?: string;
  meetingTitle?: string;
  meetingLink?: string;
  meetingTime?: string;
  meetingType?: 'internal' | 'client' | 'partner' | 'team';
  status: 'pending' | 'accepted' | 'declined' | 'read' | 'unread' | 'archived' | 'deleted';
  isStarred: boolean;
  isImportant: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}