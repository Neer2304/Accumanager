"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import {
  Download,
  Assessment,
  TrendingUp,
  People,
  TaskAlt,
  Schedule,
  FilterList,
  Refresh,
  CalendarToday,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";

export default function TeamReportsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const darkMode = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("performance");
  const [dateRange, setDateRange] = useState("month");

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    console.log("Exporting report:", reportType);
  };

  return (
    <MainLayout title="Team Reports">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3
          }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Team Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Generate and analyze team performance reports
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={generateReport}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Refresh Data'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={exportReport}
                disabled={loading}
              >
                Export Report
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Report Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <FilterList sx={{ verticalAlign: 'middle', mr: 1 }} />
              Report Settings
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: 3,
              mb: 2
            }}>
              <Box sx={{ flex: '1 1 250px' }}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="performance">Performance Report</MenuItem>
                    <MenuItem value="attendance">Attendance Report</MenuItem>
                    <MenuItem value="productivity">Productivity Report</MenuItem>
                    <MenuItem value="tasks">Tasks Report</MenuItem>
                    <MenuItem value="budget">Budget Report</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: '1 1 250px' }}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    label="Date Range"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="week">Last 7 Days</MenuItem>
                    <MenuItem value="month">Last 30 Days</MenuItem>
                    <MenuItem value="quarter">Last Quarter</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {dateRange === 'custom' && (
                <>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={generateReport}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3 
        }}>
          {/* Report Types */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  <Assessment sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Available Reports
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Connect to your backend API to generate real team reports. Reports will be available after API integration.
                </Alert>

                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 2 
                }}>
                  <Box sx={{ 
                    flex: '1 1 250px',
                    minWidth: { xs: '100%', sm: '250px' }
                  }}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? '#303134' : '#f8f9fa'
                        }
                      }}
                      onClick={() => setReportType('performance')}
                    >
                      <TrendingUp sx={{ fontSize: 40, color: '#4285f4', mb: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Performance Report
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team performance metrics and analytics
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ 
                    flex: '1 1 250px',
                    minWidth: { xs: '100%', sm: '250px' }
                  }}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? '#303134' : '#f8f9fa'
                        }
                      }}
                      onClick={() => setReportType('attendance')}
                    >
                      <People sx={{ fontSize: 40, color: '#34a853', mb: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Attendance Report
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team attendance and availability
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ 
                    flex: '1 1 250px',
                    minWidth: { xs: '100%', sm: '250px' }
                  }}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? '#303134' : '#f8f9fa'
                        }
                      }}
                      onClick={() => setReportType('tasks')}
                    >
                      <TaskAlt sx={{ fontSize: 40, color: '#fbbc05', mb: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Tasks Report
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Task completion and productivity
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ 
                    flex: '1 1 250px',
                    minWidth: { xs: '100%', sm: '250px' }
                  }}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? '#303134' : '#f8f9fa'
                        }
                      }}
                      onClick={() => setReportType('budget')}
                    >
                      <CalendarToday sx={{ fontSize: 40, color: '#ea4335', mb: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Budget Report
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team expenses and budget utilization
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Export Options */}
          <Box sx={{ width: { xs: '100%', md: '350px' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Export Options
                </Typography>

                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => exportReport()}
                  >
                    Export as PDF
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => exportReport()}
                  >
                    Export as Excel
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => exportReport()}
                  >
                    Export as CSV
                  </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> Reports require backend API integration. Configure your API endpoints to enable report generation.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}