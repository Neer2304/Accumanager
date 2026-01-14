export const getEventTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    marriage: "#ff6b6b",
    business: "#4ecdc4",
    personal: "#45b7d1",
    travel: "#96ceb4",
    festival: "#feca57",
    other: "#778ca3",
  };
  return colors[type] || "#778ca3";
};

export const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    planning: "#ff9f43",
    active: "#2ecc71",
    completed: "#3498db",
    cancelled: "#e74c3c",
    'in-progress': "#3498db",
  };
  return colors[status] || "#95a5a6";
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN");
};

export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString()}`;
};

export const getEventAvatar = (type: string) => {
  const avatars: { [key: string]: string } = {
    marriage: "👰",
    business: "💼",
    personal: "🎉",
    travel: "✈️",
    festival: "🎊",
    other: "📅",
  };
  return avatars[type] || "📅";
};

export const calculateBudgetPercentage = (spent: number, budget: number) => {
  return budget > 0 ? Math.round((spent / budget) * 100) : 0;
};