import { Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// components/ReviewPrompt.tsx
export function ReviewPrompt() {
  const [open, setOpen] = useState(false);
  
  // Show after 7 days of usage
  useEffect(() => {
    const hasReviewed = localStorage.getItem('has_reviewed');
    const daysSinceSignup = // calculate days
    
    if (!hasReviewed && daysSinceSignup >= 7) {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>How's Your Experience?</DialogTitle>
      <DialogContent>
        <Typography>
          You've been using AccuManage for a week! We'd love to hear your feedback.
        </Typography>
        <Button component={Link} href="/reviews/submit">
          Write a Review
        </Button>
      </DialogContent>
    </Dialog>
  );
}