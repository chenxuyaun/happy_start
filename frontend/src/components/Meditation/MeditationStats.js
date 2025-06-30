import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Timer,
  SelfImprovement,
  LocalFireDepartment,
  EmojiEvents,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const MeditationStats = () => {
  const { stats, sessionHistory } = useSelector(state => state.meditation);

  // 模拟统计数据
  const mockStats = {
    totalSessions: 42,
    totalMinutes: 520,
    streak: 7,
    favoriteType: '正念冥想',
    weeklyGoal: 150, // 分钟
    weeklyProgress: 89, // 分钟
    achievements: [
      { id: 1, name: '初次冥想', description: '完成第一次冥想', earned: true },
      { id: 2, name: '连续一周', description: '连续冥想7天', earned: true },
      { id: 3, name: '冥想达人', description: '总计冥想50次', earned: false },
      { id: 4, name: '专注大师', description: '单次冥想超过30分钟', earned: true },
    ],
  };

  const displayStats = stats.totalSessions > 0 ? stats : mockStats;

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'error';
    if (streak >= 14) return 'warning';
    if (streak >= 7) return 'success';
    return 'primary';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  const getWeeklyProgressPercentage = () => {
    return Math.min((displayStats.weeklyProgress / displayStats.weeklyGoal) * 100, 100);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        冥想统计
      </Typography>

      <Grid container spacing={3}>
        {/* 总体统计 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SelfImprovement sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {displayStats.totalSessions}
              </Typography>
              <Typography color="text.secondary">
                总冥想次数
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timer sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {formatTime(displayStats.totalMinutes)}
              </Typography>
              <Typography color="text.secondary">
                总冥想时长
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalFireDepartment 
                sx={{ 
                  fontSize: 40, 
                  color: getStreakColor(displayStats.streak) === 'error' ? 'error.main' :
                         getStreakColor(displayStats.streak) === 'warning' ? 'warning.main' :
                         getStreakColor(displayStats.streak) === 'success' ? 'success.main' : 'primary.main',
                  mb: 1 
                }} 
              />
              <Typography variant="h4" component="div" gutterBottom>
                {displayStats.streak}
              </Typography>
              <Typography color="text.secondary">
                连续天数
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" component="div" gutterBottom>
                {displayStats.favoriteType}
              </Typography>
              <Typography color="text.secondary">
                最喜欢的类型
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 本周目标进度 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                本周目标
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    进度: {displayStats.weeklyProgress} / {displayStats.weeklyGoal} 分钟
                  </Typography>
                  <Typography variant="body2">
                    {Math.round(getWeeklyProgressPercentage())}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getWeeklyProgressPercentage()}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {displayStats.weeklyGoal - displayStats.weeklyProgress > 0 
                  ? `还需要冥想 ${displayStats.weeklyGoal - displayStats.weeklyProgress} 分钟完成本周目标`
                  : '恭喜！已完成本周目标 🎉'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 成就系统 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                成就徽章
              </Typography>
              <Grid container spacing={1}>
                {displayStats.achievements?.map((achievement) => (
                  <Grid item xs={12} key={achievement.id}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      opacity: achievement.earned ? 1 : 0.5 
                    }}>
                      <EmojiEvents 
                        sx={{ 
                          color: achievement.earned ? 'gold' : 'grey.400',
                          fontSize: 20 
                        }} 
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {achievement.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                      {achievement.earned && (
                        <Chip 
                          label="已获得" 
                          size="small" 
                          color="success" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 最近冥想记录 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最近冥想记录
              </Typography>
              {sessionHistory.length > 0 ? (
                <Grid container spacing={1}>
                  {sessionHistory.slice(0, 5).map((session, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        textAlign: 'center' 
                      }}>
                        <Typography variant="body2" fontWeight="bold">
                          {session.type || '自由冥想'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {session.duration} 分钟
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  暂无冥想记录，开始您的第一次冥想吧！
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeditationStats;
