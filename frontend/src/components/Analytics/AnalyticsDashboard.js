import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Week 1', mood: 4, energy: 3 },
  { name: 'Week 2', mood: 5, energy: 4 },
  { name: 'Week 3', mood: 3, energy: 5 },
  { name: 'Week 4', mood: 5, energy: 2 },
  { name: 'Week 5', mood: 4, energy: 3 },
  { name: 'Week 6', mood: 4, energy: 4 },
];

const AnalyticsDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        数据统计
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                心情和能量水平
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="energy" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                其他统计
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  这里可以添加更多统计信息和分析结果。
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;

