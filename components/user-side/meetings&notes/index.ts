// app/components/user-side/meetings&notes/index.ts
// Barrel exports file

// Common components
export { GlassCard } from './common/GlassCard';
export { GradientButton } from './common/GradientButton';
export { MeetingStatusChip } from './common/MeetingStatusChip';
export { MeetingTypeChip } from './common/MeetingTypeChip';
export { NoteCategoryChip } from './common/NoteCategoryChip';
export { LoadingState } from './common/LoadingState';
export { ErrorState } from './common/ErrorState';
export { EmptyState } from './common/EmptyState';
export { SearchBar } from './common/SearchBar';
export { StatsCard } from './common/StatsCard';

// Main components
export { AuthCheck } from './components/AuthCheck';
export { VideoMeetingRoom } from './components/VideoMeetingRoom';

// Dialog components
export { InstantMeetingDialog } from './components/dialogs/InstantMeetingDialog';
export { MeetingInvitesPanel } from './components/dialogs/MeetingInvitesPanel';
export { InviteParticipantsDialog } from './components/dialogs/InviteParticipantsDialog';
export { ShareMeetingDialog } from './components/dialogs/ShareMeetingDialog';

// Types
export type { Meeting, Note, MeetingInvite } from './types';