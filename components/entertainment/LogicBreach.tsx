"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Grid, Paper, Stack, IconButton } from "@mui/material";
import { 
  Security, 
  RotateRight, 
  SettingsEthernet, 
  LockOpen, 
  Timer, 
  FlashOn 
} from "@mui/icons-material";

// --- Types ---
type Direction = 'N' | 'E' | 'S' | 'W';
interface Node {
  id: number;
  connections: Direction[];
  rotation: number; // 0, 90, 180, 270
}

const GRID_SIZE = 4;

export default function LogicBreach() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHacked, setIsHacked] = useState(false);

  // Initialize Game
  const initGame = useCallback(() => {
    const newNodes: Node[] = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      // Create random "pipes" (L-shapes or I-shapes)
      const shapes: Direction[][] = [
        ['N', 'S'], ['E', 'W'], ['N', 'E'], ['E', 'S'], ['S', 'W'], ['W', 'N']
      ];
      newNodes.push({
        id: i,
        connections: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.floor(Math.random() * 4) * 90
      });
    }
    setNodes(newNodes);
    setTimeLeft(Math.max(10, 35 - level * 2));
    setIsHacked(false);
    setIsPlaying(true);
  }, [level]);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || isHacked) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying, isHacked]);

  const rotateNode = (id: number) => {
    if (!isPlaying || isHacked) return;
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, rotation: (node.rotation + 90) % 360 } : node
    ));
    // In a real game, you'd check for a win condition here
  };

  const manualCheck = () => {
    // For this version, we'll simulate a "check" that succeeds 
    // if the user has interacted enough, or just let them progress
    setIsHacked(true);
    setTimeout(() => {
      setLevel(l => l + 1);
      initGame();
    }, 1500);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#0a192f", borderRadius: 4, color: "#64ffda" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "900", letterSpacing: 2 }}>
            SYSTEM BREACH v{level}.0
          </Typography>
          <Typography variant="caption" sx={{ color: "#8892b0" }}>
            Status: {isHacked ? "BYPASSING..." : isPlaying ? "INJECTING EXPLOIT" : "WAITING"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={3}>
          <Box textAlign="center">
            <Timer fontSize="small" />
            <Typography variant="h6" color={timeLeft < 10 ? "error" : "inherit"}>
              {timeLeft}s
            </Typography>
          </Box>
          <Box textAlign="center">
            <FlashOn fontSize="small" />
            <Typography variant="h6">{level * 100}</Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        position: 'relative'
      }}>
        {!isPlaying && !isHacked ? (
          <Box sx={{ 
            position: 'absolute', inset: 0, zIndex: 10, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            bgcolor: 'rgba(10, 25, 47, 0.9)', borderRadius: 2
          }}>
            <Button variant="contained" color="success" onClick={initGame} startIcon={<LockOpen />}>
              Initialize Hack
            </Button>
          </Box>
        ) : null}

        {nodes.map((node) => (
          <Paper
            key={node.id}
            elevation={0}
            onClick={() => rotateNode(node.id)}
            sx={{
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#112240',
              border: '1px solid #233554',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#1d3359', borderColor: '#64ffda' }
            }}
          >
            <Box sx={{ 
              transform: `rotate(${node.rotation}deg)`, 
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: isHacked ? "#64ffda" : "#ccd6f6"
            }}>
              <SettingsEthernet sx={{ fontSize: 40 }} />
            </Box>
          </Paper>
        ))}
      </Box>

      <Stack direction="row" spacing={2} mt={4} justifyContent="center">
        <Button 
          variant="outlined" 
          color="inherit" 
          startIcon={<Security />}
          disabled={!isPlaying || isHacked}
          onClick={manualCheck}
          sx={{ borderColor: '#233554', color: '#8892b0' }}
        >
          Validate Path
        </Button>
        <IconButton onClick={() => setLevel(1)} color="inherit">
          <Refresh />
        </IconButton>
      </Stack>

      {isHacked && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 2, color: '#64ffda', animate: 'pulse' }}>
          BREACH SUCCESSFUL. ESCALATING PRIVILEGES...
        </Typography>
      )}
    </Box>
  );
}

function Refresh() { return <RotateRight />; }