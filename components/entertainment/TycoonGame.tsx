"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Card,
  Stack,
  Paper,
  Alert,
  Fade,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Terminal,
  AttachMoney,
  PlayArrow,
  Pause,
  Refresh,
  BugReport,
  Campaign,
} from "@mui/icons-material";

// --- Types ---
interface GameState {
  day: number;
  cash: number;
  employees: number;
  customers: number;
  techDebt: number;
  isPaused: boolean;
  gameOver: boolean;
}

interface GameEvent {
  title: string;
  msg: string;
  type: "error" | "success" | "info";
}

export default function TycoonGame() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    cash: 5000,
    employees: 2,
    customers: 10,
    techDebt: 5,
    isPaused: true,
    gameOver: false,
  });

  const [logs, setLogs] = useState<string[]>(["System Initialized. Press Play to begin startup..."]);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);

  // --- Helpers ---
  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 8));
  }, []);

  // --- Chaos Engine (Random Events) ---
  const triggerRandomEvent = useCallback(() => {
    const events = [
      {
        title: "Critical Bug!",
        msg: "Legacy code failed. Lost $500 in emergency repairs.",
        type: "error" as const,
        action: (s: GameState) => ({ ...s, cash: s.cash - 500, techDebt: s.techDebt + 10 }),
      },
      {
        title: "Viral Tweet",
        msg: "A tech influencer praised your UI! +25 customers.",
        type: "success" as const,
        action: (s: GameState) => ({ ...s, customers: s.customers + 25 }),
      },
      {
        title: "Competitor Poaching",
        msg: "A senior dev left for Google. -1 Employee.",
        type: "error" as const,
        action: (s: GameState) => ({ ...s, employees: Math.max(1, s.employees - 1) }),
      },
      {
        title: "Optimization Win",
        msg: "Engineers found a shortcut. Tech Debt reduced.",
        type: "info" as const,
        action: (s: GameState) => ({ ...s, techDebt: Math.max(0, s.techDebt - 15) }),
      },
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    setActiveEvent(event);
    setGameState((prev) => event.action(prev));
    addLog(`ALERT: ${event.title}`);

    setTimeout(() => setActiveEvent(null), 6000);
  }, [addLog]);

  // --- Core Game Loop ---
  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;

    const tick = setInterval(() => {
      setGameState((prev) => {
        // Financials
        const dailyRevenue = prev.customers * 45;
        const dailyExpenses = prev.employees * 120 + prev.techDebt * 5;
        const nextCash = prev.cash + dailyRevenue - dailyExpenses;

        // System Decay
        const nextTechDebt = prev.techDebt + 0.8;

        // Bankruptcy Check
        if (nextCash <= 0) {
          addLog("CRITICAL: Cash reserves depleted. Company liquidated.");
          return { ...prev, cash: 0, gameOver: true, isPaused: true };
        }

        // Random Event Trigger (Approx 10% chance per tick)
        if (Math.random() > 0.9) {
          setTimeout(triggerRandomEvent, 100);
        }

        return {
          ...prev,
          day: prev.day + 1,
          cash: nextCash,
          techDebt: nextTechDebt,
        };
      });
    }, 2500); // 1 Tick = 2.5 Seconds

    return () => clearInterval(tick);
  }, [gameState.isPaused, gameState.gameOver, triggerRandomEvent, addLog]);

  // --- Manual Actions ---
  const handleMarketing = () => {
    if (gameState.cash < 400) return;
    setGameState(s => ({ ...s, cash: s.cash - 400, customers: s.customers + 12 }));
    addLog("Action: Marketing Campaign launched (-$400)");
  };

  const handleHire = () => {
    if (gameState.cash < 800) return;
    setGameState(s => ({ ...s, cash: s.cash - 800, employees: s.employees + 1 }));
    addLog("Action: New Engineer onboarded (-$800)");
  };

  const handleRefactor = () => {
    if (gameState.cash < 300) return;
    setGameState(s => ({ ...s, cash: s.cash - 300, techDebt: Math.max(0, s.techDebt - 20) }));
    addLog("Action: Code Refactor completed (-$300)");
  };

  const resetGame = () => {
    setGameState({
      day: 1,
      cash: 5000,
      employees: 2,
      customers: 10,
      techDebt: 5,
      isPaused: true,
      gameOver: false,
    });
    setLogs(["System Rebooted..."]);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, bgcolor: "#020617", borderRadius: 4, minHeight: "500px", color: "#f8fafc" }}>
      
      {/* Top HUD */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <MetricCard icon={<AttachMoney sx={{ color: "#22c55e" }} />} label="Cash Balance" value={`$${Math.floor(gameState.cash)}`} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard icon={<People sx={{ color: "#3b82f6" }} />} label="Engineering Team" value={gameState.employees} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard icon={<TrendingUp sx={{ color: "#a855f7" }} />} label="Active Clients" value={gameState.customers} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard icon={<Terminal sx={{ color: "#64748b" }} />} label="Fiscal Day" value={gameState.day} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Operation Center */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, bgcolor: "#0f172a", borderColor: "#1e293b", color: "white" }}>
            
            {activeEvent && (
              <Fade in>
                <Alert severity={activeEvent.type} sx={{ mb: 3, fontWeight: "bold" }}>
                  {activeEvent.title}: {activeEvent.msg}
                </Alert>
              </Fade>
            )}

            <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <BugReport /> System Stability
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="gray">Technical Debt (Lower is better)</Typography>
                <Typography variant="body2" fontWeight="bold" color={gameState.techDebt > 60 ? "#ef4444" : "#f8fafc"}>
                  {Math.floor(gameState.techDebt)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(gameState.techDebt, 100)} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6, 
                  bgcolor: "#1e293b",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: gameState.techDebt > 60 ? "#ef4444" : "#3b82f6"
                  }
                }}
              />
            </Box>

            <Typography variant="body2" color="gray" mb={2}>Strategic Controls</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button fullWidth variant="contained" startIcon={<Campaign />} onClick={handleMarketing} disabled={gameState.isPaused || gameState.gameOver}>
                  Ads (-$400)
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth variant="contained" color="secondary" startIcon={<People />} onClick={handleHire} disabled={gameState.isPaused || gameState.gameOver}>
                  Hire (-$800)
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth variant="outlined" color="info" startIcon={<Refresh />} onClick={handleRefactor} disabled={gameState.isPaused || gameState.gameOver}>
                  Refactor (-$300)
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Command Terminal */}
        <Grid item xs={12} md={5}>
          <Box sx={{ 
            bgcolor: "#000", 
            p: 2, 
            borderRadius: 2, 
            height: "100%", 
            border: "1px solid #1e293b",
            fontFamily: "monospace",
            display: "flex",
            flexDirection: "column"
          }}>
            <Typography variant="caption" sx={{ color: "#22c55e", mb: 1, display: "block" }}>
              LIVE_LOGS_STREAM:
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {logs.map((log, i) => (
                <Typography key={i} variant="caption" sx={{ display: "block", color: i === 0 ? "#f8fafc" : "#64748b", mb: 0.5 }}>
                  {log}
                </Typography>
              ))}
            </Box>
            
            <Divider sx={{ my: 2, bgcolor: "#1e293b" }} />
            
            <Stack direction="row" spacing={2}>
              {gameState.gameOver ? (
                <Button fullWidth variant="contained" color="error" onClick={resetGame}>Restart Company</Button>
              ) : (
                <Button 
                  fullWidth 
                  variant={gameState.isPaused ? "contained" : "outlined"} 
                  color={gameState.isPaused ? "success" : "inherit"}
                  startIcon={gameState.isPaused ? <PlayArrow /> : <Pause />}
                  onClick={() => setGameState(s => ({ ...s, isPaused: !s.isPaused }))}
                >
                  {gameState.isPaused ? "Launch Operation" : "Pause Session"}
                </Button>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: "#0f172a", borderColor: "#1e293b", color: "white" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ p: 1, bgcolor: "#1e293b", borderRadius: 2 }}>{icon}</Box>
        <Box>
          <Typography variant="caption" color="gray" display="block">{label}</Typography>
          <Typography variant="h6" fontWeight="bold">{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}