import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Paper,
  Avatar
} from '@mui/material';
import {
  Mood,
  Psychology,
  Spa,
  AccountTree,
  AutoGraph,
  SelfImprovement,
  ArrowForward,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Mood sx={{ fontSize: 40, color: '#FF9A9E' }} />,
      title: '心情日记',
      description: '记录每日情绪变化，AI智能分析心理状态，帮助你更好地了解自己',
      color: '#FF9A9E'
    },
    {
      icon: <AccountTree sx={{ fontSize: 40, color: '#A8E6CF' }} />,
      title: '虚拟花园',
      description: '通过3D互动花园可视化你的情绪成长，看见内心世界的美丽变化',
      color: '#A8E6CF'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#6B73FF' }} />,
      title: 'AI智能助手',
      description: '24小时陪伴的心理健康助手，提供个性化的建议和支持',
      color: '#6B73FF'
    },
    {
      icon: <SelfImprovement sx={{ fontSize: 40, color: '#FFD3A5' }} />,
      title: '冥想指导',
      description: '专业的冥想课程和计时器，帮助你找到内心的平静与专注',
      color: '#FFD3A5'
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40, color: '#81D4FA' }} />,
      title: '数据分析',
      description: '详细的情绪趋势分析和个人成长报告，让进步可视化',
      color: '#81D4FA'
    },
    {
      icon: <Spa sx={{ fontSize: 40, color: '#DDA0DD' }} />,
      title: '治愈体验',
      description: '吉卜力风格的温暖界面设计，每一次使用都是心灵的治愈之旅',
      color: '#DDA0DD'
    }
  ];

  const testimonials = [
    {
      name: '小雨',
      avatar: '🌸',
      rating: 5,
      comment: '每天写心情日记已经成为习惯，AI助手的建议很贴心，感觉心情真的变好了很多！'
    },
    {
      name: '阳光',
      avatar: '🌻',
      rating: 5,
      comment: '虚拟花园太美了！看着自己的情绪花园一天天茂盛，成就感满满。'
    },
    {
      name: '静心',
      avatar: '🍃',
      rating: 5,
      comment: '冥想功能帮我缓解了很多压力，界面设计很治愈，用起来很舒服。'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 154, 158, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107, 115, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(168, 230, 207, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }}
      />

      {/* 顶部导航 */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6B73FF' }}>
              🌸 Happy Day
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 25 }}
              >
                登录
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{ borderRadius: 25 }}
              >
                注册
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* 英雄区域 */}
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', py: 8 }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            遇见更好的自己 ✨
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            通过AI智能分析、虚拟花园可视化和专业冥想指导，
            让心理健康管理变得简单而美好
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #FF9A9E 30%, #FECFEF 90%)',
                boxShadow: '0 4px 20px rgba(255, 154, 158, 0.4)'
              }}
            >
              立即开始治愈之旅
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              了解更多
            </Button>
          </Stack>
        </MotionBox>

        {/* 功能特性 */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ color: 'white', mb: 6, fontWeight: 'bold' }}
          >
            🌟 核心功能
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{ 
                    height: '100%',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 用户评价 */}
        <Box sx={{ py: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ color: 'white', mb: 6, fontWeight: 'bold' }}
          >
            💖 用户心声
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  sx={{ 
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mx: 'auto', 
                      mb: 2,
                      backgroundColor: 'transparent',
                      fontSize: '2rem'
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {testimonial.name}
                  </Typography>
                  <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 号召行动 */}
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: 'center', py: 8 }}
        >
          <Paper
            sx={{
              p: 6,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#6B73FF' }}>
              准备好开始你的治愈之旅了吗？
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              加入我们，让每一天都充满阳光与希望 ☀️
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{ 
                px: 6, 
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(45deg, #6B73FF 30%, #9C9EFF 90%)',
                boxShadow: '0 4px 20px rgba(107, 115, 255, 0.4)'
              }}
            >
              立即免费注册
            </Button>
          </Paper>
        </MotionBox>
      </Container>

      {/* 页脚 */}
      <Box sx={{ 
        mt: 8, 
        py: 4, 
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            textAlign="center" 
            sx={{ color: 'rgba(255,255,255,0.8)' }}
          >
            © 2024 Happy Day. 用心守护每一份美好心情 💝
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;

