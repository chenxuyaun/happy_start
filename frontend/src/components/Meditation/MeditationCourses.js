import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  Star,
  School,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMeditationCourses,
  setCurrentSession,
  startMeditationSession,
} from '../../store/meditationSlice';

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    title: '初学者引导冥想',
    description: '适合冥想新手的基础课程，学习正确的呼吸和姿势',
    duration: 10,
    level: '初级',
    category: '基础冥想',
    instructor: '张老师',
    rating: 4.8,
    image: '/meditation/beginner.jpg',
    sessions: 7,
    completedSessions: 0,
  },
  {
    id: 2,
    title: '正念呼吸冥想',
    description: '专注于呼吸的正念练习，帮助缓解压力和焦虑',
    duration: 15,
    level: '中级',
    category: '正念冥想',
    instructor: '李老师',
    rating: 4.9,
    image: '/meditation/mindful.jpg',
    sessions: 10,
    completedSessions: 3,
  },
  {
    id: 3,
    title: '深度放松冥想',
    description: '通过身体扫描和深度放松技巧，释放身心紧张',
    duration: 20,
    level: '中级',
    category: '放松冥想',
    instructor: '王老师',
    rating: 4.7,
    image: '/meditation/relaxation.jpg',
    sessions: 8,
    completedSessions: 1,
  },
  {
    id: 4,
    title: '睡前冥想',
    description: '温和的冥想练习，帮助您放松身心，准备优质睡眠',
    duration: 12,
    level: '初级',
    category: '睡眠冥想',
    instructor: '刘老师',
    rating: 4.6,
    image: '/meditation/sleep.jpg',
    sessions: 5,
    completedSessions: 5,
  },
  {
    id: 5,
    title: '慈悲冥想',
    description: '培养慈悲心和自我关爱的高级冥想练习',
    duration: 25,
    level: '高级',
    category: '慈悲冥想',
    instructor: '陈老师',
    rating: 4.9,
    image: '/meditation/compassion.jpg',
    sessions: 12,
    completedSessions: 0,
  },
  {
    id: 6,
    title: '专注力训练',
    description: '提高注意力和专注力的专门训练课程',
    duration: 18,
    level: '中级',
    category: '专注训练',
    instructor: '赵老师',
    rating: 4.8,
    image: '/meditation/focus.jpg',
    sessions: 9,
    completedSessions: 2,
  },
];

const MeditationCourses = () => {
  const dispatch = useDispatch();
  const { courses, loading, currentSession } = useSelector(state => state.meditation);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    // 尝试获取课程，如果失败则使用模拟数据
    dispatch(fetchMeditationCourses()).catch(() => {
      // 如果API调用失败，我们使用模拟数据
      console.log('Using mock data for courses');
    });
  }, [dispatch]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setDetailDialogOpen(true);
  };

  const handleStartCourse = (course) => {
    dispatch(setCurrentSession(course));
    dispatch(startMeditationSession(course.id));
    setDetailDialogOpen(false);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case '初级': return 'success';
      case '中级': return 'warning';
      case '高级': return 'error';
      default: return 'default';
    }
  };

  const getProgressPercentage = (course) => {
    return (course.completedSessions / course.sessions) * 100;
  };

  const coursesToDisplay = courses.length > 0 ? courses : mockCourses;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        冥想课程
      </Typography>

      <Grid container spacing={3}>
        {coursesToDisplay.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                }
              }}
              onClick={() => handleCourseClick(course)}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
              </CardMedia>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={course.level} 
                    color={getLevelColor(course.level)}
                    size="small"
                  />
                  <Chip 
                    label={course.category} 
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration} 分钟
                  </Typography>
                  <Box sx={{ mx: 1 }}>•</Box>
                  <Star sx={{ fontSize: 16, mr: 0.5, color: 'gold' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.rating}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  导师: {course.instructor}
                </Typography>

                {/* 进度条 */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption">
                      进度
                    </Typography>
                    <Typography variant="caption">
                      {course.completedSessions}/{course.sessions}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage(course)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCourse(course);
                  }}
                  disabled={loading}
                >
                  开始练习
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 课程详情对话框 */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              {selectedCourse.title}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedCourse.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  课程信息
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  时长: {selectedCourse.duration} 分钟
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  难度: {selectedCourse.level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  类别: {selectedCourse.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  导师: {selectedCourse.instructor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  评分: {selectedCourse.rating} ⭐
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  学习进度
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage(selectedCourse)}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  已完成 {selectedCourse.completedSessions} / {selectedCourse.sessions} 节课
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>
                取消
              </Button>
              <Button 
                variant="contained" 
                onClick={() => handleStartCourse(selectedCourse)}
                startIcon={<PlayArrow />}
              >
                开始练习
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MeditationCourses;
