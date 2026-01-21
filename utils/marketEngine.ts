export const MARKET_STOCKS = [
  { symbol: 'ACCU', name: 'AccuTech Systems', basePrice: 150, volatility: 0.02 },
  { symbol: 'MGMT', name: 'Management Pro', basePrice: 2400, volatility: 0.05 },
  { symbol: 'RETL', name: 'Retail Dynamics', basePrice: 85, volatility: 0.01 },
  { symbol: 'DATA', name: 'DataCloud Inc', basePrice: 420, volatility: 0.03 },
];

// Helper to calculate price movement
export const getNextPrice = (currentPrice: number, volatility: number) => {
  const changePercent = 2 * volatility * Math.random();
  let changeAmount = currentPrice * changePercent;
  if (Math.random() < 0.5) changeAmount *= -1;
  return Math.max(1, currentPrice + changeAmount);
};