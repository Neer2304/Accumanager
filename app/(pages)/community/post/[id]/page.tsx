// app/community/post/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container, Paper, Typography, Box, Button, Chip, Stack,
  Avatar, IconButton, TextField, CircularProgress, useTheme,
  alpha, Tooltip, Divider, Menu, MenuItem,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack, ThumbUp, ThumbUpOutlined, Bookmark, BookmarkBorder,
  Share, Comment as CommentIcon, Send, CheckCircle, AccessTime,
  Visibility, MoreVert, Edit, Delete, Lock,
  ExpandMore, ExpandLess, Check, EmojiEmotions,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import { useCommunity } from "@/hooks/useCommunity";

// ─── Theme helper ─────────────────────────────────────────────────────────────
const useColors = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return {
    dark,
    bg:       dark ? "#18191a" : "#f0f2f5",
    surface:  dark ? "#242526" : "#ffffff",
    surface2: dark ? "#3a3b3c" : "#f0f2f5",
    border:   dark ? "#3e4042" : "#e4e6ea",
    ink:      dark ? "#e4e6eb" : "#050505",
    inkSub:   dark ? "#b0b3b8" : "#65676b",
    inkMuted: dark ? "#6a6d73" : "#8a8d91",
    blue:     "#1877f2",
    blueSoft: dark ? "rgba(24,119,242,0.15)" : "rgba(24,119,242,0.08)",
    green:    dark ? "#45bd62" : "#31a24c",
    red:      dark ? "#f28b82" : "#e41e3f",
    redSoft:  dark ? "rgba(242,139,130,0.12)" : "rgba(228,30,63,0.06)",
  };
};

// ─── Deterministic avatar color ───────────────────────────────────────────────
const AVATAR_COLORS = ["#1877f2","#e91e63","#9c27b0","#ff9800","#4caf50","#00bcd4","#ff5722","#607d8b"];
function avatarColor(name: string) { return AVATAR_COLORS[(name || "U").charCodeAt(0) % AVATAR_COLORS.length]; }

function UserAvatar({ name, src, size = 40, onClick }: {
  name?: string; src?: string; size?: number; onClick?: () => void;
}) {
  const c = useColors();
  const initials = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Avatar src={src || undefined} onClick={onClick}
      sx={{
        width: size, height: size, bgcolor: avatarColor(name || "U"),
        fontSize: size * 0.38, fontWeight: 700,
        cursor: onClick ? "pointer" : "default",
        border: `2px solid ${c.surface}`,
        flexShrink: 0,
        transition: "transform 0.15s",
        "&:hover": onClick ? { transform: "scale(1.06)" } : {},
      }}>
      {!src && initials}
    </Avatar>
  );
}

// ─── Animated like button ─────────────────────────────────────────────────────
function LikeButton({ liked, count, loading, onClick }: {
  liked: boolean; count: number; loading: boolean; onClick: () => void;
}) {
  const c = useColors();
  const [pop, setPop] = useState(false);
  const handle = () => {
    if (!liked) { setPop(true); setTimeout(() => setPop(false), 350); }
    onClick();
  };
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {pop && <Box sx={{
        position: "absolute", inset: -4, borderRadius: "50%",
        bgcolor: alpha(c.blue, 0.18), pointerEvents: "none",
        animation: "popout 0.35s ease-out forwards",
        "@keyframes popout": {
          "0%":   { transform: "scale(0.6)", opacity: 1 },
          "100%": { transform: "scale(2.4)", opacity: 0 },
        },
      }} />}
      <Button onClick={handle} disabled={loading}
        startIcon={liked
          ? <ThumbUp sx={{ fontSize: 18, color: c.blue,
              animation: liked && pop ? "thumbpop 0.3s ease" : "none",
              "@keyframes thumbpop": { "50%": { transform: "scale(1.4)" } } }} />
          : <ThumbUpOutlined sx={{ fontSize: 18 }} />}
        sx={{
          color: liked ? c.blue : c.inkSub,
          fontWeight: liked ? 700 : 500, fontSize: "0.9rem",
          borderRadius: "8px", px: 1.5, py: 0.75, minWidth: 0,
          transition: "all 0.2s",
          "&:hover": { bgcolor: liked ? alpha(c.blue, 0.08) : alpha(c.ink, 0.06) },
        }}>
        {liked ? "Liked" : "Like"}{count > 0 ? ` · ${count}` : ""}
      </Button>
    </Box>
  );
}

