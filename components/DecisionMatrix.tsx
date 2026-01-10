// app/components/DecisionMatrix.tsx
"use client";

import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Slider, RadioGroup, FormControlLabel,
  Radio, Alert
} from '@mui/material';
import { ThumbUp, ThumbDown, Balance, Groups } from '@mui/icons-material';

interface DecisionOption {
  id: string;
  title: string;
  description: string;
  impact: number;
  effort: number;
  risk: number;
  votes: number;
  score: number;
}

function CollaborativeDecisionMatrix() {
  const [options, setOptions] = useState<DecisionOption[]>([]);
  const [newOption, setNewOption] = useState({ title: '', description: '' });
  const [voting, setVoting] = useState(false);

  const addOption = () => {
    if (newOption.title.trim()) {
      const option: DecisionOption = {
        id: Date.now().toString(),
        title: newOption.title,
        description: newOption.description,
        impact: 5,
        effort: 5,
        risk: 5,
        votes: 0,
        score: 0
      };
      setOptions(prev => [...prev, option]);
      setNewOption({ title: '', description: '' });
    }
  };

  const calculateScore = (option: DecisionOption) => {
    return ((option.impact * 3) - (option.effort * 2) - (option.risk * 1)) + (option.votes * 2);
  };

  const voteForOption = (optionId: string) => {
    setOptions(prev => prev.map(opt => 
      opt.id === optionId 
        ? { ...opt, votes: opt.votes + 1, score: calculateScore({ ...opt, votes: opt.votes + 1 }) }
        : opt
    ));
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Balance color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            Collaborative Decision Matrix
          </Typography>
        </Box>

        {/* Add New Option */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Add Decision Option</Typography>
            <Stack spacing={2}>
              <TextField
                label="Option Title"
                value={newOption.title}
                onChange={(e) => setNewOption(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Description"
                value={newOption.description}
                onChange={(e) => setNewOption(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
                fullWidth
              />
              <Button variant="contained" onClick={addOption}>
                Add Option
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Decision Matrix Table */}
        {options.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Option</TableCell>
                  <TableCell align="center">Impact</TableCell>
                  <TableCell align="center">Effort</TableCell>
                  <TableCell align="center">Risk</TableCell>
                  <TableCell align="center">Votes</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="bold">{option.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Slider
                        size="small"
                        value={option.impact}
                        onChange={(_, value) => setOptions(prev => 
                          prev.map(opt => opt.id === option.id 
                            ? { ...opt, impact: value as number, score: calculateScore({ ...opt, impact: value as number }) }
                            : opt
                          )
                        )}
                        min={1}
                        max={10}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Slider
                        size="small"
                        value={option.effort}
                        onChange={(_, value) => setOptions(prev => 
                          prev.map(opt => opt.id === option.id 
                            ? { ...opt, effort: value as number, score: calculateScore({ ...opt, effort: value as number }) }
                            : opt
                          )
                        )}
                        min={1}
                        max={10}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Slider
                        size="small"
                        value={option.risk}
                        onChange={(_, value) => setOptions(prev => 
                          prev.map(opt => opt.id === option.id 
                            ? { ...opt, risk: value as number, score: calculateScore({ ...opt, risk: value as number }) }
                            : opt
                          )
                        )}
                        min={1}
                        max={10}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={option.votes} color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={option.score} 
                        color={
                          option.score > 20 ? "success" :
                          option.score > 10 ? "warning" : "error"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        startIcon={<ThumbUp />}
                        onClick={() => voteForOption(option.id)}
                        variant="outlined"
                        size="small"
                      >
                        Vote
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Voting Interface */}
        {options.length > 0 && (
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups />
                Team Voting
              </Typography>
              <RadioGroup>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{option.title}</Typography>
                        <Chip label={`Score: ${option.score}`} size="small" />
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
              <Button variant="contained" sx={{ mt: 2 }}>
                Submit Vote
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}