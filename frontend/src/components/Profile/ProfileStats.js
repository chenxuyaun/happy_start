import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Star,
  LocalFlorist,
  SelfImprovement,
  Create,
  Timeline,
  EmojiEvents,
  Verified,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { userUtils } from '../../utils/userUtils';

const ProfileStats = () => {
  const { currentUser } = useSelector(state => state.user);
  
  // 模拟统计数据
  const mockStats = {
    journalEntries: 45,
    meditationSessions: 28,
    gardenActivities: 15,
    daysActive: 60,
    totalMeditationTime: 840, // 分钟
    currentStreak: 7,
    longestStreak: 14,
    achievements: 12,
  };

  const profileCompletion = userUtils.checkProfileCompleteness(currentUser);
  const activityLevel = userUtils.calculateActivityLevel(mockStats);
  const badges = userUtils.getUserBadges(currentUser, mockStats);
  const summary = userUtils.generateUserSummary(currentUser, mockStats);

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getActivityColor = (level) => {
    switch (level) {
      case 'high': return 'success';
      case 'medium': return 'info';
      case 'low': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* 资料完整度 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Verified color="primary" />
            资料完整度
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {profileCompletion.completedFields}/{profileCompletion.totalFields} 项已完成
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileCompletion.percentage}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={profileCompletion.percentage}
              color={getCompletionColor(profileCompletion.percentage)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          {profileCompletion.missing.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                未完成项目：
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {profileCompletion.missing.map((field) => (
                  <Chip
                    key={field}
                    label={getFieldLabel(field)}
                    size="small"
                    variant="outlined"
                    color="warning"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 活动统计 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" />
            活动统计
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {mockStats.journalEntries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  日志篇数
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {mockStats.meditationSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  冥想次数
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {mockStats.gardenActivities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  园艺活动
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {mockStats.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  连续天数
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip
              icon={<TrendingUp />}
              label={`活跃度: ${activityLevel.label}`}
              color={getActivityColor(activityLevel.level)}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 成就徽章 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents color="primary" />
            成就徽章
          </Typography>
          {badges.length > 0 ? (
            <List>
              {badges.map((badge) => (
                <ListItem key={badge.id} disablePadding>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {badge.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={badge.name}
                    secondary={badge.description}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              继续使用应用来解锁更多徽章！
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* 快速信息 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star color="primary" />
            用户摘要
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                基本信息
              </Typography>
              <Typography variant="body1">
                {summary.basicInfo.name} • {summary.basicInfo.age}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summary.basicInfo.location} • {summary.basicInfo.joinDays}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                活动概览
              </Typography>
              <Typography variant="body1">
                活跃度: {summary.activity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                资料完整度: {summary.profileCompletion} • {summary.badges} 个徽章
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const getFieldLabel = (field) => {
  const labels = {
    username: '用户名',
    email: '邮箱',
    firstName: '姓',
    lastName: '名',
    bio: '个人简介',
    dateOfBirth: '出生日期',
    gender: '性别',
    location: '所在地',
    phone: '电话',
  };
  return labels[field] || field;
};

export default ProfileStats;