// ─── Comment action menu ──────────────────────────────────────────────────────
function CommentMenu({ isOwn, onEdit, onDelete }: {
  isOwn: boolean; onEdit: () => void; onDelete: () => void;
}) {
  const c = useColors();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  
  // Don't show anything if not the owner
  if (!isOwn) return null;
  
  return (
    <>
      <IconButton 
        size="small" 
        onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}
        sx={{ 
          color: c.inkMuted,
          '&:hover': { 
            backgroundColor: alpha(c.ink, 0.08),
            color: c.blue 
          }
        }}
      >
        <MoreVert sx={{ fontSize: 18 }} />
      </IconButton>
      <Menu 
        anchorEl={anchor} 
        open={Boolean(anchor)} 
        onClose={() => setAnchor(null)}
        PaperProps={{ 
          sx: { 
            borderRadius: "12px", 
            bgcolor: c.surface, 
            border: `1px solid ${c.border}`, 
            minWidth: 148, 
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)" 
          } 
        }}
      >
        <MenuItem 
          onClick={() => { 
            onEdit(); 
            setAnchor(null); 
          }}
          sx={{ 
            gap: 1.5, 
            fontSize: "0.88rem", 
            color: c.ink, 
            borderRadius: "8px", 
            mx: 0.5,
            '&:hover': { backgroundColor: alpha(c.blue, 0.08) }
          }}
        >
          <Edit sx={{ fontSize: 16 }} /> Edit
        </MenuItem>
        <MenuItem 
          onClick={() => { 
            onDelete(); 
            setAnchor(null); 
          }}
          sx={{ 
            gap: 1.5, 
            fontSize: "0.88rem", 
            color: c.red, 
            borderRadius: "8px", 
            mx: 0.5,
            '&:hover': { backgroundColor: alpha(c.red, 0.08) }
          }}
        >
          <Delete sx={{ fontSize: 16 }} /> Delete
        </MenuItem>
      </Menu>
    </>
  );
}

