// components/icons.tsx
// Hybrid icon system:
//   - Common/universal icons → inline SVG (zero external dependency, future-proof)
//   - Specialized icons      → @mui/icons-material (convenient but library-bound)
//
// SVG icons accept standard SVG props + optional `size` shorthand.
// Usage: <SearchIcon size={20} className="text-gray-500" />

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Shorthand for width + height. Overridden by explicit width/height props. */
  size?: number | string;
}

/** Wraps a path/group into a consistent 24×24 SVG icon component. */
function icon(paths: React.ReactNode, extraProps?: React.SVGProps<SVGSVGElement>) {
  return function SvgIcon({ size, width, height, ...props }: IconProps) {
    const dim = size ?? 24;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width ?? dim}
        height={height ?? dim}
        fill="currentColor"
        aria-hidden="true"
        {...extraProps}
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — INLINE SVG ICONS (library-independent, always works)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Navigation ───────────────────────────────────────────────────────────────

export const HomeIcon = icon(<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />);
export const MenuIcon = icon(<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />);
export const MenuOpenIcon = icon(<path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z" />);
export const ArrowBackIcon = icon(<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />);
export const ArrowForwardIcon = icon(<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />);
export const ArrowUpwardIcon = icon(<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />);
export const ArrowDownwardIcon = icon(<path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />);
export const ChevronLeftIcon = icon(<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />);
export const ChevronRightIcon = icon(<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />);
export const ExpandMoreIcon = icon(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />);
export const ExpandLessIcon = icon(<path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />);
export const DoubleArrowIcon = icon(<path d="M15.5 5H11l5 7-5 7h4.5l5-7zm-6 0H5l5 7-5 7h4.5l5-7z" />);
export const FirstPageIcon = icon(<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />);
export const LastPageIcon = icon(<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />);

// ─── Actions ──────────────────────────────────────────────────────────────────

export const AddIcon = icon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />);
export const RemoveIcon = icon(<path d="M19 13H5v-2h14v2z" />);
export const DeleteIcon = icon(<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />);
export const DeleteOutlineIcon = icon(<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />);
export const EditIcon = icon(<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />);
export const SaveIcon = icon(<path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />);
export const CloseIcon = icon(<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />);
export const ClearIcon = icon(<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />);
export const CheckIcon = icon(<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />);
export const DoneIcon = icon(<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />);
export const DoneAllIcon = icon(<path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />);
export const SearchIcon = icon(<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />);
export const FilterListIcon = icon(<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />);
export const SortIcon = icon(<path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />);
export const RefreshIcon = icon(<path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />);
export const SettingsIcon = icon(<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.05 7.05 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.4 7.4 0 00-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.04.67 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7.4 7.4 0 001.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z" />);
export const InfoIcon = icon(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />);
export const WarningIcon = icon(<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />);
export const ErrorIcon = icon(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />);
export const HelpIcon = icon(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />);
export const LockIcon = icon(<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />);
export const LockOpenIcon = icon(<path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75l1.94.49C9.44 3.93 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />);
export const VisibilityIcon = icon(<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />);
export const VisibilityOffIcon = icon(<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55a2.821 2.821 0 00-.08.65 3 3 0 003 3c.22 0 .44-.03.65-.08l1.55 1.55A4.967 4.967 0 0112 17c-2.76 0-5-2.24-5-5 0-.97.28-1.88.73-2.65l-.2-.55zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />);
export const ShareIcon = icon(<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />);
export const DownloadIcon = icon(<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />);
export const UploadIcon = icon(<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />);
export const PrintIcon = icon(<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />);
export const LinkIcon = icon(<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 000 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 000-10z" />);
export const LinkOffIcon = icon(<path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.18-.67 2.22-1.63 2.76L20 16.29A5.015 5.015 0 0022 12a5 5 0 00-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11A5 5 0 002 12a5 5 0 005 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.09L8.73 11H8v2h2.73L13 15.27V17h1.73l4 4L20 19.74 3.27 3 2 4.27z" />);
export const UndoIcon = icon(<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62A7.007 7.007 0 0112.5 10c3.04 0 5.5 2.16 5.5 4.5 0 1.61-.96 3.07-2.5 3.87V20.5c2.6-1.09 4.5-3.62 4.5-6.5 0-4.14-3.58-7.5-8-7.5z" />);
export const RedoIcon = icon(<path d="M18.4 10.6A7.007 7.007 0 0012 8c-2.65 0-5 1.36-6.5 3.38L9 15H0V6l3.62 3.62A8.997 8.997 0 0112 6c3.7 0 6.88 2.27 8.24 5.52L18.4 10.6zM22 12v8l-3.62-3.62A8.997 8.997 0 0112 20a8.994 8.994 0 01-8.24-5.52l1.84-1.02A7.007 7.007 0 0012 18c2.65 0 5-1.36 6.5-3.38L15 11h9v1h-2z" />);
export const OpenInNewIcon = icon(<path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />);

// ─── Communication ────────────────────────────────────────────────────────────

export const EmailIcon = icon(<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />);
export const SendIcon = icon(<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />);
export const ChatIcon = icon(<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />);
export const ChatBubbleIcon = icon(<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />);
export const PhoneIcon = icon(<path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />);
export const CallIcon = icon(<path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />);
export const ReplyIcon = icon(<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />);
export const ReplyAllIcon = icon(<path d="M7 8V5l-7 7 7 7v-3l-4-4 4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />);
export const VideocamIcon = icon(<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />);

// ─── People & Identity ────────────────────────────────────────────────────────

export const PersonIcon = icon(<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />);
export const PersonAddIcon = icon(<path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />);
export const GroupIcon = icon(<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />);
export const AccountCircleIcon = icon(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />);
export const AdminPanelSettingsIcon = icon(<><path d="M17 11c.34 0 .67.03 1 .08V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55A6.99 6.99 0 0117 11z" /><path d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12-1.12-.51-1.12-1.12.5-1.12 1.12-1.12zm0 5.37c-.93 0-1.74-.46-2.24-1.17.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17z" /></>);

// ─── Files ────────────────────────────────────────────────────────────────────

export const FolderIcon = icon(<path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />);
export const FolderOpenIcon = icon(<path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />);
export const InsertDriveFileIcon = icon(<path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />);
export const DescriptionIcon = icon(<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />);
export const CloudUploadIcon = icon(<path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />);
export const CloudDownloadIcon = icon(<path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />);
export const AttachFileIcon = icon(<path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />);

// ─── Date & Time ──────────────────────────────────────────────────────────────

export const EventIcon = icon(<path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />);
export const AccessTimeIcon = icon(<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />);
export const ScheduleIcon = icon(<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />);
export const AlarmIcon = icon(<path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a9 9 0 000-18zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />);
export const TodayIcon = icon(<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />);
export const HistoryIcon = icon(<path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 117 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />);
export const UpdateIcon = icon(<path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1a6.875 6.875 0 000 9.79 7.02 7.02 0 009.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58a8.987 8.987 0 0112.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z" />);
export const NotificationsIcon = icon(<path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />);
export const NotificationsOffIcon = icon(<path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.73l-1-1.04zM12 22c1.11 0 2-.89 2-2h-4a2 2 0 002 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.43.13L18 10.68v4z" />);

// ─── UI / Feedback ────────────────────────────────────────────────────────────

export const CheckBoxIcon = icon(<path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />);
export const CheckBoxOutlineBlankIcon = icon(<path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />);
export const RadioButtonCheckedIcon = icon(<><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></>);
export const RadioButtonUncheckedIcon = icon(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />);
export const StarIcon = icon(<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />);
export const StarBorderIcon = icon(<path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />);
export const FavoriteIcon = icon(<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />);
export const FavoriteBorderIcon = icon(<path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />);
export const BookmarkIcon = icon(<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />);
export const BookmarkBorderIcon = icon(<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />);
export const ThumbUpIcon = icon(<path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />);
export const ThumbDownIcon = icon(<path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />);
export const TrendingUpIcon = icon(<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />);
export const TrendingDownIcon = icon(<path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />);
export const LaunchIcon = icon(<path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />);
export const DragHandleIcon = icon(<path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />);
export const FullscreenIcon = icon(<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />);
export const FullscreenExitIcon = icon(<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />);
export const ZoomInIcon = icon(<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z" />);
export const ZoomOutIcon = icon(<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" />);
export const DashboardIcon = icon(<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />);
export const BugReportIcon = icon(<path d="M20 8h-2.81A5.985 5.985 0 0014 5.08V4h1c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1s.45 1 1 1h1v1.08A5.985 5.985 0 008.81 8H6c-.55 0-1 .45-1 1s.45 1 1 1h1.09c-.05.33-.09.66-.09 1v1H6c-.55 0-1 .45-1 1s.45 1 1 1h1v1c0 .34.04.67.09 1H6c-.55 0-1 .45-1 1s.45 1 1 1h1.81A6.002 6.002 0 0012 21a6.002 6.002 0 004.19-2H18c.55 0 1-.45 1-1s-.45-1-1-1h-1.09c.05-.33.09-.66.09-1v-1h1c.55 0 1-.45 1-1s-.45-1-1-1h-1v-1c0-.34-.04-.67-.09-1H18c.55 0 1-.45 1-1s-.45-1-1-1h-1.09c.05-.33.09-.66.09-1H18c.55 0 1-.45 1-1s-.45-1-1-1zm-5 9h-6v-2h6v2zm0-4h-6v-2h6v2z" />);

// ─── Maps & Location ──────────────────────────────────────────────────────────

export const LocationOnIcon = icon(<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />);
export const MapIcon = icon(<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />);
export const NavigationIcon = icon(<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />);
export const DirectionsIcon = icon(<path d="M21.71 11.29l-9-9a1 1 0 00-1.41 0l-9 9a1 1 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />);
export const FlightIcon = icon(<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />);
export const RestaurantIcon = icon(<path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />);
export const HotelIcon = icon(<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />);

// ─── Media ────────────────────────────────────────────────────────────────────

export const PlayArrowIcon = icon(<path d="M8 5v14l11-7z" />);
export const PauseIcon = icon(<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />);
export const StopIcon = icon(<path d="M6 6h12v12H6z" />);
export const SkipNextIcon = icon(<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />);
export const SkipPreviousIcon = icon(<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />);
export const VolumeUpIcon = icon(<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />);
export const VolumeOffIcon = icon(<path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />);
export const ShuffleIcon = icon(<path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />);
export const RepeatIcon = icon(<path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />);

// ─── Analytics ────────────────────────────────────────────────────────────────

export const BarChartIcon = icon(<path d="M4 9h4v11H4zm6-5h4v16h-4zm6 8h4v8h-4z" />);
export const ShowChartIcon = icon(<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />);
export const PieChartIcon = icon(<path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z" />);
export const TimelineIcon = icon(<path d="M23 8c0 1.1-.9 2-2 2a1.7 1.7 0 01-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56A1.7 1.7 0 0119 8c0-1.1.9-2 2-2s2 .9 2 2z" />);

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const SecurityIcon = icon(<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />);
export const VpnKeyIcon = icon(<path d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />);
export const SyncIcon = icon(<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />);
export const TagIcon = icon(<path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z" />);
export const ExtensionIcon = icon(<path d="M20.5 11H19V7a2 2 0 00-2-2h-4V3.5A2.5 2.5 0 0010.5 1 2.5 2.5 0 008 3.5V5H4a2 2 0 00-2 2v3.8h1.5c1.5 0 2.7 1.2 2.7 2.7S5 16.2 3.5 16.2H2V20a2 2 0 002 2h3.8v-1.5c0-1.5 1.2-2.7 2.7-2.7 1.5 0 2.7 1.2 2.7 2.7V22H17a2 2 0 002-2v-4h1.5a2.5 2.5 0 002.5-2.5A2.5 2.5 0 0020.5 11z" />);
export const StorageIcon = icon(<path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />);
export const WifiIcon = icon(<path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />);
export const WifiOffIcon = icon(<path d="M24 .76L6.29 18.47 5 19.76l-.01-.01-1.41 1.42 1 1 1.41-1.41.01.01L7.42 19.3l2.19 2.19L12 19l-2.43-2.43-1.58 1.58-2.07-2.07C7.29 15.4 9.56 14.62 12 14.62a9.2 9.2 0 015.1 1.56L22.76 10.5A16.096 16.096 0 0012 7a16.22 16.22 0 00-8.41 2.33L1.39 7.14A18.54 18.54 0 0112 5c3.68 0 7.11 1.07 9.99 2.9L23.41 6.5c1.01.71 1.95 1.5 2.81 2.37l.01-.01L24.76 7.44C24.52 5.21 22 3.66 22 3.66L24 .76zm-12 6a16.3 16.3 0 018.79 2.55l-2.07 2.07A13.14 13.14 0 0012 10a13.14 13.14 0 00-6.72 1.83l-2.06-2.06A16.26 16.26 0 0112 6.76z" />);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — MUI IMPORTS (specialized / less common icons)
// If @mui/icons-material is removed in future, replace these with SVGs above.
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Actions (specialized)
  AddCircle as AddCircleIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircle as RemoveCircleIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  SaveAlt as SaveAltIcon,
  SaveAs as SaveAsIcon,
  FilterAlt as FilterAltIcon,
  SortByAlpha as SortByAlphaIcon,
  ViewColumn as ViewColumnIcon,
  RestoreFromTrash as RestoreFromTrashIcon,
  RestartAlt as RestartAltIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  SettingsApplications as SettingsApplicationsIcon,
  HelpOutline as HelpOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  ReportProblem as ReportProblemIcon,
  Report as ReportIcon,
  ReportGmailerrorred as ReportGmailerrorredIcon,
  AddAlert as AddAlertIcon,
  SelectAll as SelectAllIcon,
  Reorder as ReorderIcon,
  Tune as TuneIcon,

  // Navigation (specialized)
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  SubdirectoryArrowLeft as SubdirectoryArrowLeftIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,

  // Communication (specialized)
  EmailOutlined as EmailOutlinedIcon,
  MailOutline as MailOutlineIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Comment as CommentIcon,
  Forum as ForumIcon,
  Message as MessageIcon,
  PhoneInTalk as PhoneInTalkIcon,
  PhoneMissed as PhoneMissedIcon,
  CallEnd as CallEndIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  ContactMail as ContactMailIcon,
  ContactPhone as ContactPhoneIcon,
  Contacts as ContactsIcon,
  ImportContacts as ImportContactsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Markunread as MarkunreadIcon,
  Unsubscribe as UnsubscribeIcon,
  Textsms as TextsmsIcon,
  Sms as SmsIcon,
  VideocamOff as VideocamOffIcon,
  VoiceChat as VoiceChatIcon,
  Voicemail as VoicemailIcon,

  // Business (specialized)
  Business as BusinessIcon,
  BusinessCenter as BusinessCenterIcon,
  Store as StoreIcon,
  Storefront as StorefrontIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBasket as ShoppingBasketIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  Receipt as ReceiptIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  AccountTree as AccountTreeIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Leaderboard as LeaderboardIcon,
  QueryStats as QueryStatsIcon,
  StackedLineChart as StackedLineChartIcon,
  StackedBarChart as StackedBarChartIcon,
  WaterfallChart as WaterfallChartIcon,
  MonetizationOn as MonetizationOnIcon,
  AttachMoney as AttachMoneyIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CurrencyExchange as CurrencyExchangeIcon,
  PriceChange as PriceChangeIcon,
  PriceCheck as PriceCheckIcon,
  CreditCard as CreditCardIcon,
  CreditCardOff as CreditCardOffIcon,
  Payment as PaymentIcon,
  LocalOffer as LocalOfferIcon,
  Summarize as SummarizeIcon,
  TableChart as TableChartIcon,
  Schema as SchemaIcon,
  Source as SourceIcon,
  Topic as TopicIcon,
  Segment as SegmentIcon,
  PostAdd as PostAddIcon,

  // People (specialized)
  PersonOutline as PersonOutlineIcon,
  PersonAddAlt as PersonAddAltIcon,
  PersonRemove as PersonRemoveIcon,
  PeopleOutline as PeopleOutlineIcon,
  GroupAdd as GroupAddIcon,
  GroupRemove as GroupRemoveIcon,
  Groups as GroupsIcon,
  SupervisorAccount as SupervisorAccountIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Verified as VerifiedIcon,
  Fingerprint as FingerprintIcon,
  Badge as BadgeIcon,
  SwitchAccount as SwitchAccountIcon,

  // Work & Tasks
  Work as WorkIcon,
  WorkOutline as WorkOutlineIcon,
  WorkHistory as WorkHistoryIcon,
  WorkOff as WorkOffIcon,
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
  Task as TaskIcon,
  TaskAlt as TaskAltIcon,
  Rule as RuleIcon,
  TrackChanges as TrackChangesIcon,
  RocketLaunch as RocketLaunchIcon,
  Flag as FlagIcon,
  Inventory as InventoryIcon,
  Inventory2 as Inventory2Icon,

  // Files (specialized)
  FilePresent as FilePresentIcon,
  TextSnippet as TextSnippetIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Attachment as AttachmentIcon,
  Cloud as CloudIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  CloudQueue as CloudQueueIcon,
  CloudCircle as CloudCircleIcon,
  FolderShared as FolderSharedIcon,
  FolderZip as FolderZipIcon,
  CreateNewFolder as CreateNewFolderIcon,
  SnippetFolder as SnippetFolderIcon,
  Image as ImageIcon,
  ImageNotSupported as ImageNotSupportedIcon,
  InsertPhoto as InsertPhotoIcon,
  MusicNote as MusicNoteIcon,
  Audiotrack as AudiotrackIcon,
  VideoFile as VideoFileIcon,
  VideoLibrary as VideoLibraryIcon,
  Movie as MovieIcon,

  // Hardware
  Computer as ComputerIcon,
  DesktopMac as DesktopMacIcon,
  DesktopWindows as DesktopWindowsIcon,
  Laptop as LaptopIcon,
  LaptopMac as LaptopMacIcon,
  LaptopWindows as LaptopWindowsIcon,
  PhoneAndroid as PhoneAndroidIcon,
  PhoneIphone as PhoneIphoneIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  TabletMac as TabletMacIcon,
  TabletAndroid as TabletAndroidIcon,
  Watch as WatchIcon,
  Headphones as HeadphonesIcon,
  Headset as HeadsetIcon,
  HeadsetMic as HeadsetMicIcon,
  Keyboard as KeyboardIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Mouse as MouseIcon,
  Speaker as SpeakerIcon,
  Router as RouterIcon,
  Memory as MemoryIcon,
  DeveloperBoard as DeveloperBoardIcon,
  SimCard as SimCardIcon,
  Usb as UsbIcon,
  UsbOff as UsbOffIcon,

  // Camera & Image
  Camera as CameraIcon,
  CameraAlt as CameraAltIcon,
  CameraFront as CameraFrontIcon,
  CameraRear as CameraRearIcon,
  CameraRoll as CameraRollIcon,
  PhotoAlbum as PhotoAlbumIcon,
  PhotoCamera as PhotoCameraIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Collections as CollectionsIcon,
  Brush as BrushIcon,
  ColorLens as ColorLensIcon,
  Palette as PaletteIcon,
  Gradient as GradientIcon,
  GridOn as GridOnIcon,
  FilterHdr as FilterHdrIcon,
  FilterVintage as FilterVintageIcon,
  Contrast as ContrastIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Slideshow as SlideshowIcon,
  Wallpaper as WallpaperIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,

  // Maps (specialized)
  LocationOff as LocationOffIcon,
  LocationSearching as LocationSearchingIcon,
  LocationCity as LocationCityIcon,
  NearMe as NearMeIcon,
  DirectionsBike as DirectionsBikeIcon,
  DirectionsBus as DirectionsBusIcon,
  DirectionsCar as DirectionsCarIcon,
  DirectionsWalk as DirectionsWalkIcon,
  DirectionsRun as DirectionsRunIcon,
  DirectionsTransit as DirectionsTransitIcon,
  Train as TrainIcon,
  Tram as TramIcon,
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  TwoWheeler as TwoWheelerIcon,
  LocalShipping as LocalShippingIcon,
  LocalTaxi as LocalTaxiIcon,
  RestaurantMenu as RestaurantMenuIcon,
  LocalCafe as LocalCafeIcon,
  LocalBar as LocalBarIcon,
  LocalGasStation as LocalGasStationIcon,
  LocalHospital as LocalHospitalIcon,
  LocalPharmacy as LocalPharmacyIcon,
  LocalPolice as LocalPoliceIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  LocalParking as LocalParkingIcon,
  LocalMall as LocalMallIcon,
  LocalGroceryStore as LocalGroceryStoreIcon,
  LocalLibrary as LocalLibraryIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  LocalDining as LocalDiningIcon,
  LocalFlorist as LocalFloristIcon,
  HomeWork as HomeWorkIcon,
  Streetview as StreetviewIcon,
  TravelExplore as TravelExploreIcon,
  Traffic as TrafficIcon,
  Stadium as StadiumIcon,
  Terrain as TerrainIcon,

  // Date & Time (specialized)
  TimerOff as TimerOffIcon,
  AlarmAdd as AlarmAddIcon,
  AlarmOff as AlarmOffIcon,
  AlarmOn as AlarmOnIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  EventNote as EventNoteIcon,
  DateRange as DateRangeIcon,
  AccessTimeFilled as AccessTimeFilledIcon,
  HourglassEmpty as HourglassEmptyIcon,
  HourglassFull as HourglassFullIcon,
  HourglassBottom as HourglassBottomIcon,
  HourglassTop as HourglassTopIcon,
  HistoryEdu as HistoryEduIcon,
  Snooze as SnoozeIcon,
  Timelapse as TimelapseIcon,
  WatchLater as WatchLaterIcon,
  Upcoming as UpcomingIcon,

  // Notifications (specialized)
  NotificationsActive as NotificationsActiveIcon,
  NotificationsNone as NotificationsNoneIcon,
  NotificationsPaused as NotificationsPausedIcon,
  NotificationImportant as NotificationImportantIcon,

  // Text formatting
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignJustify as FormatAlignJustifyIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignRight as FormatAlignRightIcon,
  FormatBold as FormatBoldIcon,
  FormatClear as FormatClearIcon,
  FormatColorFill as FormatColorFillIcon,
  FormatColorText as FormatColorTextIcon,
  FormatIndentDecrease as FormatIndentDecreaseIcon,
  FormatIndentIncrease as FormatIndentIncreaseIcon,
  FormatItalic as FormatItalicIcon,
  FormatLineSpacing as FormatLineSpacingIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatPaint as FormatPaintIcon,
  FormatQuote as FormatQuoteIcon,
  FormatSize as FormatSizeIcon,
  FormatStrikethrough as FormatStrikethroughIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Highlight as HighlightIcon,
  Spellcheck as SpellcheckIcon,
  Translate as TranslateIcon,
  Functions as FunctionsIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,

  // Media (specialized)
  SlowMotionVideo as SlowMotionVideoIcon,
  RepeatOne as RepeatOneIcon,

  // Analytics (specialized)
  PieChartOutline as PieChartOutlineIcon,

  // UI (specialized)
  SpaceDashboard as SpaceDashboardIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewKanban as ViewKanbanIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewStream as ViewStreamIcon,
  ViewSidebar as ViewSidebarIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewQuilt as ViewQuiltIcon,
  Splitscreen as SplitscreenIcon,
  Tab as TabIcon,
  Widgets as WidgetsIcon,
  Window as WindowIcon,
  Web as WebIcon,
  Webhook as WebhookIcon,
  TableRows as TableRowsIcon,
  TableView as TableViewIcon,
  LinearScale as LinearScaleIcon,
  DragIndicator as DragIndicatorIcon,
  OpenWith as OpenWithIcon,
  Layers as LayersIcon,
  LayersClear as LayersClearIcon,
  TouchApp as TouchAppIcon,
  Screenshot as ScreenshotIcon,
  Style as StyleIcon,
  Token as TokenIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  SmartToy as SmartToyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Biotech as BiotechIcon,
  Science as ScienceIcon,

  // Network (specialized)
  WifiLock as WifiLockIcon,
  WifiFind as WifiFindIcon,
  WifiTethering as WifiTetheringIcon,
  WifiTetheringOff as WifiTetheringOffIcon,
  SignalCellularAlt as SignalCellularAltIcon,
  SignalCellularOff as SignalCellularOffIcon,
  Bluetooth as BluetoothIcon,
  BluetoothDisabled as BluetoothDisabledIcon,
  SyncAlt as SyncAltIcon,
  SyncDisabled as SyncDisabledIcon,
  SyncProblem as SyncProblemIcon,
  SyncLock as SyncLockIcon,
  VpnLock as VpnLockIcon,
  Lan as LanIcon,
  Hub as HubIcon,

  // Feedback
  SentimentSatisfied as SentimentSatisfiedIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon,
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  SentimentVerySatisfied as SentimentVerySatisfiedIcon,
  Mood as MoodIcon,
  MoodBad as MoodBadIcon,
  ThumbUpAlt as ThumbUpAltIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ThumbDownAlt as ThumbDownAltIcon,
  ThumbDownOffAlt as ThumbDownOffAltIcon,
  ThumbsUpDown as ThumbsUpDownIcon,

  // Other
  VerifiedUser as VerifiedUserIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  UploadFile as UploadFileIcon,
  Code as CodeIcon,
  CodeOff as CodeOffIcon,
  AccountBox as AccountBoxIcon,
  People as PeopleIcon,
  Photo as PhotoIcon,
  Adjust as AdjustIcon,
  Crop as CropIcon,
  Straighten as StraightenIcon,
  FlipCameraAndroid as FlipCameraAndroidIcon,
  Place as PlaceIcon,
  TrendingFlat as TrendingFlatIcon,
  StarHalf as StarHalfIcon,
} from "@mui/icons-material";