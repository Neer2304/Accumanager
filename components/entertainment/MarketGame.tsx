"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Paper, Stack, Grid, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, ShowChart, AttachMoney, Warning } from "@mui/icons-material";

export default function MarketGame() {
  const [cash, setCash] = useState(10000);
  const [inventory, setInventory] = useState(0);
  const [price, setPrice] = useState(100);
  const [history, setHistory] = useState<number[]>(new Array(20).fill(100));
  const [news, setNews] = useState({ text: "Market Stable", type: "info" });
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulate Market Movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPrice((prevPrice) => {
        const volatility = Math.random() * 10 - 5; // Move between -5 and +5
        const newPrice = Math.max(10, prevPrice + volatility);
        
        setHistory((prev) => [...prev.slice(1), newPrice]);
        return newPrice;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Random News Events
  useEffect(() => {
    if (!isPlaying) return;

    const eventInterval = setInterval(() => {
      const events = [
        { text: "TECH BOOM: Prices Surging!", impact: 30, type: "success" },
        { text: "SUPPLY CRUNCH: Costs Rising!", impact: 15, type: "warning" },
        { text: "MARKET CRASH: Prices Dropping!", impact: -40, type: "error" },
        { text: "NEW REGULATION: Values Falling!", impact: -10, type: "error" },
      ];
      if (Math.random() > 0.7) {
        const e = events[Math.floor(Math.random() * events.length)];
        setNews({ text: e.text, type: e.type });
        setPrice((p) => Math.max(10, p + e.impact));
      }
    }, 5000);

    return () => clearInterval(eventInterval);
  }, [isPlaying]);

  const buy = () => {
    if (cash >= price) {
      setCash(cash - price);
      setInventory(inventory + 1);
    }
  };

  const sell = () => {
    if (inventory > 0) {
      setCash(cash + price);
      setInventory(inventory - 1);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", borderRadius: 4, color: "#fff" }}>
      {/* Header Stats */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="caption" color="gray">LIQUID ASSETS</Typography>
          <Typography variant="h4" fontWeight="bold" color="#4caf50">${cash.toFixed(2)}</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" color="gray">ASSETS HELD</Typography>
          <Typography variant="h4" fontWeight="bold">{inventory} Units</Typography>
        </Box>
      </Stack>

      {/* Visual Market Graph (CSS Based) */}
      <Box sx={{ height: 150, display: "flex", alignItems: "flex-end", gap: 0.5, mb: 3, bgcolor: "#1e1e1e", p: 1, borderRadius: 2 }}>
        {history.map((h, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              height: `${(h / 200) * 100}%`,
              bgcolor: h >= history[i - 1] ? "#4caf50" : "#f44336",
              borderRadius: "2px 2px 0 0",
              transition: "height 0.3s ease"
            }}
          />
        ))}
      </Box>

      {/* Live Price Tag */}
      <Paper sx={{ p: 2, mb: 3, textAlign: "center", bgcolor: "#2c2c2c", color: "#fff" }}>
        <Typography variant="h6">Current Market Price</Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {price >= history[history.length - 2] ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
          <Typography variant="h3" fontWeight="900">${price.toFixed(2)}</Typography>
        </Stack>
      </Paper>

      {/* News Feed */}
      <Chip 
        icon={<Warning />} 
        label={news.text} 
        color={news.type as any} 
        sx={{ mb: 3, width: "100%", py: 2, fontWeight: "bold" }} 
      />

      {/* Game Controls */}
      {!isPlaying ? (
        <Button fullWidth variant="contained" size="large" onClick={() => setIsPlaying(true)}>
          Enter Trading Floor
        </Button>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="success" size="large" onClick={buy} sx={{ py: 2 }}>
              BUY UNIT
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="error" size="large" onClick={sell} sx={{ py: 2 }}>
              SELL UNIT
            </Button>
          </Grid>
          <Grid item xs={12}>
             <Button fullWidth variant="text" color="inherit" onClick={() => setIsPlaying(false)}>Exit Floor</Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}