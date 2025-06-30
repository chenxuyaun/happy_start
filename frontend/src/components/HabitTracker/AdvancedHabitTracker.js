import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  LocalFireDepartment as StreakIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const initialHabits = [
  {
    id: 1,
    name: '晨练',
    category: 'health',
    target: 7,
    unit: '次/周',
    completed: 5,
    streak: 12,
    color: '#4CAF50',
    icon: '🏃‍♂️',
    description: '每天早上30分钟运动'
  },
  {
    id: 2,
    name: '读书',
    category: 'learning',
    target: 30,
    unit: '分钟/天',
    completed: 25,
    streak: 8,
    color: '#2196F3',
    icon: '📚',
    description: '每天阅读30分钟'
  },
  {
    id: 3,
    name: '冥想',
    category: 'wellness',
    target: 10,
    unit: '分钟/天',
    completed: 10,
    streak: 15,
    color: '#9C27B0',
    icon: '🧘‍♀️',
    description: '每天冥想放松'
  }
];

const categories = [
  { value: 'health', label: '健康', color: '#4CAF50' },
  { value: 'learning', label: '学习', color: '#2196F3' },
  { value: 'wellness', label: '身心健康', color: '#9C27B0' },
  { value: 'productivity', label: '效率', color: '#FF9800' },
  { value: 'social', label: '社交', color: '#E91E63' },
];

const AdvancedHabitTracker = () => {
  const [habits, setHabits] = useState(initialHabits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    target: 1,
    unit: '次/天',
    icon: '⭐',
    description: ''
  });

  const handleAddHabit = () => {
    const habit = {
      id: Date.now(),
      ...newHabit,
      completed: 0,
      streak: 0,
      color: categories.find(c => c.value === newHabit.category)?.color || '#4CAF50'
    };
    setHabits([...habits, habit]);
    setDialogOpen(false);
    setNewHabit({
      name: '',
      category: 'health',
      target: 1,
      unit: '次/天',
      icon: '⭐',
      description: ''
    });
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setNewHabit({ ...habit });
    setDialogOpen(true);
  };

  const handleUpdateHabit = () => {
    setHabits(habits.map(h => h.id === editingHabit.id ? { ...h, ...newHabit } : h));
    setDialogOpen(false);
    setEditingHabit(null);
    setNewHabit({
      name: '',
      category: 'health',
      target: 1,
      unit: '次/天',
      icon: '⭐',
      description: ''
    });
  };

  const handleDeleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleToggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completed >= habit.target;
        return {
          ...habit,
          completed: isCompleted ? 0 : habit.target,
          streak: isCompleted ? habit.streak : habit.streak + 1
        };
      }
      return habit;
    }));
  };

  const getProgressPercentage = (habit) => {
    return Math.min((habit.completed / habit.target) * 100, 100);
  };

  const getStreakLevel = (streak) => {
    if (streak >= 30) return { level: '钻石', color: '#E1BEE7' };
    if (streak >= 21) return { level: '黄金', color: '#FFD700' };
    if (streak >= 14) return { level: '白银', color: '#C0C0C0' };
    if (streak >= 7) return { level: '青铜', color: '#CD7F32' };
    return { level: '新手', color: '#9E9E9E' };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          习惯追踪
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          添加习惯
        </Button>
      </Box>

      {/* 统计概览 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {habits.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总习惯数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {habits.filter(h => h.completed >= h.target).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                今日完成
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {Math.max(...habits.map(h => h.streak), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最长连击
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 习惯列表 */}
      <Grid container spacing={3}>
        {habits.map((habit) => {
          const progress = getProgressPercentage(habit);
          const streakInfo = getStreakLevel(habit.streak);
          const isCompleted = habit.completed >= habit.target;

          return (
            <Grid item xs={12} md={6} lg={4} key={habit.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: habit.color }}>
                      {habit.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {habit.name}
                      </Typography>
                      <Chip 
                        label={categories.find(c => c.value === habit.category)?.label}
                        size="small"
                        sx={{ bgcolor: habit.color, color: 'white' }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {habit.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        进度: {habit.completed}/{habit.target} {habit.unit}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StreakIcon sx={{ color: 'orange' }} />
                    <Typography variant="body2">
                      连击 {habit.streak} 天
                    </Typography>
                    <Chip 
                      label={streakInfo.level}
                      size="small"
                      sx={{ bgcolor: streakInfo.color, color: 'white' }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    variant={isCompleted ? "outlined" : "contained"}
                    color={isCompleted ? "success" : "primary"}
                    startIcon={isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => handleToggleHabit(habit.id)}
                  >
                    {isCompleted ? '已完成' : '标记完成'}
                  </Button>
                  
                  <Box>
                    <IconButton onClick={() => handleEditHabit(habit)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteHabit(habit.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 添加/编辑习惯对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingHabit ? '编辑习惯' : '添加新习惯'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="习惯名称"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="描述"
                multiline
                rows={2}
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>分类</InputLabel>
                <Select
                  value={newHabit.category}
                  label="分类"
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="图标"
                value={newHabit.icon}
                onChange={(e) => setNewHabit({...newHabit, icon: e.target.value})}
                placeholder="选择一个emoji"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="目标"
                value={newHabit.target}
                onChange={(e) => setNewHabit({...newHabit, target: parseInt(e.target.value)})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="单位"
                value={newHabit.unit}
                onChange={(e) => setNewHabit({...newHabit, unit: e.target.value})}
                placeholder="如：次/天、分钟/天"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button 
            onClick={editingHabit ? handleUpdateHabit : handleAddHabit}
            variant="contained"
            disabled={!newHabit.name}
          >
            {editingHabit ? '更新' : '添加'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedHabitTracker;
