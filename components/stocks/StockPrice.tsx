"use client";
import { useState } from 'react';

export default function StockPrice() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrice = async (ticker: string) => {
    setLoading(true);
    try {
      // Calling YOUR internal Next.js API
      const res = await fetch(`/api/stock/${ticker}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Market Watch</h2>
      <div className="flex gap-2">
        <button 
          onClick={() => fetchPrice('AAPL')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Check Apple
        </button>
      </div>

      {loading && <p className="mt-4">Fetching real-time data...</p>}

      {data && !loading && (
        <div className="mt-4">
          <p className="text-3xl font-mono">${data.price}</p>
          <p className={data.change >= 0 ? 'text-green-500' : 'text-red-500'}>
            {data.change} ({data.percent})
          </p>
        </div>
      )}
    </div>
  );
}