import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  Book,
  SelfImprovement,
  LocalFlorist,
  Refresh,
  Add,
  Visibility,
  Timeline,
  AccessTime,
  Mood,
  ShowChart
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dashboardService } from '../services/dashboardService';

// 导入新的组件
import AdvancedHabitTracker from '../components/HabitTracker/AdvancedHabitTracker';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalEntries: 0,
      totalMeditations: 0,
      plantsGrown: 0,
      streakDays: 0
    },
    emotionTrends: [],
    recentActivities: [],
    journalStats: null,
    meditationStats: null,
    gardenState: null
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 尝试获取真实数据
      const overviewResult = await dashboardService.getDashboardOverview();
      const activitiesResult = await dashboardService.getRecentActivities(5);

      if (overviewResult.success) {
        // 使用真实数据
        const data = overviewResult.data;
        const activities = activitiesResult.success ? activitiesResult.data : [];
        
        setDashboardData({
          stats: data.stats,
          emotionTrends: data.emotionTrends,
          journalStats: data.journalStats,
          meditationStats: data.meditationStats,
          gardenState: data.gardenState,
          recentActivities: activities.map(activity => ({
            id: activity.id,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            time: activity.timestamp,
            icon: getActivityIcon(activity.type)
          }))
        });
      } else {
        // 如果API失败，使用模拟数据
        console.warn('API调用失败，使用模拟数据:', overviewResult.error);
        const mockData = dashboardService.generateMockData();
        
        setDashboardData({
          stats: mockData.data.stats,
          emotionTrends: mockData.data.emotionTrends,
          journalStats: mockData.data.journalStats,
          meditationStats: mockData.data.meditationStats,
          gardenState: mockData.data.gardenState,
          recentActivities: mockData.data.recentActivities.map(activity => ({
            id: activity.id,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            time: activity.timestamp,
            icon: getActivityIcon(activity.type)
          }))
        });
        
        // 显示警告信息，但不阻塞UI
        setError('当前显示演示数据，服务器连接失败');
      }
    } catch (err) {
      console.error('获取仪表板数据失败:', err);
      
      // 完全失败时使用模拟数据
      const mockData = dashboardService.generateMockData();
      setDashboardData({
        stats: mockData.data.stats,
        emotionTrends: mockData.data.emotionTrends,
        journalStats: mockData.data.journalStats,
        meditationStats: mockData.data.meditationStats,
        gardenState: mockData.data.gardenState,
        recentActivities: mockData.data.recentActivities.map(activity => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: activity.timestamp,
          icon: getActivityIcon(activity.type)
        }))
      });
      
      setError('当前显示演示数据，请稍后重试连接服务器');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'journal':
        return <Book />;
      case 'meditation':
        return <SelfImprovement />;
      case 'garden':
        return <LocalFlorist />;
      default:
        return <Mood />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '未知时间';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        {/* 页面标题 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            控制台
          </Typography>
          <Tooltip title="刷新数据">
            <IconButton onClick={fetchDashboardData} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 错误提示 */}
        {error && (
          <Alert 
            severity={error.includes('演示数据') ? 'warning' : 'error'} 
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* 统计卡片 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Book />
                  </Avatar>
                  <Typography variant="h6">日记篇数</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {dashboardData.stats.totalEntries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  记录你的每一天
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <SelfImprovement />
                  </Avatar>
                  <Typography variant="h6">冥想次数</Typography>
                </Box>
                <Typography variant="h4" color="secondary">
                  {dashboardData.stats.totalMeditations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  平静你的内心
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <LocalFlorist />
                  </Avatar>
                  <Typography variant="h6">种植数量</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {dashboardData.stats.plantsGrown}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  培育你的花园
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h6">连续天数</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {dashboardData.stats.streakDays}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  坚持的力量
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 情绪趋势图表 */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                  情绪趋势 (最近30天)
                </Typography>
                {dashboardData.emotionTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.emotionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="happiness" stroke="#ff7300" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无数据，开始记录日记来查看情绪趋势吧
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Add />}>
                  写日记
                </Button>
                <Button size="small" startIcon={<Visibility />}>
                  查看详情
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* 最近活动 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                  最近活动
                </Typography>
                {dashboardData.recentActivities.length > 0 ? (
                  <List>
                    {dashboardData.recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.light' }}>
                              {activity.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.title}
                            secondary={
                              <>
                                {activity.description}
                                <br />
                                <Chip
                                  label={formatDate(activity.time)}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              </>
                            }
                          />
                        </ListItem>
                        {index < dashboardData.recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无活动记录
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 快速操作 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                快速操作
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<Book />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    写日记
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<SelfImprovement />}
                    fullWidth
                    sx={{ py: 2 }}
                    color="secondary"
                  >
                    开始冥想
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    startIcon={<LocalFlorist />}
                    fullWidth
                    sx={{ py: 2 }}
                    color="success"
                  >
                    访问花园
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<Mood />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    情绪分析
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 高级习惯追踪 */}
          <Grid item xs={12}>
            <AdvancedHabitTracker />
          </Grid>

          {/* 数据分析 */}
          <Grid item xs={12}>
            <AnalyticsDashboard />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DashboardPage;
