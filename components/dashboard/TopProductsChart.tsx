import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  Inventory as ProductIcon,
  Refresh,
} from "@mui/icons-material";
import { ProductSalesData } from "@/types";

interface TopProductsChartProps {
  data?: ProductSalesData[];
}

interface ProductStats {
  _id: string;
  name: string;
  totalSales: number;
  totalRevenue: number;
  stock: number;
  category: string;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data: propData,
}) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [productsData, setProductsData] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // If data is passed as prop, use it
      if (propData && propData.length > 0) {
        console.log("📊 Using prop data for top products:", propData);
        setProductsData(
          propData.map((item, index) => ({
            _id:
              item.id ||
              item.productId ||
              `${item.productName}_${index}_${Date.now()}`,
            name: item.productName || "Unknown Product",
            totalSales: item.sales || 0,
            totalRevenue: item.revenue || 0,
            stock: 0,
            category: "",
          })),
        );
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      console.log("📊 Fetching top products from API...");
      const response = await fetch("/api/dashboard/top-products", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Top products data received:", data);

      if (data && Array.isArray(data)) {
        const productsWithUniqueIds = data.map((item, index) => ({
          ...item,
          _id: item._id || `product_${index}_${Date.now()}`,
        }));
        setProductsData(productsWithUniqueIds);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err: any) {
      console.error("❌ Error fetching top products:", err);
      setError(err.message || "Failed to load top products data");
      setProductsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, [propData]);

  const getStockColor = (stock: number) => {
    if (stock === 0) return "#ea4335";
    if (stock < 10) return "#fbbc04";
    return "#34a853";
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  const handleRefresh = () => {
    fetchTopProducts();
  };

  if (loading) {
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          backgroundColor: darkMode ? "#303134" : "#ffffff",
          border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 1.5, sm: 2 },
          }}
        >
          <CircularProgress
            size={isMobile ? 24 : 32}
            sx={{ color: darkMode ? "#8ab4f8" : "#4285f4" }}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              color: darkMode ? "#9aa0a6" : "#5f6368",
            }}
          >
            Loading top products...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        backgroundColor: darkMode ? "#303134" : "#ffffff",
        border: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 1.5, sm: 2 },
          "&:last-child": { pb: { xs: 1.5, sm: 2 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp
              sx={{
                fontSize: { xs: 20, sm: 24 },
                color: "#4285f4",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                color: darkMode ? "#e8eaed" : "#202124",
              }}
            >
              Top Products
            </Typography>
          </Box>
          <Tooltip title="Refresh data">
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={loading}
              sx={{ color: darkMode ? "#9aa0a6" : "#5f6368" }}
            >
              <Refresh fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Loading Progress */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              py: { xs: 0.5, sm: 1 },
              backgroundColor: darkMode
                ? alpha("#ea4335", 0.1)
                : alpha("#ea4335", 0.05),
              border: `1px solid ${darkMode ? alpha("#ea4335", 0.3) : alpha("#ea4335", 0.2)}`,
              color: darkMode ? "#f28b82" : "#ea4335",
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            minHeight: isMobile ? 180 : 200,
            maxHeight: { xs: 280, sm: 320, md: 360, lg: 440 }, // Fixed height to enable scroll
            overflow: "auto", // Show scrollbar when content exceeds height
            pr: 0.5, // Small padding for scrollbar
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: darkMode ? "#3c4043" : "#f1f3f4",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: darkMode ? "#9aa0a6" : "#5f6368",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: darkMode ? "#dadce0" : "#202124",
            },
          }}
        >
          {productsData.length > 0 ? (
            <List
              dense
              sx={{
                height: "100%",
                pt: 0,
              }}
            >
              {productsData.slice(0, 7).map((product, index) => (
                <ListItem
                  key={`${product._id}_${index}`}
                  divider={index !== 6}
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    px: 0,
                    "&:last-child": { borderBottom: "none" },
                    borderColor: darkMode ? "#3c4043" : "#dadce0",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.875rem",
                            md: "0.9rem",
                          },
                          lineHeight: 1.3,
                          flex: 1,
                          color: darkMode ? "#e8eaed" : "#202124",
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          minWidth: 32,
                          height: 24,
                          fontSize: "0.7rem",
                          backgroundColor:
                            index < 3
                              ? darkMode
                                ? alpha("#4285f4", 0.2)
                                : alpha("#4285f4", 0.1)
                              : darkMode
                                ? "#3c4043"
                                : "#f1f3f4",
                          color:
                            index < 3
                              ? darkMode
                                ? "#8ab4f8"
                                : "#4285f4"
                              : darkMode
                                ? "#9aa0a6"
                                : "#5f6368",
                          border:
                            index < 3
                              ? `1px solid ${darkMode ? alpha("#4285f4", 0.3) : alpha("#4285f4", 0.2)}`
                              : `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                        }}
                      />
                    </Box>

                    {product.category && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.25,
                          display: "block",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: darkMode ? "#9aa0a6" : "#5f6368",
                        }}
                      >
                        {product.category}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 0.5,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight="medium"
                        sx={{
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: darkMode ? "#8ab4f8" : "#4285f4",
                        }}
                      >
                        Sold: {product.totalSales}
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight="medium"
                        sx={{
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          color: darkMode ? "#81c995" : "#34a853",
                        }}
                      >
                        ₹{product.totalRevenue.toLocaleString()}
                      </Typography>
                      {product.stock > 0 && (
                        <Chip
                          label={getStockText(product.stock)}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: { xs: "0.6rem", sm: "0.65rem" },
                            fontWeight: "bold",
                            borderColor: getStockColor(product.stock),
                            color: getStockColor(product.stock),
                            backgroundColor: darkMode
                              ? alpha(getStockColor(product.stock), 0.1)
                              : alpha(getStockColor(product.stock), 0.05),
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </ListItem>
              ))}

              {/* Show count of remaining items if more than 7 */}
              {productsData.length > 7 && (
                <ListItem
                  sx={{
                    py: 1,
                    px: 0,
                    justifyContent: "center",
                    borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: darkMode ? "#8ab4f8" : "#4285f4",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  >
                    + {productsData.length - 7} more products
                  </Typography>
                </ListItem>
              )}
            </List>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                py: { xs: 3, sm: 4 },
              }}
            >
              <ProductIcon
                sx={{
                  fontSize: { xs: 36, sm: 48 },
                  color: darkMode ? "#5f6368" : "#9aa0a6",
                  mb: 1,
                  opacity: 0.5,
                }}
              />
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                No product sales data available
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  maxWidth: 200,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  color: darkMode ? "#5f6368" : "#9aa0a6",
                }}
              >
                {error
                  ? "Unable to load product data. Please try again."
                  : "Complete some orders to see your top products here."}
              </Typography>
            </Box>
          )}
        </Box>
        {/* Summary */}
        {productsData.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${darkMode ? "#3c4043" : "#dadce0"}`,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                display="block"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  color: darkMode ? "#9aa0a6" : "#5f6368",
                }}
              >
                Total: {productsData.length} products
              </Typography>
              {productsData[0]?.totalSales > 0 && (
                <Typography
                  variant="caption"
                  fontWeight="medium"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    color: darkMode ? "#8ab4f8" : "#4285f4",
                  }}
                >
                  Top: {productsData[0]?.name}
                </Typography>
              )}
            </Box>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                backgroundColor: darkMode
                  ? alpha("#34a853", 0.2)
                  : alpha("#34a853", 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                color: darkMode ? "#81c995" : "#34a853",
              }}
            >
              ₹
              {productsData
                .reduce((sum, product) => sum + product.totalRevenue, 0)
                .toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;
