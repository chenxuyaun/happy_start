import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs
} from '@mui/material';
import {
  Notifications,
  Storage,
  Share,
  Download,
  Test,
  Delete,
  Info,
  Settings as SettingsIcon,
  Schedule,
  CloudSync,
  Security
} from '@mui/icons-material';

// 导入服务
import storageService from '../services/storageService';
import exportService from '../services/exportService';
import notificationService from '../services/notificationService';
import socialService from '../services/socialService';

// 导入组件
import DataExportImport from '../components/DataManagement/DataExportImport';
import PersonalizationSettings from '../components/PersonalSettings/PersonalizationSettings';

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState({});
  const [storageStats, setStorageStats] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({});
  const [shareSettings, setShareSettings] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const appSettings = storageService.getSettings();
    const notifSettings = notificationService.getReminderSettings();
    const socialSettings = socialService.getShareSettings();
    const stats = storageService.getStorageStats();

    setSettings(appSettings);
    setNotificationSettings(notifSettings);
    setShareSettings(socialSettings);
    setStorageStats(stats);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const showConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  // 通知设置相关函数
  const handleNotificationToggle = async (type, enabled) => {
    try {
      if (enabled && !notificationService.hasPermission()) {
        const granted = await notificationService.requestPermission();
        if (!granted) {
          showSnackbar('需要通知权限才能启用提醒功能', 'warning');
          return;
        }
      }

      const updatedSettings = notificationService.updateReminderSettings({
        [`${type}Reminder`]: enabled
      });
      setNotificationSettings(updatedSettings);
      showSnackbar(`${type}提醒已${enabled ? '启用' : '禁用'}`);
    } catch (error) {
      showSnackbar(`设置提醒失败: ${error.message}`, 'error');
    }
  };

  const handleTimeChange = (type, time) => {
    const updatedSettings = notificationService.updateReminderSettings({
      [`${type}Time`]: time
    });
    setNotificationSettings(updatedSettings);
    showSnackbar(`${type}提醒时间已更新`);
  };

  const testNotification = () => {
    notificationService.testNotification();
    showSnackbar('测试通知已发送');
  };

  // 数据管理相关函数
  const handleExport = async (format, dataType = 'all') => {
    try {
      let result;
      switch (dataType) {
        case 'journal':
          result = await exportService.exportJournalData(format);
          break;
        case 'meditation':
          result = await exportService.exportMeditationData(format);
          break;
        case 'garden':
          result = await exportService.exportGardenData(format);
          break;
        default:
          result = await exportService.exportAllData(format);
      }
      
      showSnackbar(`数据已导出为 ${result.filename}`);
    } catch (error) {
      showSnackbar(`导出失败: ${error.message}`, 'error');
    }
  };

  const handleClearData = (dataType) => {
    const confirmMessages = {
      all: '确定要清除所有本地数据吗？此操作不可恢复！',
      journal: '确定要清除所有日记数据吗？',
      meditation: '确定要清除所有冥想记录吗？',
      garden: '确定要清除花园数据吗？',
      cache: '确定要清除缓存数据吗？'
    };

    showConfirmDialog(
      '确认清除数据',
      confirmMessages[dataType],
      () => {
        try {
          if (dataType === 'all') {
            storageService.clearAllData();
          } else if (dataType === 'cache') {
            storageService.removeCache();
          } else {
            storageService.clearModule(dataType);
          }
          loadSettings();
          showSnackbar('数据已清除');
        } catch (error) {
          showSnackbar(`清除数据失败: ${error.message}`, 'error');
        }
      }
    );
  };

  // 分享设置相关函数
  const handleShareSettingToggle = (setting, value) => {
    const updatedSettings = socialService.updateShareSettings({
      [setting]: value
    });
    setShareSettings(updatedSettings);
    showSnackbar('分享设置已更新');
  };

  const handlePlatformToggle = (platform, enabled) => {
    const updatedSettings = socialService.updateShareSettings({
      platforms: {
        ...shareSettings.platforms,
        [platform]: enabled
      }
    });
    setShareSettings(updatedSettings);
    showSnackbar(`${platform}分享已${enabled ? '启用' : '禁用'}`);
  };

  const testShare = () => {
    socialService.shareAchievement({
      name: '测试成就',
      description: '这是一个测试分享功能的成就'
    }, { platform: 'auto' });
  };

  // 渲染各个设置面板
  const renderNotificationSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
        通知与提醒设置
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>基础设置</Typography>
          
          <Button
            variant="outlined"
            onClick={testNotification}
            sx={{ mb: 2 }}
          >
            <Test sx={{ mr: 1 }} />
            测试通知
          </Button>

          <Grid container spacing={2}>
            {[
              { key: 'journal', label: '日记提醒', icon: '📝' },
              { key: 'meditation', label: '冥想提醒', icon: '🧘' },
              { key: 'watering', label: '浇水提醒', icon: '🌱' }
            ].map(({ key, label, icon }) => (
              <Grid item xs={12} key={key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Typography sx={{ mr: 1 }}>{icon}</Typography>
                        <Typography>{label}</Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings[`${key}Reminder`] || false}
                            onChange={(e) => handleNotificationToggle(key, e.target.checked)}
                          />
                        }
                        label=""
                      />
                    </Box>
                    
                    {notificationSettings[`${key}Reminder`] && (
                      <TextField
                        type="time"
                        label="提醒时间"
                        value={notificationSettings[`${key}Time`] || '20:00'}
                        onChange={(e) => handleTimeChange(key, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderStorageSettings = () => (
    <DataExportImport />
  );

  const renderShareSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        <Share sx={{ mr: 1, verticalAlign: 'middle' }} />
        社交分享设置
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>基础设置</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={shareSettings.allowShare || false}
                onChange={(e) => handleShareSettingToggle('allowShare', e.target.checked)}
              />
            }
            label="启用分享功能"
          />

          <Button
            variant="outlined"
            onClick={testShare}
            sx={{ ml: 2 }}
            disabled={!shareSettings.allowShare}
          >
            测试分享
          </Button>
        </CardContent>
      </Card>

      {shareSettings.allowShare && (
        <>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>分享平台</Typography>
              <Grid container spacing={2}>
                {socialService.getSupportedPlatforms().filter(p => p.key !== 'copy').map(platform => (
                  <Grid item xs={6} sm={4} key={platform.key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={shareSettings.platforms?.[platform.key] || false}
                          onChange={(e) => handlePlatformToggle(platform.key, e.target.checked)}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center">
                          <Typography sx={{ mr: 1 }}>{platform.icon}</Typography>
                          <Typography>{platform.name}</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>自动分享</Typography>
              {[
                { key: 'achievements', label: '获得成就时自动分享' },
                { key: 'milestones', label: '达成里程碑时自动分享' },
                { key: 'streaks', label: '连续打卡时自动分享' }
              ].map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={shareSettings.autoShare?.[key] || false}
                      onChange={(e) => handleShareSettingToggle(`autoShare.${key}`, e.target.checked)}
                    />
                  }
                  label={label}
                />
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );

  const renderGeneralSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        通用设置
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>外观设置</Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>主题</InputLabel>
            <Select
              value={settings.theme || 'light'}
              label="主题"
              onChange={(e) => {
                const newSettings = { ...settings, theme: e.target.value };
                setSettings(newSettings);
                storageService.saveSettings(newSettings);
                showSnackbar('主题设置已保存');
              }}
            >
              <MenuItem value="light">浅色</MenuItem>
              <MenuItem value="dark">深色</MenuItem>
              <MenuItem value="auto">跟随系统</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>语言</InputLabel>
            <Select
              value={settings.language || 'zh-CN'}
              label="语言"
              onChange={(e) => {
                const newSettings = { ...settings, language: e.target.value };
                setSettings(newSettings);
                storageService.saveSettings(newSettings);
                showSnackbar('语言设置已保存');
              }}
            >
              <MenuItem value="zh-CN">中文(简体)</MenuItem>
              <MenuItem value="zh-TW">中文(繁體)</MenuItem>
              <MenuItem value="en-US">English</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>应用信息</Typography>
          <Typography variant="body2" gutterBottom>
            版本: 1.0.0
          </Typography>
          <Typography variant="body2" gutterBottom>
            最后更新: {storageStats?.lastUpdated ? new Date(storageStats.lastUpdated).toLocaleString() : '未知'}
          </Typography>
          <Typography variant="body2">
            本应用使用本地存储保存您的数据，所有数据仅存储在您的设备上。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const renderPersonalizationSettings = () => (
    <PersonalizationSettings />
  );

  const tabs = [
    { label: '通用设置', component: renderGeneralSettings },
    { label: '个性化', component: renderPersonalizationSettings },
    { label: '通知提醒', component: renderNotificationSettings },
    { label: '数据管理', component: renderStorageSettings },
    { label: '社交分享', component: renderShareSettings }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        设置
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {tabs[currentTab]?.component()}
      </Box>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* 确认对话框 */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            取消
          </Button>
          <Button
            onClick={() => {
              confirmDialog.onConfirm?.();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            color="primary"
            variant="contained"
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
