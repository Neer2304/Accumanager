// // app/team/activity/page.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Card,
//   CardContent,
//   Chip,
//   Button,
//   IconButton,
//   Tooltip,
//   Container,
//   alpha,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   LinearProgress,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Refresh,
//   Add,
//   Groups,
//   TrendingUp,
//   Task,
//   Computer,
//   Person,
//   Construction,
//   Rocket,
//   Notifications,
//   Download,
//   Share,
// } from '@mui/icons-material';
// import { MainLayout } from '@/components/Layout/MainLayout';
// import { teamActivityService } from '@/services/teamActivityService';
// import { TeamMemberCard } from '@/components/team/TeamMemberCard';
// import { ActivityCard } from '@/components/team/ActivityCard';
// import { Card2 } from '@/components/ui/card2';
// import { Button2 } from '@/components/ui/button2';
// import { Alert2 } from '@/components/ui/alert2';
// import { SkeletonCard, MessageListSkeleton } from '@/components/ui/skeleton2';
// import { TeamMember, Activity } from '@/types/teamActivity';

// export default function TeamActivityPage() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
//   const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [autoRefresh, setAutoRefresh] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const fetchTeamData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [members, activities] = await Promise.all([
//         teamActivityService.fetchTeamMembers(),
//         teamActivityService.fetchRecentActivities(),
//       ]);
//       setTeamMembers(members);
//       setRecentActivities(activities);
//     } catch (err) {
//       setError('Failed to load team data. Please try again.');
//       console.error('Error fetching team data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamData();
//   }, []);

//   useEffect(() => {
//     if (autoRefresh) {
//       const interval = setInterval(fetchTeamData, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [autoRefresh]);

