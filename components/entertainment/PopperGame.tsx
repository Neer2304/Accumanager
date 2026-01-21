'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, Paper, Stack } from '@mui/material'
import { Celebration, PlayArrow, Replay } from '@mui/icons-material'
import confetti from 'canvas-confetti'

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  label: string
}

const TASK_LABELS = ['Invoice', 'Meeting', 'Sale', 'Email', 'Stock', 'Tax']
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

export default function PopperGame() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setBubbles([])
  }

  // Handle Bubble Spawning
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Keep away from edges
        y: 100,
        size: Math.random() * 40 + 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        label: TASK_LABELS[Math.floor(Math.random() * TASK_LABELS.length)]
      }
      setBubbles((prev) => [...prev, newBubble])
    }, 800)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Handle Bubble Movement (Float Up)
  useEffect(() => {
    if (!isPlaying) return

    const moveInterval = setInterval(() => {
      setBubbles((prev) => 
        prev
          .map((b) => ({ ...b, y: b.y - 1.5 })) // Move up
          .filter((b) => b.y > -10) // Remove if off screen
      )
    }, 30)

    return () => clearInterval(moveInterval)
  }, [isPlaying])

  const popBubble = (id: number) => {
    setScore((s) => s + 1)
    setBubbles((prev) => prev.filter((b) => b.id !== id))
    // Play a tiny confetti burst on each pop
    confetti({ 
        particleCount: 10, 
        spread: 30, 
        origin: { y: 0.6 },
        colors: ['#4ECDC4', '#45B7D1']
    })
  }

  return (
    <Paper elevation={4} sx={{ 
      p: 3, 
      borderRadius: 4, 
      bgcolor: 'rgba(15, 23, 42, 0.05)', 
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Task Popper</Typography>
        <Typography variant="h5" color="primary" fontWeight="900">Score: {score}</Typography>
      </Stack>

      <Box 
        ref={gameAreaRef}
        sx={{ 
          height: 400, 
          bgcolor: '#0f172a', 
          borderRadius: 2, 
          position: 'relative', 
          cursor: 'crosshair',
          border: '4px solid #1e293b'
        }}
      >
        {!isPlaying ? (
          <Stack justifyContent="center" alignItems="center" height="100%" spacing={2}>
            <Typography color="white" variant="h5">Ready for a break?</Typography>
            <Button 
              variant="contained" 
              startIcon={<PlayArrow />} 
              onClick={startGame}
              size="large"
            >
              Start Game
            </Button>
          </Stack>
        ) : (
          bubbles.map((bubble) => (
            <Box
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              sx={{
                position: 'absolute',
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                bgcolor: bubble.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${bubble.color}`,
                transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.1)' },
                userSelect: 'none'
              }}
            >
              {bubble.label}
            </Box>
          ))
        )}
      </Box>

      {isPlaying && (
        <Button 
          sx={{ mt: 2 }} 
          color="inherit" 
          onClick={() => setIsPlaying(false)}
        >
          Quit Game
        </Button>
      )}
    </Paper>
  )
}