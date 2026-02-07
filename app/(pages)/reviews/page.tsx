// app/reviews/page.tsx - Updated with fixes
"use client";

import React, { useState, useEffect, Suspense, lazy } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  Home as HomeIcon,
  RateReview,
  Star,
  Search,
  Add,
  Sort,
  FilterList,
} from "@mui/icons-material";
import Link from "next/link";

// Import our Google-themed components
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { LinearProgress } from "@/components/ui/Progress";
import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import { Rating } from "@mui/material";

// Import review components
import { ReviewStats } from "@/components/reviews/ReviewStats";
import { RatingDistribution } from "@/components/reviews/RatingDistribution";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { ReviewCTA } from "@/components/reviews/ReviewCTA";
import { EmptyReviews } from "@/components/reviews/EmptyReviews";

// Import types
import { Review } from "@/types/reviews";

// Create a custom Fade component that handles SSR
const SafeFade = ({ children, ...props }: any) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <>{children}</>;
  }
  
  return (
    <div style={{ opacity: 1, transition: 'opacity 300ms' }}>
      {children}
    </div>
  );
};

export default function ReviewsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const darkMode = theme.palette.mode === "dark";

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterSort, setFilterSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, [page, filterRating, filterSort]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = `/api/reviews?page=${page}&limit=10&sort=${filterSort}`;
      if (filterRating !== "all") url += `&rating=${filterRating}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reviews");
      }

      setReviews(data.reviews || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalReviews(data.pagination?.total || 0);
      setAverageRating(data.summary?.averageRating || 0);

      // Calculate rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.reviews?.forEach((review: Review) => {
        const rating = Math.round(review.rating);
        if (rating >= 1 && rating <= 5) {
          distribution[rating as keyof typeof distribution]++;
        }
      });
      setRatingDistribution(distribution);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/reviews/add");
      return;
    }
    router.push("/reviews/add");
  };

  // Fix for Select component - wrap onChange handler
  const handleFilterRatingChange = (e: any) => {
    setFilterRating(e.target.value);
  };

  const handleFilterSortChange = (e: any) => {
    setFilterSort(e.target.value);
  };

  return (
    <MainLayout title="Customer Reviews">
      <Box
        sx={{
          backgroundColor: darkMode ? "#202124" : "#ffffff",
          color: darkMode ? "#e8eaed" : "#202124",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            borderBottom: darkMode ? "1px solid #3c4043" : "1px solid #dadce0",
            background: darkMode
              ? "linear-gradient(135deg, #0d3064 0%, #202124 100%)"
              : "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          }}
        >
          <SafeFade>
            <Breadcrumbs
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
              }}
            >
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 300,
                  "&:hover": { color: darkMode ? "#8ab4f8" : "#1a73e8" },
                }}
              >
                <HomeIcon
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  }}
                />
                Dashboard
              </MuiLink>
              <Typography
                color={darkMode ? "#e8eaed" : "#202124"}
                fontWeight={400}
              >
                Customer Reviews
              </Typography>
            </Breadcrumbs>
          </SafeFade>

          <SafeFade>
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2, md: 3 },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                fontWeight={500}
                gutterBottom
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Customer Reviews
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                  fontWeight: 300,
                  fontSize: { xs: "0.85rem", sm: "1rem", md: "1.125rem" },
                  lineHeight: 1.5,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Read what our customers say about their experience
              </Typography>

              {/* Stats */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <CircularProgress sx={{ color: "#4285f4" }} />
                </Box>
              ) : (
                <ReviewStats
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                />
              )}
            </Box>
          </SafeFade>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Error Alert */}
          {error && (
            <SafeFade>
              <Alert
                severity="error"
                title="Error"
                message={error}
                dismissible
                onDismiss={() => setError("")}
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              />
            </SafeFade>
          )}

          {/* Filters */}
          <SafeFade>
            <Card
              title="Filter Reviews"
              subtitle="Find specific reviews by rating or search term"
              hover
              sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
            >
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search />}
                  size="small"
                  sx={{ flex: 1 }}
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Select
                    size="small"
                    label="Rating"
                    value={filterRating}
                    onChange={handleFilterRatingChange}
                    options={[
                      { value: "all", label: "All Ratings" },
                      { value: "5", label: "⭐⭐⭐⭐⭐ 5 Stars" },
                      { value: "4", label: "⭐⭐⭐⭐ 4 Stars" },
                      { value: "3", label: "⭐⭐⭐ 3 Stars" },
                      { value: "2", label: "⭐⭐ 2 Stars" },
                      { value: "1", label: "⭐ 1 Star" },
                    ]}
                    sx={{ minWidth: 140 }}
                  />

                  <Select
                    size="small"
                    label="Sort By"
                    value={filterSort}
                    onChange={handleFilterSortChange}
                    options={[
                      { value: "newest", label: "Newest First" },
                      { value: "rating", label: "Highest Rating" },
                      { value: "helpful", label: "Most Helpful" },
                    ]}
                    sx={{ minWidth: 140 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    iconLeft={<Search />}
                  >
                    Search
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleWriteReview}
                    size="medium"
                    iconLeft={<Add />}
                    color="secondary"
                  >
                    Write Review
                  </Button>
                </Box>
              </Box>
            </Card>
          </SafeFade>

          {/* Rating Distribution */}
          {!loading && totalReviews > 0 && (
            <SafeFade>
              <Card
                title="Rating Distribution"
                hover
                sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
              >
                <RatingDistribution
                  distribution={ratingDistribution}
                  totalReviews={totalReviews}
                />
              </Card>
            </SafeFade>
          )}

          {/* Reviews List */}
          <SafeFade>
            <Box>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mb: 4,
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <Card key={i} hover sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CircularProgress size={20} sx={{ color: "#4285f4" }} />
                        <Typography variant="body2" color="text.secondary">
                          Loading reviews...
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              ) : reviews.length === 0 ? (
                <EmptyReviews
                  searchTerm={searchTerm}
                  onWriteReview={handleWriteReview}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    {reviews.map((review) => (
                      <ReviewItem key={review._id} review={review} />
                    ))}
                  </Box>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                    >
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        showFirstButton
                        showLastButton
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: darkMode ? "#e8eaed" : "#202124",
                            "&.Mui-selected": {
                              backgroundColor: "#4285f4",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#3367d6",
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </SafeFade>

          {/* CTA */}
          <SafeFade>
            <ReviewCTA
              isAuthenticated={isAuthenticated}
              onWriteReview={handleWriteReview}
            />
          </SafeFade>
        </Container>
      </Box>
    </MainLayout>
  );
}