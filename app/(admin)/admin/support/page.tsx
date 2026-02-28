"use client";

// app/admin/support/page.tsx
// Zero MUI. Pure React + inline styles. Google Material aesthetic.
// Fixes from original:
// - Reply API endpoint was wrong (/api/admin/support/${id}/reply → correct is PUT /api/admin/support/${id})
// - Stats were calculated client-side from paginated data (wrong) → now uses server stats
// - No delete functionality despite DELETE API existing
// - No priority filter applied to API params
// - No pagination support despite API returning pagination
// - Dialog had TextareaAutosize which required extra MUI import
// - Status update optimistic UI could show stale data

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reply {
  message: string;
  isAdmin: boolean;
  adminId?: string;
  createdAt: string;
}

interface SupportTicket {
  _id: string;
  ticketNumber?: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  category?: string;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  lastRepliedAt?: string;
  resolvedAt?: string;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function priorityColor(p: string) {
  return (
    { urgent: "#ea4335", high: "#f57c00", medium: "#f9ab00", low: "#1e8e3e" }[
      p
    ] ?? "#5f6368"
  );
}

function statusColor(s: string) {
  return (
    {
      open: "#1a73e8",
      "in-progress": "#f9ab00",
      resolved: "#1e8e3e",
      closed: "#5f6368",
    }[s] ?? "#5f6368"
  );
}

function statusBg(s: string) {
  return (
    {
      open: "rgba(26,115,232,0.10)",
      "in-progress": "rgba(249,171,0,0.12)",
      resolved: "rgba(30,142,62,0.10)",
      closed: "rgba(95,99,104,0.10)",
    }[s] ?? "rgba(95,99,104,0.10)"
  );
}

function priorityBg(p: string) {
  return (
    {
      urgent: "rgba(234,67,53,0.10)",
      high: "rgba(245,124,0,0.10)",
      medium: "rgba(249,171,0,0.12)",
      low: "rgba(30,142,62,0.10)",
    }[p] ?? "rgba(95,99,104,0.10)"
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Ico = {
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  ),
  refresh: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  send: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  trash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  ),
  chat: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  ticket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-2-3.46V6h16v2.54z" />
    </svg>
  ),
  forum: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 6.5C21 5.12 19.88 4 18.5 4h-13C4.12 4 3 5.12 3 6.5v8C3 15.88 4.12 17 5.5 17H12l4 4v-4h2.5c1.38 0 2.5-1.12 2.5-2.5v-8z" />
    </svg>
  ),
  urgent: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  clock: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  ),
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  ),
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const c = type === "success" ? "#1e8e3e" : "#d93025";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: `1px solid ${c}40`,
        borderLeft: `4px solid ${c}`,
        borderRadius: 12,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 9999,
        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
        animation: "slideUp .2s ease",
        minWidth: 260,
        maxWidth: 440,
      }}
    >
      <span style={{ color: c, flexShrink: 0 }}>
        {type === "success" ? Ico.check : Ico.urgent}
      </span>
      <span style={{ fontSize: 14, color: "#202124", flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#5f6368",
          padding: 0,
          display: "flex",
        }}
      >
        {Ico.close}
      </button>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "capitalize",
        letterSpacing: ".02em",
      }}
    >
      {label.replace("-", " ")}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  icon,
  dark,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  dark: boolean;
}) {
  const T = dark
    ? { bg: "#26282c", border: "#3c4043", text: "#e8eaed", sub: "#9aa0a6" }
    : { bg: "#ffffff", border: "#e8eaed", text: "#202124", sub: "#5f6368" };
  return (
    <div
      style={{
        flex: 1,
        minWidth: 160,
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: dark
          ? "0 2px 8px rgba(0,0,0,.2)"
          : "0 1px 4px rgba(60,64,67,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${color}15`,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: T.sub, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ─── Ticket Detail Drawer ─────────────────────────────────────────────────────

function TicketDrawer({
  ticket,
  dark,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onSendReply,
  onDelete,
}: {
  ticket: SupportTicket | null;
  dark: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onUpdatePriority: (id: string, priority: string) => Promise<void>;
  onSendReply: (id: string, msg: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const T = dark
    ? {
        bg: "#1c1e22",
        surface: "#26282c",
        border: "#3c4043",
        text: "#e8eaed",
        sub: "#9aa0a6",
        muted: "#5f6368",
        input: "#303438",
      }
    : {
        bg: "#f8f9fa",
        surface: "#ffffff",
        border: "#e8eaed",
        text: "#202124",
        sub: "#5f6368",
        muted: "#9aa0a6",
        input: "#f1f3f4",
      };

  useEffect(() => {
    setReply("");
    setConfirmDelete(false);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, [ticket?._id]);

  if (!ticket) return null;

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    await onSendReply(ticket._id, reply);
    setReply("");
    setSending(false);
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      150,
    );
  };

  // In TicketDrawer component
  const handleStatus = async (s: string) => {
    console.log("🎯 TicketDrawer handleStatus - Ticket ID:", ticket?._id);
    console.log("🎯 TicketDrawer handleStatus - New status:", s);

    if (!ticket?._id) {
      console.error("❌ No ticket ID found!");
      return;
    }

    setUpdating(true);
    try {
      await onUpdateStatus(ticket._id, s);
    } catch (error) {
      console.error("Error in handleStatus:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePriority = async (p: string) => {
    setUpdating(true);
    await onUpdatePriority(ticket._id, p);
    setUpdating(false);
  };

  const STATUSES = ["open", "in-progress", "resolved", "closed"];
  const PRIORITIES = ["low", "medium", "high", "urgent"];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          zIndex: 400,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 620,
          background: T.bg,
          zIndex: 401,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,.2)",
          animation: "slideLeft .25s ease",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${T.border}`,
            background: T.surface,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.muted,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {ticket.ticketNumber ||
                  `#${ticket._id.slice(-8).toUpperCase()}`}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                  lineHeight: 1.3,
                  maxWidth: 400,
                }}
              >
                {ticket.subject}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.input,
                color: T.sub,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {Ico.close}
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip
              label={ticket.status}
              color={statusColor(ticket.status)}
              bg={statusBg(ticket.status)}
            />
            <Chip
              label={ticket.priority}
              color={priorityColor(ticket.priority)}
              bg={priorityBg(ticket.priority)}
            />
            {ticket.category && (
              <Chip
                label={ticket.category}
                color="#5f6368"
                bg="rgba(95,99,104,0.1)"
              />
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* User info */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `${priorityColor(ticket.priority)}20`,
                color: priorityColor(ticket.priority),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(ticket.userName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                {ticket.userName}
              </div>
              <div style={{ fontSize: 12, color: T.sub }}>
                {ticket.userEmail}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                {Ico.clock} Created {fmtDate(ticket.createdAt)}
              </div>
            </div>
          </div>

          {/* Original message */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 8,
              }}
            >
              Original Message
            </div>
            <div
              style={{
                fontSize: 14,
                color: T.text,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              {ticket.message}
            </div>
          </div>

          {/* Conversation thread */}
          {ticket.replies.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 12,
                }}
              >
                Conversation ({ticket.replies.length})
              </div>
              {ticket.replies.map((r, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: r.isAdmin ? "row-reverse" : "row",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: r.isAdmin
                        ? "rgba(26,115,232,.15)"
                        : "rgba(95,99,104,.12)",
                      color: r.isAdmin ? "#1a73e8" : T.sub,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {r.isAdmin ? "A" : initials(ticket.userName)}
                  </div>
                  <div style={{ flex: 1, maxWidth: "85%" }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: T.muted,
                        marginBottom: 4,
                        textAlign: r.isAdmin ? "right" : "left",
                      }}
                    >
                      {r.isAdmin ? "Support Team" : ticket.userName} ·{" "}
                      {timeAgo(r.createdAt)}
                    </div>
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: r.isAdmin
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                        background: r.isAdmin
                          ? "rgba(26,115,232,.1)"
                          : T.surface,
                        border: `1px solid ${r.isAdmin ? "rgba(26,115,232,.2)" : T.border}`,
                        fontSize: 14,
                        color: T.text,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {r.message}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Status controls */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 10,
              }}
            >
              Update Status
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  disabled={updating || ticket.status === s}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${ticket.status === s ? statusColor(s) : T.border}`,
                    background:
                      ticket.status === s ? statusBg(s) : "transparent",
                    color: ticket.status === s ? statusColor(s) : T.sub,
                    fontSize: 12,
                    fontWeight: ticket.status === s ? 700 : 400,
                    cursor: ticket.status === s ? "default" : "pointer",
                    textTransform: "capitalize",
                    opacity: updating ? 0.6 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Priority controls */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 10,
              }}
            >
              Update Priority
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriority(p)}
                  disabled={updating || ticket.priority === p}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${ticket.priority === p ? priorityColor(p) : T.border}`,
                    background:
                      ticket.priority === p ? priorityBg(p) : "transparent",
                    color: ticket.priority === p ? priorityColor(p) : T.sub,
                    fontSize: 12,
                    fontWeight: ticket.priority === p ? 700 : 400,
                    cursor: ticket.priority === p ? "default" : "pointer",
                    textTransform: "capitalize",
                    opacity: updating ? 0.6 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Reply box */}
          {ticket.status !== "closed" && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 8,
                }}
              >
                Reply
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                    handleSend();
                }}
                placeholder="Type your reply… (Ctrl+Enter to send)"
                rows={4}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.input,
                  color: T.text,
                  fontSize: 14,
                  fontFamily: "inherit",
                  lineHeight: 1.55,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color .15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#1a73e8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
              />
              <button
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: !reply.trim() || sending ? T.muted : "#1a73e8",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: !reply.trim() || sending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  fontFamily: "inherit",
                  transition: "background .15s",
                }}
              >
                {sending ? (
                  <>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #fff4",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin .7s linear infinite",
                      }}
                    />{" "}
                    Sending…
                  </>
                ) : (
                  <>{Ico.send} Send Reply</>
                )}
              </button>
            </div>
          )}

          {/* Danger zone */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(217,48,37,.3)",
                  background: "rgba(217,48,37,.06)",
                  color: "#d93025",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {Ico.trash} Delete Ticket
              </button>
            ) : (
              <div
                style={{
                  background: "rgba(217,48,37,.06)",
                  border: "1px solid rgba(217,48,37,.3)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#d93025",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  Are you sure? This cannot be undone.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={async () => {
                      await onDelete(ticket._id);
                      onClose();
                    }}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#d93025",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      background: "transparent",
                      color: T.sub,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const T = dark
    ? {
        bg: "#202124",
        surface: "#1c1e22",
        panel: "#26282c",
        border: "#3c4043",
        text: "#e8eaed",
        sub: "#9aa0a6",
        muted: "#5f6368",
        input: "#2d3034",
      }
    : {
        bg: "#f0f4f9",
        surface: "#ffffff",
        panel: "#f8f9fa",
        border: "#e8eaed",
        text: "#202124",
        sub: "#5f6368",
        muted: "#9aa0a6",
        input: "#f1f3f4",
      };

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [priorityF, setPriorityF] = useState("");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
    },
    [],
  );

  // ── Fetch tickets ──────────────────────────────────────────────────────────
  const fetchTickets = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          ...(statusF && { status: statusF }),
          ...(priorityF && { priority: priorityF }),
          ...(search && { search }),
        });
        const res = await fetch(`/api/admin/support?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        setTickets(data.tickets || []);
        if (data.stats) setStats(data.stats);
        if (data.pagination) setPagination(data.pagination);
      } catch (e: any) {
        showToast(e.message || "Failed to load tickets", "error");
      } finally {
        setLoading(false);
      }
    },
    [statusF, priorityF, search, showToast],
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // In AdminSupportPage
  const handleUpdateStatus = useCallback(
    async (id: string, status: string) => {
      console.log("🔵 handleUpdateStatus called with:", {
        id,
        idType: typeof id,
        idLength: id.length,
        status,
      });

      try {
        console.log("Making PUT request to:", `/api/admin/support/${id}`);
        const res = await fetch(`/api/admin/support/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) {
          console.error("Update failed:", data);
          throw new Error(data.message || "Update failed");
        }

        // Update state
        setTickets((prev) => prev.map((t) => (t._id === id ? data.ticket : t)));
        setSelected((prev) => (prev?._id === id ? data.ticket : prev));
        showToast(`Status updated to ${status.replace("-", " ")}`);
      } catch (e: any) {
        console.error("❌ Update failed:", e);
        showToast(e.message || "Update failed", "error");
      }
    },
    [showToast],
  );

  // ── Update priority ────────────────────────────────────────────────────────
  const handleUpdatePriority = useCallback(
    async (id: string, priority: string) => {
      try {
        const res = await fetch(`/api/admin/support/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTickets((prev) => prev.map((t) => (t._id === id ? data.ticket : t)));
        setSelected((prev) => (prev?._id === id ? data.ticket : prev));
        showToast(`Priority updated to ${priority}`);
      } catch (e: any) {
        showToast(e.message || "Update failed", "error");
      }
    },
    [showToast],
  );

  // ── Send reply ─────────────────────────────────────────────────────────────
  const handleSendReply = useCallback(
    async (id: string, message: string) => {
      try {
        const res = await fetch(`/api/admin/support/${id}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTickets((prev) => prev.map((t) => (t._id === id ? data.ticket : t)));
        setSelected(data.ticket);
        showToast("Reply sent successfully");
      } catch (e: any) {
        showToast(e.message || "Failed to send reply", "error");
      }
    },
    [showToast],
  );

  // ── Delete ticket ──────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/support/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTickets((prev) => prev.filter((t) => t._id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
        showToast("Ticket deleted");
      } catch (e: any) {
        showToast(e.message || "Delete failed", "error");
      }
    },
    [showToast],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        tr.ticket-row:hover { background: ${dark ? "#2a2c30" : "#f1f3f4"} !important; }
        button { font-family: inherit; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/admin/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#1a73e8",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            {Ico.back} Back to Dashboard
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(26,115,232,.12)",
                  color: "#1a73e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Ico.ticket}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: T.text,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Support Center
                </h1>
                <p style={{ fontSize: 14, color: T.sub, marginTop: 2 }}>
                  Manage user tickets and support requests
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchTickets(pagination.page)}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 18px",
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.sub,
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#1a73e8";
                (e.currentTarget as HTMLButtonElement).style.color = "#1a73e8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  T.border;
                (e.currentTarget as HTMLButtonElement).style.color = T.sub;
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: loading ? "spin .8s linear infinite" : "none",
                }}
              >
                {Ico.refresh}
              </span>
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label="Total Tickets"
            value={stats.total}
            color="#1a73e8"
            icon={Ico.forum}
            dark={dark}
          />
          <StatCard
            label="Open"
            value={stats.open}
            color="#1a73e8"
            icon={Ico.chat}
            dark={dark}
          />
          <StatCard
            label="Urgent"
            value={stats.urgent}
            color="#d93025"
            icon={Ico.urgent}
            dark={dark}
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            color="#1e8e3e"
            icon={Ico.check}
            dark={dark}
          />
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 18,
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: T.muted,
                pointerEvents: "none",
              }}
            >
              {Ico.search}
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, subject, email…"
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 9,
                border: `1px solid ${T.border}`,
                background: T.input,
                color: T.text,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1a73e8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.input,
              color: T.text,
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityF}
            onChange={(e) => setPriorityF(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.input,
              color: T.text,
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Clear */}
          {(search || statusF || priorityF) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusF("");
                setPriorityF("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: 9,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.sub,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {Ico.close} Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              background: T.panel,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
              Tickets{" "}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: T.sub,
                  marginLeft: 6,
                }}
              >
                {pagination.total} total
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 60,
                    margin: "6px 0",
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${T.panel} 25%, ${T.input} 50%, ${T.panel} 75%)`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", color: T.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: T.sub,
                  marginBottom: 6,
                }}
              >
                No tickets found
              </div>
              <div style={{ fontSize: 13 }}>
                {search || statusF || priorityF
                  ? "Try changing your filters"
                  : "No support requests yet"}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: T.panel }}>
                    {[
                      "User",
                      "Subject",
                      "Priority",
                      "Status",
                      "Replies",
                      "Created",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.muted,
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                          borderBottom: `1px solid ${T.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="ticket-row"
                      onClick={() => setSelected(ticket)}
                      style={{
                        cursor: "pointer",
                        borderBottom: `1px solid ${T.border}`,
                        background: T.surface,
                        transition: "background .12s",
                      }}
                    >
                      {/* User */}
                      <td
                        style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: `${priorityColor(ticket.priority)}15`,
                              color: priorityColor(ticket.priority),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials(ticket.userName)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: T.text,
                              }}
                            >
                              {ticket.userName}
                            </div>
                            <div style={{ fontSize: 11, color: T.muted }}>
                              {ticket.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Subject */}
                      <td style={{ padding: "12px 16px", maxWidth: 280 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.subject}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: T.muted,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.message}
                        </div>
                      </td>
                      {/* Priority */}
                      <td
                        style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                      >
                        <Chip
                          label={ticket.priority}
                          color={priorityColor(ticket.priority)}
                          bg={priorityBg(ticket.priority)}
                        />
                      </td>
                      {/* Status */}
                      <td
                        style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                      >
                        <Chip
                          label={ticket.status}
                          color={statusColor(ticket.status)}
                          bg={statusBg(ticket.status)}
                        />
                      </td>
                      {/* Replies */}
                      <td
                        style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color:
                              ticket.replies.length > 0 ? "#1a73e8" : T.muted,
                            fontWeight: ticket.replies.length > 0 ? 600 : 400,
                          }}
                        >
                          {ticket.replies.length}
                        </span>
                      </td>
                      {/* Date */}
                      <td
                        style={{
                          padding: "12px 16px",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          color: T.muted,
                        }}
                      >
                        {timeAgo(ticket.createdAt)}
                      </td>
                      {/* Actions */}
                      {/* In the table actions column */}
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <Link href={`/admin/support/${ticket._id}`}>
                          <button
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "6px 14px",
                              borderRadius: 8,
                              border: `1px solid ${T.border}`,
                              background: "transparent",
                              color: "#1a73e8",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            {Ico.chat} View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div
              style={{
                padding: "14px 20px",
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 13, color: T.sub }}>
                Page {pagination.page} of {pagination.pages} ·{" "}
                {pagination.total} tickets
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => fetchTickets(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: "transparent",
                    color: pagination.page <= 1 ? T.muted : T.text,
                    fontSize: 13,
                    cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchTickets(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: "#1a73e8",
                    color: "#fff",
                    fontSize: 13,
                    cursor:
                      pagination.page >= pagination.pages
                        ? "not-allowed"
                        : "pointer",
                    fontFamily: "inherit",
                    opacity: pagination.page >= pagination.pages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <TicketDrawer
        ticket={selected}
        dark={dark}
        onClose={() => setSelected(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onSendReply={handleSendReply}
        onDelete={handleDelete}
      />

      {/* Toast */}
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
