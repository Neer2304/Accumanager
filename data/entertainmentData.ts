export const DAILY_INSIGHTS = [
  {
    type: 'joke',
    content: "Why did the entrepreneur cross the road? To disrupt the other side.",
    author: "Business Humor"
  },
  {
    type: 'zen',
    content: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    type: 'fact',
    content: "The first product ever scanned with a barcode was a pack of Wrigley's chewing gum in 1974.",
    author: "Historical Fact"
  }
];

export const getDailySpark = () => {
  // Returns a random item based on the current date
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length];
};