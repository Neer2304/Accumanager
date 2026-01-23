// components/live-activity/utils.ts
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'success';
    case 'offline': return 'default';
    case 'meeting': return 'primary';
    case 'break': return 'warning';
    case 'focus': return 'info';
    case 'away': return 'secondary';
    default: return 'default';
  }
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString();
};

export const calculateProductivityColor = (productivity: number) => {
  if (productivity > 80) return "success";
  if (productivity > 60) return "warning";
  return "error";
};