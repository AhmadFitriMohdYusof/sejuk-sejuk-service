import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Chip,
  useTheme
} from "@mui/material";
import {
  EmojiEvents as LeaderIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CompletedIcon,
  Warning as DelayIcon,
  AccessTime as AvgTimeIcon
} from "@mui/icons-material";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

const TechnicianDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        // Get all completed orders from Firestore
        const ordersQuery = query(
          collection(db, "orders"),
          where("status", "==", "Completed")
        );
        const querySnapshot = await getDocs(ordersQuery);

        // Process data to calculate KPIs
        const techData = {};
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - (timeRange === 'week' ? 7 : 30));

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const techName = order.assignedTechnician;
          const completedDate = new Date(order.completedAt);
          const isInRange = completedDate >= startDate;

          if (!techData[techName]) {
            techData[techName] = {
              jobsCompleted: 0,
              totalSales: 0,
              delays: 0,
              rangeJobs: 0,
              rangeSales: 0,
              totalHours: 0
            };
          }

          techData[techName].jobsCompleted++;
          techData[techName].totalSales += parseFloat(order.finalAmount) || 0;

          // Calculate completion time and delays
          if (order.createdAt && order.completedAt) {
            const createdDate = new Date(order.createdAt);
            const hoursToComplete = (completedDate - createdDate) / (1000 * 60 * 60);
            techData[techName].totalHours += hoursToComplete;
            if (hoursToComplete > 24) {
              techData[techName].delays++;
            }
          }

          if (isInRange) {
            techData[techName].rangeJobs++;
            techData[techName].rangeSales += parseFloat(order.finalAmount) || 0;
          }
        });

        // Convert to array with calculated metrics
        const techArray = Object.keys(techData).map(name => ({
          name,
          ...techData[name],
          avgJobValue: techData[name].totalSales / techData[name].jobsCompleted,
          avgCompletionTime: techData[name].totalHours / techData[name].jobsCompleted
        })).sort((a, b) => b.rangeSales - a.rangeSales);

        setTechnicians(techArray);
      } catch (error) {
        console.error("Error fetching technician data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianData();
  }, [timeRange]);

  // Filter technicians based on current user role
  const filteredTechnicians = currentUser?.role === 'admin' 
    ? technicians 
    : technicians.filter(tech => tech.name === currentUser?.name);

  // Chart data configuration
  const chartData = {
    labels: filteredTechnicians.map(t => t.name),
    datasets: [
      {
        label: `Jobs Completed (Last ${timeRange === 'week' ? '7 Days' : '30 Days'})`,
        data: filteredTechnicians.map(t => t.rangeJobs),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
        ],
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading technician data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {currentUser?.role === 'admin' ? 'Technician Performance Dashboard' : 'My Performance'}
      </Typography>
      
      {/* Time Range Selector */}
      <Box sx={{ mb: 3 }}>
        <Chip 
          label="Last 7 Days" 
          onClick={() => setTimeRange('week')}
          color={timeRange === 'week' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip 
          label="Last 30 Days" 
          onClick={() => setTimeRange('month')}
          color={timeRange === 'month' ? 'primary' : 'default'}
        />
      </Box>

      {/* Leaderboard Cards - Only show for admin */}
      {currentUser?.role === 'admin' && (
        <>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Top Performers
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredTechnicians.slice(0, 3).map((tech, index) => (
              <Grid item xs={12} md={4} key={tech.name}>
                <Card sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${
                    index === 0 ? '#ffd700' : 
                    index === 1 ? '#c0c0c0' : 
                    '#cd7f32'
                  }`
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: index === 0 ? 'gold' : 
                                index === 1 ? 'silver' : 
                                '#cd7f32',
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {index + 1}
                      </Avatar>
                      <Typography variant="h6">{tech.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        <CompletedIcon color="success" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {tech.rangeJobs} jobs
                      </Typography>
                      <Typography variant="body2">
                        <MoneyIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        RM{tech.rangeSales.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Performance Charts */}
      <Typography variant="h6" gutterBottom>
        Performance Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Bar
              data={chartData}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: `Jobs Completed (Last ${timeRange === 'week' ? '7 Days' : '30 Days'})`
                  }
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Pie
              data={{
                ...chartData,
                datasets: [{
                  ...chartData.datasets[0],
                  label: 'Revenue Generated',
                  data: filteredTechnicians.map(t => t.rangeSales),
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: `Revenue Share (Last ${timeRange === 'week' ? '7 Days' : '30 Days'})`
                  }
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Performance Table */}
      <Typography variant="h6" gutterBottom>
        Detailed Metrics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Technician</TableCell>
              <TableCell align="right">Jobs Completed</TableCell>
              <TableCell align="right">Total Sales (RM)</TableCell>
              <TableCell align="right">Delays</TableCell>
              <TableCell align="right">Avg. Job Value</TableCell>
              <TableCell align="right">Avg. Completion Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTechnicians.map((tech) => (
              <TableRow key={tech.name}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {currentUser?.role === 'admin' && technicians.indexOf(tech) < 3 && (
                      <LeaderIcon 
                        sx={{ 
                          mr: 1,
                          color: technicians.indexOf(tech) === 0 ? 'gold' : 
                                  technicians.indexOf(tech) === 1 ? 'silver' : 
                                  '#cd7f32'
                        }} 
                      />
                    )}
                    {tech.name}
                  </Box>
                </TableCell>
                <TableCell align="right">{tech.jobsCompleted}</TableCell>
                <TableCell align="right">{tech.totalSales.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {tech.delays}
                    {tech.delays > 0 && <DelayIcon color="warning" sx={{ ml: 1 }} />}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  RM{tech.avgJobValue.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {tech.avgCompletionTime.toFixed(1)}h
                    <AvgTimeIcon color="action" sx={{ ml: 1 }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TechnicianDashboard;