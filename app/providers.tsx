// app/providers.tsx (updated)
"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store/store";
import { queryClient } from "@/lib/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/authContext";
import { VisitorTracker } from "@/components/visitors/VisitorTracker"; // Optional component
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { StoreProvider } from "@/store/StoreProvider";
import { ThemeProviders } from "@/lib/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {/* Optional: Auto-track visitors on every page */}
            <VisitorTracker />
            <StoreProvider>
              <ThemeProvider>
                <LanguageProvider>{children}</LanguageProvider>
              </ThemeProvider>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
