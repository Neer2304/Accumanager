export async function getStockPrice(symbol: string) {
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Check if Alpha Vantage sent a "Note" (Rate Limit) instead of data
    if (data["Note"] || !data["Global Quote"]) {
      console.error("API Limit reached or Symbol not found");
      return null; 
    }

    const quote = data["Global Quote"];
    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]).toFixed(2),
      change: parseFloat(quote["09. change"]).toFixed(2),
      percent: quote["10. change percent"],
    };
  } catch (err) {
    return null;
  }
}