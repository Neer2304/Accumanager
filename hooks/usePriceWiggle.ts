import { useState, useEffect } from 'react';

export const usePriceWiggle = (initialPrice: number) => {
  const [displayPrice, setDisplayPrice] = useState(initialPrice);

  useEffect(() => {
    setDisplayPrice(initialPrice);
    
    // Move the price by +/- 0.01% every 2 seconds to look "Live"
    const interval = setInterval(() => {
      setDisplayPrice(current => {
        const movement = (Math.random() - 0.5) * (current * 0.0002);
        return current + movement;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [initialPrice]);

  return displayPrice;
};