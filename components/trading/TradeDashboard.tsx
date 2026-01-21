"use client";

import React, { useState, useEffect } from "react";
import { Box, Alert, Snackbar, Container } from "@mui/material";
import axios from 'axios';
import Watchlist from "./Watchlist";
import StockChart from "./StockChart";
import OrderPanel from "./OrderPanel";
import PortfolioSummary from "./PortfolioSummary";

export default function TradeDashboard() {
  const [balance, setBalance] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState('BTC');
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({
    'BTC': 65000, 'ETH': 3400, 'SOL': 140, 'ADA': 0.45
  });
  
  const [msg, setMsg] = useState({ open: false, text: "", type: "success" as any });

  // Sync Logic (Same as before)
  useEffect(() => {
    const syncData = async () => {
      const localBal = localStorage.getItem('trade_bal');
      if (localBal) setBalance(parseFloat(localBal));
      try {
        const res = await axios.get('/api/trading/account');
        if (res.data) {
          setBalance(res.data.balance);
          setPortfolio(res.data.portfolio);
          localStorage.setItem('trade_bal', res.data.balance.toString());
        }
      } catch (e) { console.error("Fetch failed", e); }
    };
    syncData();
  }, []);

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, // Smaller padding on mobile
      bgcolor: '#0b0e11', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: { xs: 'column', lg: 'row' }, // Stack on tablets/phones, Row on large screens
      gap: { xs: 2, md: 3 },
      alignItems: 'stretch'
    }}>
      {/* Left Sidebar: Portfolio & Watchlist */}
      <Box sx={{ 
        flex: { lg: '0 0 320px', xl: '0 0 380px' }, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        order: { xs: 2, lg: 1 } // Move below chart on mobile
      }}>
        <PortfolioSummary balance={balance} portfolio={portfolio} onDeposit={() => {}} />
        <Watchlist prices={marketPrices} selected={selectedStock} onSelect={setSelectedStock} />
      </Box>

      {/* Main Content: Chart */}
      <Box sx={{ 
        flex: '1 1 auto', 
        minWidth: 0,
        order: { xs: 1, lg: 2 }, // Top priority on mobile
        height: { xs: '400px', md: '600px', lg: 'auto' } // Fixed height on mobile so it doesn't vanish
      }}>
        <StockChart symbol={selectedStock} currentPrice={marketPrices[selectedStock]} />
      </Box>

      {/* Right Sidebar: Trading Panel */}
      <Box sx={{ 
        flex: { lg: '0 0 320px', xl: '0 0 350px' },
        order: { xs: 3, lg: 3 } 
      }}>
        <OrderPanel 
          symbol={selectedStock} 
          price={marketPrices[selectedStock]} 
          balance={balance} 
          onTrade={async () => {}} 
        />
      </Box>

      <Snackbar open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}>
        <Alert severity={msg.type} variant="filled">{msg.text}</Alert>
      </Snackbar>
    </Box>
  );
}