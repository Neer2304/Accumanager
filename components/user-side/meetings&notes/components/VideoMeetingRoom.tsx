// app/components/user-side/meetings&notes/components/VideoMeetingRoom.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Chip,
  Avatar,
  TextField,
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
  People,
  Share,
  PersonAdd,
  Chat as ChatIcon,
  Send,
  Close,
  RecordVoiceOver,
  Info,
} from '@mui/icons-material';
import type { Meeting } from '../types';

interface VideoMeetingRoomProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
  onShareMeeting: (meetingLink: string) => void;
  onEndMeeting: (meeting: Meeting) => void;
  onInviteParticipants: () => void;
}

export function VideoMeetingRoom({
  meeting,
  open,
  onClose,
  onShareMeeting,
  onEndMeeting,
  onInviteParticipants,
}: VideoMeetingRoomProps) {
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const participants = [
    { id: 1, name: 'You', email: 'you@example.com', video: videoOn, audio: audioOn },
    { id: 2, name: 'John Doe', email: 'john@example.com', video: true, audio: true },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', video: true, audio: false },
  ];

  const chatMessages = [
    { id: 1, sender: 'System', message: 'Welcome to the meeting!', time: '10:00 AM' },
    { id: 2, sender: 'John Doe', message: 'Hello everyone!', time: '10:01 AM' },
    { id: 3, sender: 'You', message: 'Good morning!', time: '10:02 AM' },
  ];

  useEffect(() => {
    if (open) {
      // Initialize video stream
      const initVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };
      initVideo();
    }

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [open]);

  const toggleVideo = () => setVideoOn(!videoOn);
  const toggleAudio = () => setAudioOn(!audioOn);
  const toggleScreenShare = () => setScreenSharing(!screenSharing);
  const toggleRecording = () => setRecording(!recording);

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      // Send message logic
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  if (!meeting) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          color: 'white',
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {meeting.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Share meeting">
              <IconButton onClick={() => onShareMeeting(meeting.meetingLink || '')} sx={{ color: 'white' }}>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Invite participants">
              <IconButton onClick={onInviteParticipants} sx={{ color: 'white' }}>
                <PersonAdd />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CallEnd />}
              onClick={() => onEndMeeting(meeting)}
              sx={{ color: 'white', borderColor: 'error.main' }}
            >
              End Meeting
            </Button>
          </Stack>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
          {/* Main Video Area */}
          <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <Paper
              sx={{
                flex: 1,
                bgcolor: 'black',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                }}
              />
              {recording && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'error.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                  <Typography variant="caption">RECORDING</Typography>
                </Box>
              )}
            </Paper>

            {/* Controls */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Tooltip title={videoOn ? "Turn off camera" : "Turn on camera"}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: videoOn ? 'primary.main' : 'error.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                  }}
                >
                  {videoOn ? <Videocam /> : <VideocamOff />}
                </IconButton>
              </Tooltip>

              <Tooltip title={audioOn ? "Mute microphone" : "Unmute microphone"}>
                <IconButton
                  onClick={toggleAudio}
                  sx={{
                    bgcolor: audioOn ? 'primary.main' : 'error.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                  }}
                >
                  {audioOn ? <Mic /> : <MicOff />}
                </IconButton>
              </Tooltip>

              <Tooltip title={screenSharing ? "Stop sharing" : "Share screen"}>
                <IconButton
                  onClick={toggleScreenShare}
                  sx={{
                    bgcolor: screenSharing ? 'warning.main' : 'primary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                  }}
                >
                  {screenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
              </Tooltip>

              <Tooltip title={recording ? "Stop recording" : "Start recording"}>
                <IconButton
                  onClick={toggleRecording}
                  sx={{
                    bgcolor: recording ? 'error.main' : 'primary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                  }}
                >
                  <RecordVoiceOver />
                </IconButton>
              </Tooltip>

              <Tooltip title={showChat ? "Hide chat" : "Show chat"}>
                <IconButton
                  onClick={() => setShowChat(!showChat)}
                  sx={{
                    bgcolor: showChat ? 'primary.main' : 'transparent',
                    color: 'white',
                    width: 56,
                    height: 56,
                    border: 1,
                    borderColor: 'primary.main',
                  }}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                color="error"
                startIcon={<CallEnd />}
                onClick={onClose}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                Leave
              </Button>
            </Box>
          </Box>

          {/* Side Panel */}
          <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Participants */}
            <Paper sx={{ flex: 1, bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People />
                  Participants ({participants.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Stack spacing={2}>
                  {participants.map(participant => (
                    <Box
                      key={participant.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: participant.id === 1 ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {participant.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {participant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {participant.email}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: participant.video ? 'success.main' : 'error.main' }}>
                          {participant.video ? <Videocam fontSize="small" /> : <VideocamOff fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" sx={{ color: participant.audio ? 'success.main' : 'error.main' }}>
                          {participant.audio ? <Mic fontSize="small" /> : <MicOff fontSize="small" />}
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Meeting Info */}
            <Paper sx={{ bgcolor: '#1e293b', borderRadius: 2 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Info />
                  Meeting Info
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Meeting ID:</strong> {meeting._id?.substring(0, 8)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {meeting.startTime} - {meeting.endTime}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Participants:</strong> {meeting.participants.length}
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Chat Panel */}
        {showChat && (
          <Paper sx={{ height: 300, bgcolor: '#1e293b', borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Chat
              </Typography>
              <IconButton size="small" onClick={() => setShowChat(false)}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ height: 200, overflow: 'auto', p: 2 }}>
              <Stack spacing={1}>
                {chatMessages.map(msg => (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: msg.sender === 'You' ? 'primary.main' : '#334155',
                        color: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                        {msg.sender} • {msg.time}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {msg.message}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Type a message..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#475569' },
                    },
                  }}
                />
                <IconButton onClick={handleSendChatMessage} sx={{ color: 'primary.main' }}>
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
}