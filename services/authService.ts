// services/authService.ts
export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  },

  async register(userData: any) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  },

  async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  },

  async googleLogin(payload: {
    email: string;
    name: string;
    image?: string;
    googleId: string;
  }) {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google Login failed");
    }

    return response.json();
  },

  // Add this inside the authService object in services/authService.ts
  async githubLogin(payload: {
    email: string;
    name: string;
    image?: string;
    githubId: string;
  }) {
    const response = await fetch("/api/auth/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Essential for setting the auth_token cookie
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "GitHub Login failed");
    }

    return response.json();
  },
  // NEW: Check authentication status
  async checkAuth() {
    const response = await fetch("/api/auth/me", {
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      throw new Error("Auth check failed");
    }

    return response.json();
  },
};
