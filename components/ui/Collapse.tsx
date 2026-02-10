import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

interface CollapseProps {
  in: boolean
  children: React.ReactNode
  timeout?: number
  sx?: any
}

export const Collapse: React.FC<CollapseProps> = ({
  in: open,
  children,
  timeout = 300,
  sx = {}
}) => {
  const [height, setHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (open && !mounted) {
      setMounted(true)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!mounted) return

    setAnimating(true)
    const targetHeight = open ? contentHeight : 0
    
    const animation = setTimeout(() => {
      setHeight(targetHeight)
      setAnimating(false)
      if (!open) {
        setTimeout(() => setMounted(false), timeout)
      }
    }, 10)

    return () => clearTimeout(animation)
  }, [open, contentHeight, mounted, timeout])

  const handleContentRef = (node: HTMLDivElement | null) => {
    if (node) {
      setContentHeight(node.getBoundingClientRect().height)
    }
  }

  if (!mounted && !open) return null

  return (
    <Box
      sx={{
        height: animating ? 'auto' : `${height}px`,
        overflow: 'hidden',
        transition: `height ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ...sx
      }}
    >
      <div ref={handleContentRef}>
        {children}
      </div>
    </Box>
  )
}