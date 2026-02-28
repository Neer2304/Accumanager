"use client";

// app/admin/support/[id]/page.tsx
// Dedicated ticket detail page - gets ID from URL params

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
        padding: "4px 12px",
        borderRadius: 30,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
        letterSpacing: "0.3px",
      }}
    >
      {label.replace("-", " ")}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const ticketId = params.id as string;

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
        bg: "#f8f9fa",
        surface: "#ffffff",
        panel: "#f8f9fa",
        border: "#e8eaed",
        text: "#202124",
        sub: "#5f6368",
        muted: "#9aa0a6",
        input: "#f1f3f4",
      };

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type });
    },
    [],
  );

  // Fetch ticket data

  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      console.log("❌ No ticketId provided");
      return;
    }

    console.log("📞 Fetching ticket with ID:", ticketId);
    console.log("ID type:", typeof ticketId);
    console.log("ID length:", ticketId.length);

    setLoading(true);
    try {
      const url = `/api/admin/support/${ticketId.trim()}`;
      console.log("Fetching from URL:", url);

      const res = await fetch(url);
      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        console.error("Error response:", data);
        throw new Error(data.message || "Failed to load ticket");
      }

      setTicket(data.ticket);
    } catch (e: any) {
      console.error("❌ Error fetching ticket:", e);
      showToast(e.message || "Failed to load ticket", "error");
    } finally {
      setLoading(false);
    }
  }, [ticketId, showToast]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Update status
  const handleUpdateStatus = useCallback(
    async (newStatus: string) => {
      if (!ticket) return;

      setSaving(true);
      try {
        const res = await fetch(`/api/admin/support/${ticketId.trim()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Update failed");

        setTicket(data.ticket);
        showToast(`Status updated to ${newStatus.replace("-", " ")}`);
      } catch (e: any) {
        showToast(e.message || "Update failed", "error");
      } finally {
        setSaving(false);
      }
    },
    [ticket, ticketId, showToast],
  );

  // Update priority
  const handleUpdatePriority = useCallback(
    async (newPriority: string) => {
      if (!ticket) return;

      setSaving(true);
      try {
        const res = await fetch(`/api/admin/support/${ticketId.trim()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority: newPriority }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Update failed");

        setTicket(data.ticket);
        showToast(`Priority updated to ${newPriority}`);
      } catch (e: any) {
        showToast(e.message || "Update failed", "error");
      } finally {
        setSaving(false);
      }
    },
    [ticket, ticketId, showToast],
  );

  // Send reply
  const handleSendReply = useCallback(async () => {
    if (!ticket || !replyText.trim()) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/admin/support/${ticketId.trim()}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send reply");

      setTicket(data.ticket);
      setReplyText("");
      showToast("Reply sent successfully");
    } catch (e: any) {
      showToast(e.message || "Failed to send reply", "error");
    } finally {
      setReplying(false);
    }
  }, [ticket, ticketId, replyText, showToast]);

  // Delete ticket
  const handleDelete = useCallback(async () => {
    if (!ticket) return;

    try {
      const res = await fetch(`/api/admin/support/${ticketId.trim()}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      showToast("Ticket deleted successfully");
      router.push("/admin/support");
    } catch (e: any) {
      showToast(e.message || "Delete failed", "error");
      setConfirmDelete(false);
    }
  }, [ticket, ticketId, router, showToast]);

  const STATUSES = ["open", "in-progress", "resolved", "closed"];
  const PRIORITIES = ["low", "medium", "high", "urgent"];

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
          padding: "40px",
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #e8eaed",
              borderTopColor: "#1a73e8",
              borderRadius: "50%",
              animation: "spin .8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: T.sub }}>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: T.text,
              marginBottom: 8,
            }}
          >
            Ticket not found
          </h2>
          <p style={{ color: T.sub, marginBottom: 20 }}>
            The ticket you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/support"
            style={{ color: "#1a73e8", textDecoration: "none" }}
          >
            ← Back to Support Center
          </Link>
        </div>
      </div>
    );
  }

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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        textarea { font-family: inherit; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header with back button */}
        <div style={{ marginBottom: 24 }}>
          <Link
            href="/admin/support"
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
            {Ico.back} Back to Support Center
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
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
                  marginBottom: 6,
                }}
              >
                {ticket.ticketNumber ||
                  `#${ticket._id.slice(-8).toUpperCase()}`}
              </div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: T.text,
                  lineHeight: 1.3,
                }}
              >
                {ticket.subject}
              </h1>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
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
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}
        >
          {/* Left column - Conversation */}
          <div>
            {/* User info card */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `${priorityColor(ticket.priority)}20`,
                    color: priorityColor(ticket.priority),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {initials(ticket.userName)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>
                    {ticket.userName}
                  </div>
                  <div style={{ fontSize: 13, color: T.sub }}>
                    {ticket.userEmail}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 4,
                    }}
                  >
                    {Ico.clock} Created {fmtDate(ticket.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Original message */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.muted,
                  marginBottom: 12,
                }}
              >
                Original Message
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: T.text,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {ticket.message}
              </div>
            </div>

            {/* Replies */}
            {ticket.replies.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.muted,
                    marginBottom: 12,
                  }}
                >
                  Conversation ({ticket.replies.length})
                </div>
                {ticket.replies.map((reply, index) => (
                  <div
                    key={index}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 16,
                      padding: "16px 20px",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: reply.isAdmin
                            ? "rgba(26,115,232,0.1)"
                            : "rgba(95,99,104,0.1)",
                          color: reply.isAdmin ? "#1a73e8" : T.sub,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {reply.isAdmin ? "A" : initials(ticket.userName)}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: reply.isAdmin ? "#1a73e8" : T.text,
                        }}
                      >
                        {reply.isAdmin ? "Support Team" : ticket.userName}
                      </span>
                      <span style={{ fontSize: 11, color: T.muted }}>
                        · {timeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: T.text,
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {reply.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply box */}
            {ticket.status !== "closed" && (
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.muted,
                    marginBottom: 12,
                  }}
                >
                  Add Reply
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    background: T.input,
                    color: T.text,
                    fontSize: 14,
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#1a73e8")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || replying}
                  style={{
                    marginTop: 12,
                    padding: "10px 24px",
                    borderRadius: 40,
                    border: "none",
                    background:
                      !replyText.trim() || replying ? T.muted : "#1a73e8",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor:
                      !replyText.trim() || replying ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {replying ? (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #fff4",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin .7s linear infinite",
                      }}
                    />
                  ) : (
                    Ico.send
                  )}
                  {replying ? "Sending..." : "Send Reply"}
                </button>
              </div>
            )}
          </div>

          {/* Right column - Actions */}
          <div>
            {/* Status controls */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.muted,
                  marginBottom: 12,
                }}
              >
                Update Status
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(s)}
                    disabled={saving || ticket.status === s}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 40,
                      border: `2px solid ${ticket.status === s ? statusColor(s) : T.border}`,
                      background:
                        ticket.status === s ? statusBg(s) : "transparent",
                      color: ticket.status === s ? statusColor(s) : T.sub,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor:
                        saving || ticket.status === s ? "default" : "pointer",
                      textTransform: "capitalize",
                      opacity: saving ? 0.6 : 1,
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
                borderRadius: 16,
                padding: "20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.muted,
                  marginBottom: 12,
                }}
              >
                Update Priority
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleUpdatePriority(p)}
                    disabled={saving || ticket.priority === p}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 40,
                      border: `2px solid ${ticket.priority === p ? priorityColor(p) : T.border}`,
                      background:
                        ticket.priority === p ? priorityBg(p) : "transparent",
                      color: ticket.priority === p ? priorityColor(p) : T.sub,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor:
                        saving || ticket.priority === p ? "default" : "pointer",
                      textTransform: "capitalize",
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "20px",
              }}
            >
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 40,
                    border: "1px solid rgba(217,48,37,0.3)",
                    background: "rgba(217,48,37,0.05)",
                    color: "#d93025",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {Ico.trash} Delete Ticket
                </button>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#d93025",
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    Delete this ticket?
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={handleDelete}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 30,
                        border: "none",
                        background: "#d93025",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 30,
                        border: `1px solid ${T.border}`,
                        background: "transparent",
                        color: T.sub,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
