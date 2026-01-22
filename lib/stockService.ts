import axios from 'axios';

const API_KEY = 'MXBYKHRWDB3QOKIY';
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchAlphaPrice = async (symbol: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    const data = response.data["Global Quote"];
    
    // Check if we hit the rate limit (Alpha Vantage sends a 'Note' instead of an error)
    if (response.data["Note"]) {
      console.warn("API Rate Limit Hit!");
      return null;
    }

    return {
      price: parseFloat(data["05. price"]),
      change: data["09. change"],
      percent: data["10. change percent"]
    };
  } catch (error) {
    console.error("Alpha Vantage Error:", error);
    return null;
  }
};