// app/test-follow-debug/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";

export default function TestFollowDebugPage() {
  const [username, setUsername] = useState("m_neer143");
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/community/debug?username=${username}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();
      setDebugData(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch debug data");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // In your test-follow-debug page, update testFollow function:

  const testFollow = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    console.log("=== TEST FOLLOW DEBUG ===");
    console.log("Username to follow:", username);
    console.log(
      "Constructed URL:",
      `/api/community/profile/${username}/follow`,
    );

    try {
      const response = await fetch(
        `/api/community/profile/${username}/follow`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        data = { message: "Invalid JSON response", raw: responseText };
      }

      setResult(data);

      if (!response.ok) {
        throw new Error(
          data.message || `Follow failed with status ${response.status}`,
        );
      }

      // Refresh debug data
      fetchDebugData();
    } catch (err: any) {
      console.error("Test follow error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testUnfollow = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/community/profile/${username}/follow`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();
      setResult(data);

      if (!response.ok) {
        throw new Error(data.message || "Unfollow failed");
      }

      // Refresh debug data
      fetchDebugData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Follow System Debug
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Username to test"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            onClick={fetchDebugData}
            disabled={loading}
          >
            Refresh Debug Data
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={testFollow}
            disabled={loading}
          >
            Test Follow
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={testUnfollow}
            disabled={loading}
          >
            Test Unfollow
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {loading && <CircularProgress sx={{ mb: 2 }} />}

      {/* Debug Info */}
      {debugData && debugData.success && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current State:
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Authentication:</Typography>
            <Chip
              label={
                debugData.debug.authTokenExists ? "Logged In" : "Not Logged In"
              }
              color={debugData.debug.authTokenExists ? "success" : "error"}
              sx={{ mr: 1 }}
            />
          </Box>

          {debugData.debug.currentUser && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Current User:</Typography>
              <Typography variant="body2">
                ID: {debugData.debug.currentUser._id}
                <br />
                Name: {debugData.debug.currentUser.name}
                <br />
                Email: {debugData.debug.currentUser.email}
              </Typography>
            </Box>
          )}

          {debugData.debug.currentUserProfile && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Current Community Profile:
              </Typography>
              <Typography variant="body2">
                Username: {debugData.debug.currentUserProfile.username}
                <br />
                Following: {debugData.debug.currentUserProfile.followingCount}
                <br />
                Followers: {debugData.debug.currentUserProfile.followerCount}
              </Typography>
            </Box>
          )}

          {debugData.debug.targetUserProfile && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Target User ({username}):
              </Typography>
              <Typography variant="body2">
                Username: {debugData.debug.targetUserProfile.username}
                <br />
                Following: {debugData.debug.targetUserProfile.followingCount}
                <br />
                Followers: {debugData.debug.targetUserProfile.followerCount}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">
            All Community Users (first 10):
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {debugData.debug.allCommunityUsers.map((user: any) => (
              <Chip
                key={user._id}
                label={user.username}
                variant="outlined"
                size="small"
                onClick={() => setUsername(user.username)}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Result */}
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            API Result:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflow: "auto",
            }}
          >
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
