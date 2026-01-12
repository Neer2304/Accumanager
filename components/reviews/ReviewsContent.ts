export const REVIEWS_CONTENT = {
  header: {
    title: "Customer Reviews",
    subtitle: "Share your experience with AccumaManage",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },

  form: {
    title: "Write a Review",
    userReviewTitle: "Your Review",
    statusMessages: {
      approved: "Your review has been approved and is visible to everyone.",
      pending: "Your review is under review and will be visible once approved.",
      rejected: "Your review was rejected. Please contact support for more information."
    }
  },

  rating: {
    label: "Overall Rating *",
    placeholder: "Select rating"
  },

  title: {
    label: "Review Title *",
    placeholder: "Brief summary of your experience"
  },

  comment: {
    label: "Your Review *",
    placeholder: "Share details of your experience with AccumaManage...",
    helperText: "characters"
  },

  buttons: {
    submit: "Submit Review",
    update: "Update Review",
    edit: "Edit Review",
    delete: "Delete Review",
    cancel: "Cancel Edit",
    helpful: "Helpful",
    loading: "Submitting..."
  },

  status: {
    approved: "Approved",
    pending: "Under Review",
    rejected: "Rejected"
  },

  deleteDialog: {
    title: "Delete Review",
    message: "Are you sure you want to delete your review? This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Delete Review"
  },

  guidelines: {
    title: "💡 Review Guidelines",
    items: [
      "Be specific about your experience",
      "Mention specific features you like",
      "Share how it helped your business",
      "Keep it honest and constructive",
      "No offensive language"
    ]
  },

  importance: {
    title: "🌟 Why Your Review Matters",
    description: "Your feedback helps us improve AccumaManage and helps other businesses make informed decisions.",
    trustedBy: "Trusted by 500+ Indian Businesses"
  },

  features: {
    title: "🚀 Consider Mentioning",
    tags: [
      "GST Invoicing",
      "Inventory Management",
      "Event Tracking",
      "Customer Management",
      "Mobile App",
      "Support Quality",
      "Ease of Use",
      "Value for Money",
      "Reporting Features",
      "Integration Capabilities"
    ]
  },

  recentReviews: {
    title: "Recent Reviews from Our Users"
  },

  messages: {
    success: {
      submit: "Review submitted successfully! It will be visible after approval.",
      update: "Review updated successfully! It will be visible after approval.",
      delete: "Review deleted successfully"
    },
    error: {
      submit: "Failed to submit review",
      delete: "Failed to delete review",
      generic: "An error occurred"
    }
  },

  validation: {
    ratingRequired: "Please select a rating",
    titleRequired: "Please enter a review title",
    commentRequired: "Please enter your review",
    commentMaxLength: 1000
  }
};