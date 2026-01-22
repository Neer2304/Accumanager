"use client";
import { useState } from 'react';

export default function WatchDashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [stock, setStock] = useState<any>(null);
  const [error, setError] = useState(false);

  const fetchStock = async () => {
    setError(false);
    const res = await fetch(`/api/stock/${ticker}`);
    if (!res.ok) {
      setError(true);
      return;
    }
    const data = await res.json();
    setStock(data);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-12 bg-[#111] p-2 rounded-2xl border border-white/5 shadow-2xl">
        <input 
          className="bg-transparent px-4 py-2 outline-none font-mono text-sm w-40"
          placeholder="SYMBOL..."
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <button onClick={fetchStock} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-xs hover:bg-gray-200">
          WATCH
        </button>
      </div>

      {/* Main Display */}
      {error ? (
        <div className="text-red-500 font-mono text-sm animate-pulse">
          !! API_LIMIT_REACHED_OR_INVALID_SYMBOL !!
        </div>
      ) : stock ? (
        <div className="text-center">
          <h1 className="text-8xl font-black tracking-tighter mb-2">{stock.symbol}</h1>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-mono text-gray-400">${stock.price}</span>
            <span className={`mt-4 px-4 py-1 rounded-full text-xs font-bold ${parseFloat(stock.change) >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {stock.change} ({stock.percent})
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 font-mono uppercase text-[10px] tracking-[0.5em]">Enter ticker to begin</p>
      )}
    </div>
  );
}