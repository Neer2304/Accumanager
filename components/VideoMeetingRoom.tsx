// components/VideoMeetingRoom.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  CallEnd as CallEndIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface VideoMeetingRoomProps {
  open: boolean;
  onClose: () => void;
  meetingTitle: string;
}

export default function VideoMeetingRoom({ open, onClose, meetingTitle }: VideoMeetingRoomProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState(['You']); // Demo participants
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera and microphone
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera and microphone. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        
        // Handle when user stops screen share
        screenStream.getTracks()[0].onended = () => {
          setIsScreenSharing(false);
          startCamera();
        };
        
        setIsScreenSharing(true);
      } else {
        // Stop screen share and return to camera
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
        setIsScreenSharing(false);
        startCamera();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const leaveMeeting = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={leaveMeeting}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: '90vh',
          maxHeight: '800px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">
          {meetingTitle}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Main Video Area */}
        <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
          {/* Video Container */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Paper
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
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
                  transform: 'scaleX(-1)', // Mirror effect like real video apps
                }}
              />
              
              {/* User name overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }}
              >
                You {!isVideoOn && '• Camera Off'} {!isAudioOn && '• Mic Off'}
              </Box>
            </Paper>
          </Box>

          {/* Participants Sidebar */}
          <Card sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon />
                Participants ({participants.length})
              </Typography>
              <Stack spacing={1}>
                {participants.map((participant, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: index === 0 ? 'action.hover' : 'transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? 'success.main' : 'grey.500',
                      }}
                    />
                    <Typography variant="body2">
                      {participant}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Controls */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            {/* Video Toggle */}
            <IconButton
              onClick={toggleVideo}
              sx={{
                backgroundColor: isVideoOn ? 'grey.300' : 'error.main',
                color: isVideoOn ? 'text.primary' : 'white',
                '&:hover': {
                  backgroundColor: isVideoOn ? 'grey.400' : 'error.dark',
                },
              }}
              size="large"
            >
              {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            {/* Audio Toggle */}
            <IconButton
              onClick={toggleAudio}
              sx={{
                backgroundColor: isAudioOn ? 'grey.300' : 'error.main',
                color: isAudioOn ? 'text.primary' : 'white',
                '&:hover': {
                  backgroundColor: isAudioOn ? 'grey.400' : 'error.dark',
                },
              }}
              size="large"
            >
              {isAudioOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {/* Screen Share */}
            <IconButton
              onClick={toggleScreenShare}
              sx={{
                backgroundColor: isScreenSharing ? 'primary.main' : 'grey.300',
                color: isScreenSharing ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isScreenSharing ? 'primary.dark' : 'grey.400',
                },
              }}
              size="large"
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>

            {/* Leave Call */}
            <Button
              variant="contained"
              color="error"
              startIcon={<CallEndIcon />}
              onClick={leaveMeeting}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 8,
              }}
            >
              Leave
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}