// ─── Comment card ─────────────────────────────────────────────────────────────
function CommentCard({
  comment, currentUserId, postAuthorId, postId, isSolved,
  onMarkSolution, onDelete, onEdit,
}: {
  comment: any; currentUserId: string | null; postAuthorId: string;
  postId: string; isSolved: boolean;
  onMarkSolution: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}) {
  const c = useColors();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  // Safe ID extraction
  const commentId = comment._id?.toString() || comment.id?.toString() || '';
  
  // Get user ID from multiple possible locations
  const commentUserId = comment.user?._id?.toString() || 
                        comment.user?.toString() || 
                        comment.userId?.toString() || 
                        '';
  
  const isOwn = !!currentUserId && currentUserId === commentUserId;
  const isPostAuthor = !!currentUserId && currentUserId === postAuthorId;

  // Get display name
  const displayName = comment.userName && comment.userName !== "User" && comment.userName.length > 2
    ? comment.userName
    : commentUserId ? `User_${commentUserId.slice(-5)}` : "Anonymous";

  const handleSave = async () => {
    if (!editText.trim() || editText === comment.content) { 
      setEditing(false); 
      return; 
    }
    setSaving(true);
    await onEdit(commentId, editText.trim());
    setSaving(false); 
    setEditing(false);
  };

  const handleDelete = () => {
    if (commentId && confirm('Are you sure you want to delete this comment?')) {
      onDelete(commentId);
    }
  };

  const handleMarkSolution = () => {
    if (commentId) {
      onMarkSolution(commentId);
    }
  };

  return (
    <Box sx={{
      display: "flex", 
      gap: 1.5, 
      p: "8px 10px", 
      borderRadius: "12px",
      borderLeft: comment.isSolution ? `3px solid ${c.green}` : "3px solid transparent",
      bgcolor: comment.isSolution ? alpha(c.green, 0.04) : "transparent",
      transition: "background 0.15s",
      '&:hover': { 
        bgcolor: comment.isSolution ? alpha(c.green, 0.06) : alpha(c.ink, 0.025) 
      },
    }}>
      <UserAvatar 
        name={displayName} 
        src={comment.userAvatar} 
        size={34}
        onClick={() => commentUserId && router.push(`/community/profile/${commentUserId}`)} 
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
            <Typography 
              onClick={() => commentUserId && router.push(`/community/profile/${commentUserId}`)}
              sx={{ 
                fontWeight: 700, 
                fontSize: "0.875rem", 
                color: c.ink,
                cursor: "pointer", 
                "&:hover": { textDecoration: "underline" } 
              }}
            >
              {displayName}
            </Typography>
            {comment.isSolution && (
              <Chip 
                icon={<CheckCircle sx={{ fontSize: "11px !important" }} />} 
                label="Solution"
                size="small" 
                sx={{ 
                  bgcolor: c.green, 
                  color: "#fff", 
                  height: 18, 
                  fontSize: "0.62rem", 
                  fontWeight: 700 
                }} 
              />
            )}
            <Typography sx={{ fontSize: "0.72rem", color: c.inkMuted }}>
              {formatDate(comment.createdAt)}
              {comment.editedAt && " · edited"}
            </Typography>
          </Box>
          
          <CommentMenu 
            isOwn={isOwn}
            onEdit={() => { 
              setEditing(true); 
              setEditText(comment.content); 
            }}
            onDelete={handleDelete} 
          />
        </Box>

        {editing ? (
          <Box sx={{ mt: 0.75 }}>
            <TextField 
              fullWidth 
              multiline 
              size="small" 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleSave(); }}
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  borderRadius: "10px", 
                  bgcolor: c.surface2,
                  "& fieldset": { borderColor: c.blue } 
                } 
              }} 
            />
            <Box sx={{ display: "flex", gap: 1, mt: 0.75 }}>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleSave} 
                disabled={saving}
                sx={{ 
                  borderRadius: "8px", 
                  bgcolor: c.blue, 
                  textTransform: "none", 
                  fontSize: "0.8rem", 
                  px: 2 
                }}
              >
                {saving ? <CircularProgress size={12} sx={{ color: "#fff" }} /> : "Save"}
              </Button>
              <Button 
                size="small" 
                onClick={() => setEditing(false)}
                sx={{ 
                  borderRadius: "8px", 
                  textTransform: "none", 
                  fontSize: "0.8rem", 
                  color: c.inkSub 
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography sx={{ 
            fontSize: "0.9rem", 
            color: c.ink, 
            lineHeight: 1.6,
            wordBreak: "break-word", 
            mt: 0.25 
          }}>
            {comment.content}
          </Typography>
        )}

        {!editing && !isSolved && isPostAuthor && !isOwn && (
          <Button 
            size="small" 
            startIcon={<CheckCircle sx={{ fontSize: 13 }} />}
            onClick={handleMarkSolution}
            sx={{ 
              mt: 0.5, 
              color: c.green, 
              fontSize: "0.78rem", 
              textTransform: "none",
              borderRadius: "8px", 
              px: 1, 
              py: 0.25, 
              "&:hover": { bgcolor: alpha(c.green, 0.07) } 
            }}
          >
            Mark as solution
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const c = useColors();
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const { post: hookPost, loading, error, fetchPost, toggleLike, addComment, toggleBookmark, markAsSolution } = useCommunity();

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      await fetchPost(id);
      const token = document.cookie.match(/auth_token=([^;]+)/)?.[1];
      if (token) {
        try { 
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setCurrentUserId(decoded.userId); 
        }
        catch { /* ignore */ }
      }
    };
    init();
  }, [params, fetchPost]);

  const post = hookPost as any;

  const act = useCallback(async (fn: () => Promise<void>) => {
    if (actionLoading) return;
    setActionLoading(true);
    try { await fn(); } finally { setActionLoading(false); }
  }, [actionLoading]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!post?._id) return;
    const res = await fetch(`/api/community/${post._id}/comments/${commentId}`, { 
      method: "DELETE", 
      credentials: "include" 
    });
    const data = await res.json();
    if (data.success) fetchPost(post._id);
  }, [post, fetchPost]);

  const handleEditComment = useCallback(async (commentId: string, content: string) => {
    if (!post?._id) return;
    const res = await fetch(`/api/community/${post._id}/comments/${commentId}`, {
      method: "PUT", 
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (data.success) fetchPost(post._id);
  }, [post, fetchPost]);

  if (loading) return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {[400, 60, 200].map((h, i) => (
          <Skeleton key={i} variant="rounded" height={h} sx={{ borderRadius: "16px", mb: 2 }} />
        ))}
      </Container>
    </Box>
  );

  if (error || !post) return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ color: c.inkSub, mb: 2 }}>{error || "Post not found"}</Typography>
        <Button component={Link} href="/community" startIcon={<ArrowBack />} sx={{ color: c.blue }}>
          Back to Community
        </Button>
      </Box>
    </Box>
  );

  const authorId = post.author?._id?.toString() || post.author?.toString() || "";
  const isLiked = currentUserId
    ? (post.likes || []).some((id: any) => (id?._id || id)?.toString() === currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? (post.bookmarks || []).some((id: any) => (id?._id || id)?.toString() === currentUserId)
    : false;
  const comments = post.comments || [];
  const visible = showAll ? comments : comments.slice(0, 5);
  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/community/post/${post._id}` : "";

  const CAT_COLOR: Record<string, string> = {
    general:"#1877f2", questions:"#0288d1", tips:"#388e3c",
    bugs:"#d32f2f", features:"#f57c00", announcements:"#7b1fa2",
  };
  const catColor = CAT_COLOR[post.category] || c.blue;

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: "100vh" }}>
      {/* Sticky top bar */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 100,
        bgcolor: alpha(c.surface, 0.95), borderBottom: `1px solid ${c.border}`,
        backdropFilter: "blur(10px)" }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}>
            <IconButton size="small" onClick={() => router.back()}
              sx={{ bgcolor: c.surface2, color: c.ink, "&:hover": { bgcolor: c.border } }}>
              <ArrowBack sx={{ fontSize: 19 }} />
            </IconButton>
            <Typography sx={{ flex: 1, fontWeight: 600, fontSize: "0.93rem", color: c.ink,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {post.title}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy link"} arrow>
              <IconButton size="small" onClick={async () => {
                await navigator.clipboard.writeText(postUrl);
                setCopied(true); setTimeout(() => setCopied(false), 2000);
              }} sx={{ color: copied ? c.green : c.inkSub }}>
                {copied ? <Check sx={{ fontSize: 19 }} /> : <Share sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isBookmarked ? "Saved" : "Save"} arrow>
              <IconButton size="small" onClick={() => act(() => toggleBookmark(post._id))}
                sx={{ color: isBookmarked ? c.blue : c.inkSub }}>
                {isBookmarked ? <Bookmark sx={{ fontSize: 19 }} /> : <BookmarkBorder sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Post card */}
        <Paper sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: c.surface,
          border: `1px solid ${c.border}`, mb: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Box sx={{ height: 4, bgcolor: catColor }} />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Chips */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip label={post.category} size="small"
                sx={{ bgcolor: alpha(catColor, 0.1), color: catColor, fontWeight: 700, fontSize: "0.72rem" }} />
              {post.isPinned && <Chip label="📌 Pinned" size="small" sx={{ bgcolor: "#fbbc04", color: "#202124", fontWeight: 700 }} />}
              {post.isSolved && <Chip icon={<CheckCircle sx={{ fontSize: "13px !important" }} />} label="Solved" size="small" sx={{ bgcolor: c.green, color: "#fff", fontWeight: 700 }} />}
              {post.isLocked && <Chip icon={<Lock sx={{ fontSize: "13px !important" }} />} label="Locked" size="small" sx={{ bgcolor: c.inkMuted, color: "#fff" }} />}
            </Box>

            {/* Title */}
            <Typography sx={{ fontWeight: 800, color: c.ink, mb: 2.5, lineHeight: 1.2,
              fontSize: { xs: "1.35rem", sm: "1.75rem" }, letterSpacing: "-0.02em" }}>
              {post.title}
            </Typography>

            {/* Author row */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
                onClick={() => authorId && router.push(`/community/profile/${authorId}`)}>
                <UserAvatar name={post.authorName} size={44} />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: c.ink,
                    "&:hover": { textDecoration: "underline" } }}>
                    {post.authorName || "Anonymous"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 11, color: c.inkMuted }} />
                    <Typography sx={{ fontSize: "0.74rem", color: c.inkMuted }}>
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { icon: <Visibility sx={{ fontSize: 13 }} />, val: post.views },
                  { icon: <CommentIcon sx={{ fontSize: 13 }} />, val: post.commentCount || 0 },
                  { icon: <ThumbUp sx={{ fontSize: 13 }} />, val: post.likeCount || 0 },
                ].map((s, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5,
                    px: 1.25, py: 0.35, borderRadius: "20px", bgcolor: c.surface2 }}>
                    <Box sx={{ color: c.inkMuted }}>{s.icon}</Box>
                    <Typography sx={{ fontSize: "0.76rem", color: c.inkMuted }}>{s.val}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Content */}
            <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.85, color: c.ink,
              fontSize: { xs: "0.95rem", sm: "1rem" } }}>
              {post.content}
            </Typography>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2.5 }}>
                {post.tags.map((tag: string, i: number) => (
                  <Chip key={i} label={`#${tag}`} size="small" variant="outlined"
                    sx={{ borderColor: c.border, color: c.blue, fontSize: "0.78rem",
                      "&:hover": { bgcolor: c.blueSoft } }} />
                ))}
              </Box>
            )}
          </Box>

          {/* Action bar */}
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 1.25, borderTop: `1px solid ${c.border}`,
            display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
            <LikeButton liked={isLiked} count={post.likeCount || 0}
              loading={actionLoading} onClick={() => act(() => toggleLike(post._id))} />
            <Button startIcon={<CommentIcon sx={{ fontSize: 17 }} />}
              onClick={() => { setTimeout(() => commentRef.current?.focus(), 100); }}
              sx={{ color: c.inkSub, fontSize: "0.88rem", fontWeight: 500, textTransform: "none",
                borderRadius: "8px", px: 1.5, py: 0.75, "&:hover": { bgcolor: alpha(c.ink, 0.06) } }}>
              Comment
            </Button>
            <Button startIcon={<Share sx={{ fontSize: 17 }} />}
              onClick={async () => { await navigator.clipboard.writeText(postUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              sx={{ color: c.inkSub, fontSize: "0.88rem", fontWeight: 500, textTransform: "none",
                borderRadius: "8px", px: 1.5, py: 0.75, "&:hover": { bgcolor: alpha(c.ink, 0.06) } }}>
              {copied ? "Copied!" : "Share"}
            </Button>
          </Box>
        </Paper>

        {/* Comments card */}
        <Paper sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: c.surface,
          border: `1px solid ${c.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: c.ink, mb: 2.5 }}>
              {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </Typography>

            {/* Write comment */}
            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              <UserAvatar name="Me" size={36} />
              <Box sx={{ flex: 1 }}>
                <TextField fullWidth multiline minRows={1} maxRows={6}
                  placeholder="Write a comment… (Ctrl+Enter to post)"
                  value={commentText} inputRef={commentRef}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey && commentText.trim()) {
                    act(() => addComment(post._id, commentText.trim()).then(() => setCommentText("")));
                  }}}
                  sx={{ "& .MuiOutlinedInput-root": {
                    borderRadius: "22px", bgcolor: c.surface2, fontSize: "0.9rem",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: c.border },
                    "&.Mui-focused fieldset": { borderColor: c.blue, borderWidth: 1.5 },
                    "& .MuiOutlinedInput-input": { px: 2, py: 1 },
                  }}} />
                {commentText.trim() && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                    <Button size="small" onClick={() => setCommentText("")}
                      sx={{ color: c.inkSub, textTransform: "none", borderRadius: "8px" }}>Cancel</Button>
                    <Button size="small" variant="contained"
                      onClick={() => act(() => addComment(post._id, commentText.trim()).then(() => setCommentText("")))}
                      disabled={actionLoading}
                      startIcon={actionLoading ? <CircularProgress size={12} sx={{ color: "#fff" }} /> : <Send sx={{ fontSize: 14 }} />}
                      sx={{ bgcolor: c.blue, textTransform: "none", borderRadius: "8px",
                        "&:hover": { bgcolor: "#166fe5" } }}>
                      Post
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ borderColor: c.border, mb: 1.5 }} />

            {/* Comments list */}
            {comments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <EmojiEmotions sx={{ fontSize: 44, color: c.inkMuted, mb: 1.5 }} />
                <Typography sx={{ color: c.inkMuted }}>No comments yet — be the first!</Typography>
              </Box>
            ) : (
              <Stack spacing={0.25}>
                {visible.map((comment: any) => (
                  <CommentCard 
                    key={comment._id} 
                    comment={comment}
                    currentUserId={currentUserId} 
                    postAuthorId={authorId}
                    postId={post._id} 
                    isSolved={post.isSolved}
                    onMarkSolution={(id) => act(() => markAsSolution(post._id, id))}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment} 
                  />
                ))}
                {comments.length > 5 && (
                  <Button onClick={() => setShowAll(v => !v)}
                    startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                    sx={{ alignSelf: "flex-start", color: c.blue, textTransform: "none",
                      fontWeight: 600, fontSize: "0.85rem", borderRadius: "8px", mt: 0.5,
                      "&:hover": { bgcolor: c.blueSoft } }}>
                    {showAll ? "Show less" : `View ${comments.length - 5} more comment${comments.length - 5 !== 1 ? "s" : ""}`}
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}