//   const handleAddMember = async () => {
//     try {
//       setLoading(true);
//       const newMember = await teamActivityService.addTeamMember({
//         name: 'New Team Member',
//         email: 'new@example.com',
//         role: 'Team Member',
//         currentProjects: ['Onboarding'],
//       });
//       setTeamMembers(prev => [newMember, ...prev]);
//       setSuccess('New team member added successfully');
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       setError('Failed to add team member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMemberClick = (member: TeamMember) => {
//     // Navigate to member detail page or open modal
//     console.log('Member clicked:', member);
//   };

//   // Calculate statistics
//   const statistics = {
//     totalTeamMembers: teamMembers.length,
//     activeMembers: teamMembers.filter(m => m.status === 'active').length,
//     totalProjects: Array.from(new Set(teamMembers.flatMap(m => m.currentProjects))).length,
//     totalTasks: teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0),
//     avgPerformance: Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length) || 0,
//   };

//   if (loading && teamMembers.length === 0) {
//     return (
//       <MainLayout title="Team Activity">
//         <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <SkeletonCard height={150} />
//             <Box sx={{ 
//               display: 'grid', 
//               gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
//               gap: 2 
//             }}>
//               {[1, 2, 3, 4].map((i) => (
//                 <SkeletonCard key={i} height={100} />
//               ))}
//             </Box>
//             <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
//               <Box sx={{ flex: 1 }}>
//                 <SkeletonCard height={400} />
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <SkeletonCard height={400} />
//               </Box>
//             </Box>
//           </Box>
//         </Container>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout title="Team Activity">
//       <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
//         {/* Development Banner */}
//         <Alert2
//           severity="info"
//           title="🚀 Team Activity Dashboard - Under Development"
//           message="This feature is currently being built. Real data integration will be available soon."
//           icon={<Construction />}
//           action={
//             <Button2
//               variant="outlined"
//               size="small"
//               iconRight={<Rocket />}
//               sx={{ color: 'inherit', borderColor: 'currentColor' }}
//             >
//               Coming Soon
//             </Button2>
//           }
//           sx={{ mb: 3 }}
//         />

//         {/* Error Alert */}
//         {error && (
//           <Alert2
//             severity="error"
//             message={error}
//             dismissible
//             onDismiss={() => setError(null)}
//             sx={{ mb: 3 }}
//           />
//         )}

//         {/* Success Alert */}
//         {success && (
//           <Alert2
//             severity="success"
//             message={success}
//             dismissible
//             onDismiss={() => setSuccess(null)}
//             sx={{ mb: 3 }}
//           />
//         )}

//         {/* Header Section */}
//         <Card2
//           sx={{
//             p: { xs: 3, md: 4 },
//             mb: 4,
//             background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
//             color: 'white',
//             position: 'relative',
//             overflow: 'hidden',
//           }}
//         >
//           <Box sx={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
//             <Groups sx={{ fontSize: 200 }} />
//           </Box>
          
//           <Box sx={{ position: 'relative' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//               <Box>
//                 <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
//                   Team Activity Dashboard
//                 </Typography>
//                 <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
//                   Monitor your team's performance and track progress in real-time
//                 </Typography>
//               </Box>
              
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Tooltip title="Refresh Data">
//                   <IconButton
//                     onClick={fetchTeamData}
//                     disabled={loading}
//                     sx={{
//                       bgcolor: alpha('#fff', 0.2),
//                       color: 'white',
//                       '&:hover': { bgcolor: alpha('#fff', 0.3) },
//                     }}
//                   >
//                     <Refresh />
//                   </IconButton>
//                 </Tooltip>
//                 <Button2
//                   variant="contained"
//                   iconLeft={<Add />}
//                   onClick={handleAddMember}
//                   disabled={loading}
//                   sx={{
//                     bgcolor: 'white',
//                     color: 'primary.main',
//                     fontWeight: 600,
//                     '&:hover': {
//                       bgcolor: alpha('#fff', 0.9),
//                     },
//                   }}
//                 >
//                   Add Member
//                 </Button2>
//               </Box>
//             </Box>

//             {/* Statistics Chips */}
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               <Chip
//                 icon={<Groups />}
//                 label={`${statistics.totalTeamMembers} Team Members`}
//                 sx={{
//                   bgcolor: alpha('#fff', 0.2),
//                   color: 'white',
//                   border: `1px solid ${alpha('#fff', 0.3)}`,
//                 }}
//               />
//               <Chip
//                 icon={<Person />}
//                 label={`${statistics.activeMembers} Active Now`}
//                 sx={{
//                   bgcolor: alpha('#fff', 0.2),
//                   color: 'white',
//                   border: `1px solid ${alpha('#fff', 0.3)}`,
//                 }}
//               />
//               <Chip
//                 icon={<Computer />}
//                 label={`${statistics.totalProjects} Active Projects`}
//                 sx={{
//                   bgcolor: alpha('#fff', 0.2),
//                   color: 'white',
//                   border: `1px solid ${alpha('#fff', 0.3)}`,
//                 }}
//               />
//             </Box>
//           </Box>
//         </Card2>

//         {/* Main Content */}
//         <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
//           {/* Left Column */}
//           <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//             {/* Stats Cards */}
//             <Box sx={{ 
//               display: 'grid', 
//               gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr' },
//               gap: 2 
//             }}>
//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent sx={{ p: 2 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Box sx={{ 
//                       p: 1.5, 
//                       borderRadius: 2, 
//                       bgcolor: alpha(theme.palette.success.main, 0.1),
//                       color: theme.palette.success.main,
//                     }}>
//                       <TrendingUp />
//                     </Box>
//                     <Box>
//                       <Typography variant="h5" fontWeight="bold">
//                         {statistics.avgPerformance}%
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Team Performance
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>

//               <Card sx={{ borderRadius: 2 }}>
//                 <CardContent sx={{ p: 2 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Box sx={{ 
//                       p: 1.5, 
//                       borderRadius: 2, 
//                       bgcolor: alpha(theme.palette.primary.main, 0.1),
//                       color: theme.palette.primary.main,
//                     }}>
//                       <Task />
//                     </Box>
//                     <Box>
//                       <Typography variant="h5" fontWeight="bold">
//                         {statistics.totalTasks}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Tasks Completed
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>

//             {/* Team Members */}
//             <Card2>
//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                   <Typography variant="h5" fontWeight="bold">
//                     Team Members
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Chip
//                       label={autoRefresh ? 'Auto On' : 'Auto Off'}
//                       size="small"
//                       onClick={() => setAutoRefresh(!autoRefresh)}
//                       color={autoRefresh ? 'primary' : 'default'}
//                     />
//                   </Box>
//                 </Box>
                
//                 {loading ? (
//                   <MessageListSkeleton count={3} />
//                 ) : (
//                   <Stack spacing={2}>
//                     {teamMembers.map((member) => (
//                       <TeamMemberCard
//                         key={member.id}
//                         member={member}
//                         onClick={handleMemberClick}
//                       />
//                     ))}
//                   </Stack>
//                 )}
//               </CardContent>
//             </Card2>
//           </Box>

//           {/* Right Column */}
//           <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//             {/* Recent Activities */}
//             <Card2>
//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                   <Typography variant="h5" fontWeight="bold">
//                     Recent Activities
//                   </Typography>
//                   <Box sx={{ display: 'flex', gap: 1 }}>
//                     <Tooltip title="Export">
//                       <IconButton size="small">
//                         <Download />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Share">
//                       <IconButton size="small">
//                         <Share />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </Box>
                
//                 {loading ? (
//                   <MessageListSkeleton count={3} />
//                 ) : (
//                   <Stack spacing={2}>
//                     {recentActivities.map((activity) => (
//                       <ActivityCard key={activity.id} activity={activity} />
//                     ))}
//                   </Stack>
//                 )}
//               </CardContent>
//             </Card2>

//             {/* Additional Sections */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//               {/* Projects Overview */}
//               <Card2>
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography variant="h5" fontWeight="bold" gutterBottom>
//                     Projects Overview
//                   </Typography>
//                   <Stack spacing={2}>
//                     {['E-commerce Platform', 'Mobile App', 'Dashboard Redesign'].map((project) => (
//                       <Box key={project}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                           <Typography variant="body2" fontWeight="medium">
//                             {project}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {Math.floor(Math.random() * 100)}%
//                           </Typography>
//                         </Box>
//                         <LinearProgress
//                           variant="determinate"
//                           value={Math.floor(Math.random() * 100)}
//                           sx={{ height: 8, borderRadius: 4 }}
//                         />
//                       </Box>
//                     ))}
//                   </Stack>
//                 </CardContent>
//               </Card2>
//             </Box>
//           </Box>
//         </Box>
//       </Container>
//     </MainLayout>
//   );
// }