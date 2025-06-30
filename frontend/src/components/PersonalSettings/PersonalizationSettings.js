import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Avatar,
  Chip,
  TextField,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  Tune as TuneIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const PersonalizationSettings = () => {
  const [settings, setSettings] = useState({
    // 外观设置
    theme: 'auto',
    primaryColor: '#2196F3',
    fontSize: 14,
    compactMode: false,
    animationsEnabled: true,
    
    // 用户体验
    language: 'zh-CN',
    timeFormat: '24h',
    dateFormat: 'YYYY-MM-DD',
    autoSave: true,
    confirmDelete: true,
    
    // 通知偏好
    browserNotifications: true,
    emailDigest: false,
    weeklyReport: true,
    goalReminders: true,
    
    // 隐私设置
    dataCollection: false,
    analyticsOptIn: false,
    shareUsageData: false,
    
    // 高级设置
    developerMode: false,
    experimentalFeatures: false,
    debugMode: false,
  });

  const [customGoals, setCustomGoals] = useState([
    { id: 1, name: '每日运动', target: 30, unit: '分钟' },
    { id: 2, name: '阅读时间', target: 2, unit: '小时' },
    { id: 3, name: '冥想次数', target: 1, unit: '次' },
  ]);

  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '' });

  const themeOptions = [
    { value: 'light', label: '浅色主题' },
    { value: 'dark', label: '深色主题' },
    { value: 'auto', label: '跟随系统' },
  ];

  const colorOptions = [
    { value: '#2196F3', label: '蓝色', color: '#2196F3' },
    { value: '#4CAF50', label: '绿色', color: '#4CAF50' },
    { value: '#FF9800', label: '橙色', color: '#FF9800' },
    { value: '#9C27B0', label: '紫色', color: '#9C27B0' },
    { value: '#F44336', label: '红色', color: '#F44336' },
    { value: '#607D8B', label: '蓝灰色', color: '#607D8B' },
  ];

  const languageOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.unit) {
      setCustomGoals(prev => [
        ...prev,
        { ...newGoal, id: Date.now(), target: parseInt(newGoal.target) }
      ]);
      setNewGoal({ name: '', target: '', unit: '' });
    }
  };

  const handleDeleteGoal = (id) => {
    setCustomGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleSaveSettings = () => {
    // 保存设置到localStorage或发送到服务器
    localStorage.setItem('userPersonalizationSettings', JSON.stringify(settings));
    localStorage.setItem('userCustomGoals', JSON.stringify(customGoals));
    alert('设置已保存！');
  };

  const handleResetSettings = () => {
    if (window.confirm('确定要重置所有个性化设置吗？此操作不可撤销。')) {
      // 重置为默认设置
      setSettings({
        theme: 'auto',
        primaryColor: '#2196F3',
        fontSize: 14,
        compactMode: false,
        animationsEnabled: true,
        language: 'zh-CN',
        timeFormat: '24h',
        dateFormat: 'YYYY-MM-DD',
        autoSave: true,
        confirmDelete: true,
        browserNotifications: true,
        emailDigest: false,
        weeklyReport: true,
        goalReminders: true,
        dataCollection: false,
        analyticsOptIn: false,
        shareUsageData: false,
        developerMode: false,
        experimentalFeatures: false,
        debugMode: false,
      });
      setCustomGoals([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        个性化设置
      </Typography>

      <Grid container spacing={3}>
        {/* 外观设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} />
                外观设置
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>主题</InputLabel>
                  <Select
                    value={settings.theme}
                    label="主题"
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    {themeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography gutterBottom>主色调</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {colorOptions.map(color => (
                    <Box
                      key={color.value}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: color.color,
                        cursor: 'pointer',
                        border: settings.primaryColor === color.value ? '3px solid #000' : '1px solid #ccc',
                      }}
                      onClick={() => handleSettingChange('primaryColor', color.value)}
                    />
                  ))}
                </Box>

                <Typography gutterBottom>字体大小: {settings.fontSize}px</Typography>
                <Slider
                  value={settings.fontSize}
                  onChange={(e, value) => handleSettingChange('fontSize', value)}
                  min={12}
                  max={20}
                  step={1}
                  marks
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.compactMode}
                      onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                    />
                  }
                  label="紧凑模式"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.animationsEnabled}
                      onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
                    />
                  }
                  label="启用动画效果"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 用户体验设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TuneIcon sx={{ mr: 1 }} />
                用户体验
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>语言</InputLabel>
                <Select
                  value={settings.language}
                  label="语言"
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  {languageOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>时间格式</InputLabel>
                <Select
                  value={settings.timeFormat}
                  label="时间格式"
                  onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                >
                  <MenuItem value="12h">12小时制</MenuItem>
                  <MenuItem value="24h">24小时制</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                }
                label="自动保存"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.confirmDelete}
                    onChange={(e) => handleSettingChange('confirmDelete', e.target.checked)}
                  />
                }
                label="删除确认"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 通知设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                通知偏好
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.browserNotifications}
                    onChange={(e) => handleSettingChange('browserNotifications', e.target.checked)}
                  />
                }
                label="浏览器通知"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailDigest}
                    onChange={(e) => handleSettingChange('emailDigest', e.target.checked)}
                  />
                }
                label="邮件摘要"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.weeklyReport}
                    onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                  />
                }
                label="周报告"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.goalReminders}
                    onChange={(e) => handleSettingChange('goalReminders', e.target.checked)}
                  />
                }
                label="目标提醒"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 隐私设置 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                隐私设置
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                我们尊重您的隐私，所有数据都存储在本地设备上。
              </Alert>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.dataCollection}
                    onChange={(e) => handleSettingChange('dataCollection', e.target.checked)}
                  />
                }
                label="数据收集"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.analyticsOptIn}
                    onChange={(e) => handleSettingChange('analyticsOptIn', e.target.checked)}
                  />
                }
                label="分析数据"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.shareUsageData}
                    onChange={(e) => handleSettingChange('shareUsageData', e.target.checked)}
                  />
                }
                label="分享使用数据"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 自定义目标 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <PsychologyIcon sx={{ mr: 1 }} />
                自定义目标
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="目标名称"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="目标值"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="单位"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    placeholder="如：分钟、次、小时"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddGoal}
                    disabled={!newGoal.name || !newGoal.target || !newGoal.unit}
                  >
                    添加
                  </Button>
                </Grid>
              </Grid>

              <List>
                {customGoals.map((goal) => (
                  <ListItem key={goal.id}>
                    <ListItemText
                      primary={goal.name}
                      secondary={`目标: ${goal.target} ${goal.unit}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleDeleteGoal(goal.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 保存和重置按钮 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{ mr: 2 }}
            >
              保存设置
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
              onClick={handleResetSettings}
              color="warning"
            >
              重置设置
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalizationSettings;
