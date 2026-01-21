"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  Alert,
  Divider,
  Button,
  alpha,
  Stack,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  Security,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Common Components
import { PrimaryButton } from "@/components/common";
import { Icons } from "@/components/common/icons";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface UserLoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  error?: string;
  onClearError: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({
  onSubmit,
  loading,
  error,
  onClearError,
  onForgotPassword,
  onRegister,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleRedirect = () => router.push("/google-login");
  const handleGithubRedirect = () => router.push("/github-login");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={onClearError}
          variant="outlined"
        >
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        {...register("email")}
        fullWidth
        label="Email Address"
        variant="outlined"
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        {...register("password")}
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Forgot Password Link */}
      <Box textAlign="right" mb={3}>
        <Link
          component="button"
          type="button"
          onClick={onForgotPassword}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            textDecoration: "none",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Forgot your password?
        </Link>
      </Box>

      {/* Submit Button */}
      <PrimaryButton
        type="submit"
        fullWidth
        loading={loading}
        endIcon={<ArrowForward />}
        sx={{
          py: 1.5,
          mb: 3,
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: 2,
        }}
      >
        Sign In to Dashboard
      </PrimaryButton>

      {/* Divider */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 2, fontWeight: 600, fontSize: "0.75rem", letterSpacing: 1 }}
        >
          OR CONTINUE WITH
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Social Login Buttons */}
      <Stack direction="row" spacing={2} mb={4}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleRedirect}
          sx={{
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "#DB4437",
            borderColor: alpha("#DB4437", 0.3),
            "&:hover": {
              borderColor: "#DB4437",
              bgcolor: alpha("#DB4437", 0.04),
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}
        >
          Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<GitHubIcon />}
          onClick={handleGithubRedirect}
          sx={{
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#24292e",
            color: "white",
            "&:hover": {
              bgcolor: "#1b1f23",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
            transition: "all 0.2s",
          }}
        >
          GitHub
        </Button>
      </Stack>

      {/* Sign Up Link */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Link
            component="button"
            type="button"
            onClick={onRegister}
            sx={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Start Free Trial
          </Link>
        </Typography>
      </Box>

      {/* Security Note */}
      <Box sx={{ pt: 2, borderTop: 1, borderColor: alpha("#000", 0.05) }}>
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
          <Security sx={{ fontSize: "0.85rem", color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Secure 256-bit SSL Encrypted Access
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserLoginForm;