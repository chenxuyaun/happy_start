import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert,
} from '@mui/material';
import {
  Timer,
  School,
  Assessment,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  MeditationTimer,
  MeditationCourses,
  MeditationStats,
} from '../components/Meditation';
import { fetchMeditationStats } from '../store/meditationSlice';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`meditation-tabpanel-${index}`}
      aria-labelledby={`meditation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `meditation-tab-${index}`,
    'aria-controls': `meditation-tabpanel-${index}`,
  };
}

function MeditationPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error } = useSelector(state => state.meditation);

  useEffect(() => {
    // 页面加载时获取冥想统计数据
    dispatch(fetchMeditationStats()).catch(() => {
      console.log('Using mock data for meditation stats');
    });
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          🧘‍♀️ 冥想指导 🧘‍♂️
        </Typography>
        
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          通过冥想练习，找到内心的平静与专注
        </Typography>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 标签页导航 */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="meditation tabs"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<Timer />}
              label="冥想计时器"
              {...a11yProps(0)}
            />
            <Tab
              icon={<School />}
              label="冥想课程"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Assessment />}
              label="统计数据"
              {...a11yProps(2)}
            />
          </Tabs>
        </Paper>

        {/* 标签页内容 */}
        <TabPanel value={activeTab} index={0}>
          <MeditationTimer />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <MeditationCourses />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <MeditationStats />
        </TabPanel>

        {/* 使用说明 */}
        <Paper sx={{ mt: 4, p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            💡 冥想指南
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>计时器</strong>：选择您喜欢的冥想时长，使用简单的计时器进行自由冥想
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>课程</strong>：选择适合您水平的引导冥想课程，跟随专业导师一起练习
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>统计</strong>：查看您的冥想进度，设定目标并获得成就徽章
          </Typography>
          <Typography variant="body2">
            • <strong>建议</strong>：每天坚持10-20分钟的冥想练习，将为您带来显著的身心效益
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default MeditationPage;
