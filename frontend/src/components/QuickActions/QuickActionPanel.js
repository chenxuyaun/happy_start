import React, { useState } from 'react';
import {
  Fab,
  Backdrop,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Zoom,
  Tooltip,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Create,
  SelfImprovement,
  LocalFlorist,
  Mic,
  PhotoCamera,
  Assignment,
  EmojiEmotions,
  FitnessCenter,
  Analytics,
  Settings,
  Help,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const QuickActionPanel = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [open, setOpen] = useState(false);

  const quickActions = [
    {
      id: 'write-journal',
      label: '写日志',
      description: '记录今天的心情和感悟',
      icon: Create,
      color: 'primary',
      action: () => navigate('/app/journal'),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'start-meditation',
      label: '开始冥想',
      description: '放松身心，专注当下',
      icon: SelfImprovement,
      color: 'secondary',
      action: () => navigate('/app/meditation'),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'visit-garden',
      label: '照料花园',
      description: '查看虚拟花园中的植物',
      icon: LocalFlorist,
      color: 'success',
      action: () => navigate('/app/garden'),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'voice-note',
      label: '语音备忘',
      description: '快速录制语音笔记',
      icon: Mic,
      color: 'warning',
      action: () => handleVoiceNote(),
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'quick-photo',
      label: '随手拍',
      description: '拍照记录美好瞬间',
      icon: PhotoCamera,
      color: 'info',
      action: () => handleQuickPhoto(),
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'mood-tracker',
      label: '心情记录',
      description: '快速记录当前心情',
      icon: EmojiEmotions,
      color: 'error',
      action: () => handleMoodTracker(),
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
    {
      id: 'habit-check',
      label: '习惯打卡',
      description: '完成今日习惯目标',
      icon: Assignment,
      color: 'primary',
      action: () => handleHabitCheck(),
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    },
    {
      id: 'wellness-tips',
      label: '健康建议',
      description: '获取个性化健康建议',
      icon: FitnessCenter,
      color: 'success',
      action: () => handleWellnessTips(),
      gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActionClick = (action) => {
    action.action();
    handleClose();
  };

  // 以下是快捷操作的处理函数
  const handleVoiceNote = () => {
    // 语音备忘功能
    console.log('Starting voice note...');
    // 这里可以集成语音识别API
  };

  const handleQuickPhoto = () => {
    // 快速拍照功能
    console.log('Opening camera...');
    // 这里可以调用相机API
  };

  const handleMoodTracker = () => {
    // 心情追踪功能
    console.log('Opening mood tracker...');
    // 可以打开一个快速心情选择界面
  };

  const handleHabitCheck = () => {
    // 习惯打卡功能
    console.log('Opening habit checker...');
    // 显示今日习惯清单
  };

  const handleWellnessTips = () => {
    // 健康建议功能
    console.log('Getting wellness tips...');
    // 基于用户数据生成健康建议
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = currentUser?.firstName || '朋友';
    
    if (hour < 6) return `深夜好，${name}`;
    if (hour < 9) return `早上好，${name}`;
    if (hour < 12) return `上午好，${name}`;
    if (hour < 14) return `中午好，${name}`;
    if (hour < 18) return `下午好，${name}`;
    if (hour < 22) return `晚上好，${name}`;
    return `夜晚好，${name}`;
  };

  const getQuickSuggestion = () => {
    const hour = new Date().getHours();
    const suggestions = {
      morning: '开始新的一天，写下今天的计划和目标！',
      afternoon: '工作间隙，来个短暂的冥想放松一下吧。',
      evening: '回顾今天的收获，记录下美好的时刻。',
      night: '准备休息了，整理一下今天的心情。',
    };

    if (hour >= 6 && hour < 12) return suggestions.morning;
    if (hour >= 12 && hour < 18) return suggestions.afternoon;
    if (hour >= 18 && hour < 22) return suggestions.evening;
    return suggestions.night;
  };

  return (
    <Box>
      {/* 主浮动按钮 */}
      <Fab
        color="primary"
        aria-label="快捷操作"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s',
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* 背景遮罩和面板 */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: 999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
        }}
        open={open}
        onClick={handleClose}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflow: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              p: 2,
            }}
          >
            <CardContent>
              {/* 头部 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    {getGreeting()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getQuickSuggestion()}
                  </Typography>
                </Box>
                <IconButton onClick={handleClose} size="large">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* 当前状态卡片 */}
              <Card sx={{ mb: 3, background: 'rgba(103, 126, 234, 0.1)', border: 'none' }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={currentUser?.avatar}
                      sx={{ width: 40, height: 40 }}
                    >
                      {currentUser?.firstName?.[0] || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        今日进度
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label="日志 1/1" size="small" color="success" />
                        <Chip label="冥想 0/1" size="small" color="warning" />
                        <Chip label="花园 1/1" size="small" color="success" />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* 快捷操作网格 */}
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                快捷操作
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Grid item xs={6} sm={4} key={action.id}>
                      <Zoom in={open} timeout={300 + index * 100}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 6,
                            },
                            background: action.gradient,
                            color: 'white',
                            border: 'none',
                          }}
                          onClick={() => handleActionClick(action)}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <IconComponent sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                              {action.label}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              {action.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  );
                })}
              </Grid>

              {/* 底部提示 */}
              <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  💡 小贴士：按 Ctrl+K 可以快速打开搜索功能
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default QuickActionPanel;
