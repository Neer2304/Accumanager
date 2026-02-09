// components/ui/Tabs.tsx
"use client";

import React from "react";
import {
  Tabs as MuiTabs,
  Tab as MuiTab,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface TabsProps {
  value: number;
  onChange: (newValue: number) => void;
  tabs: Array<{
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  variant?: "standard" | "scrollable" | "fullWidth";
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  tabs,
  variant = "standard",
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <MuiTabs
        value={value}
        onChange={handleChange}
        variant={isMobile ? "scrollable" : variant}
        scrollButtons={isMobile ? "auto" : false}
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            minHeight: 48,
            fontSize: "0.875rem",
            color: darkMode ? "#9aa0a6" : "#5f6368",
            "&.Mui-selected": {
              color: darkMode ? "#8ab4f8" : "#1a73e8",
              fontWeight: 600,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: darkMode ? "#8ab4f8" : "#1a73e8",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <MuiTab
            key={index}
            label={tab.label}
            // icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </MuiTabs>
    </Box>
  );
};