import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  GetApp,
  NewReleases,
  BugReport,
  Star,
  Security,
  Speed,
  Palette,
  Close,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [changelogOpen, setChangelogOpen] = useState(true);

  // 模拟更新信息
  const updateInfo = {
    version: '2.1.0',
    currentVersion: '2.0.5',
    releaseDate: '2025-01-15',
    size: '15.2 MB',
    type: 'minor', // major, minor, patch
    urgent: false,
    features: [
      {
        type: 'feature',
        icon: Star,
        title: '新增心情追踪功能',
        description: '快速记录和分析每日心情变化',
        color: 'primary',
      },
      {
        type: 'improvement',
        icon: Speed,
        title: '性能优化',
        description: '应用启动速度提升 40%，内存使用降低 25%',
        color: 'success',
      },
      {
        type: 'feature',
        icon: Palette,
        title: '全新主题系统',
        description: '支持更多主题选择和自定义颜色方案',
        color: 'secondary',
      },
      {
        type: 'security',
        icon: Security,
        title: '安全性增强',
        description: '增强数据加密和隐私保护功能',
        color: 'warning',
      },
    ],
    bugFixes: [
      '修复冥想计时器偶尔不准确的问题',
      '解决虚拟花园植物状态同步延迟',
      '修复个人资料头像上传失败的错误',
      '优化日志编辑器的性能问题',
    ],
  };

  // 检查更新
  useEffect(() => {
    const checkForUpdates = () => {
      // 模拟检查更新
      setTimeout(() => {
        const shouldShowUpdate = Math.random() > 0.7; // 30% 概率显示更新
        setUpdateAvailable(shouldShowUpdate);
      }, 2000);
    };

    checkForUpdates();
  }, []);

  const handleUpdateClick = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleInstallUpdate = async () => {
    setInstalling(true);
    setInstallProgress(0);

    // 模拟安装过程
    const installSteps = [
      { progress: 20, message: '下载更新包...' },
      { progress: 40, message: '验证文件完整性...' },
      { progress: 60, message: '备份用户数据...' },
      { progress: 80, message: '安装更新...' },
      { progress: 100, message: '完成安装！' },
    ];

    for (const step of installSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstallProgress(step.progress);
    }

    setTimeout(() => {
      setInstalling(false);
      setShowDialog(false);
      setUpdateAvailable(false);
      // 模拟重启应用
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case 'major':
        return 'error';
      case 'minor':
        return 'warning';
      case 'patch':
        return 'info';
      default:
        return 'default';
    }
  };

  const getUpdateTypeLabel = (type) => {
    switch (type) {
      case 'major':
        return '重大更新';
      case 'minor':
        return '功能更新';
      case 'patch':
        return '修复更新';
      default:
        return '更新';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* 更新通知条 */}
      <Snackbar
        open={updateAvailable}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          severity={updateInfo.urgent ? 'warning' : 'info'}
          action={
            <Box>
              <Button
                color="inherit"
                size="small"
                onClick={handleUpdateClick}
                sx={{ mr: 1 }}
              >
                查看详情
              </Button>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleDismiss}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          }
          icon={<NewReleases />}
        >
          <AlertTitle>
            新版本 {updateInfo.version} 可用
            <Chip
              label={getUpdateTypeLabel(updateInfo.type)}
              size="small"
              color={getUpdateTypeColor(updateInfo.type)}
              sx={{ ml: 1 }}
            />
          </AlertTitle>
          {updateInfo.urgent
            ? '这是一个重要的安全更新，建议立即安装。'
            : '包含新功能和性能改进，建议及时更新。'
          }
        </Alert>
      </Snackbar>

      {/* 更新详情对话框 */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NewReleases color="primary" />
            <Box>
              <Typography variant="h6">
                Happy Day {updateInfo.version} 
                <Chip
                  label={getUpdateTypeLabel(updateInfo.type)}
                  size="small"
                  color={getUpdateTypeColor(updateInfo.type)}
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                发布于 {formatDate(updateInfo.releaseDate)} • 大小: {updateInfo.size}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {installing && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                正在安装更新...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={installProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {installProgress}% 完成
              </Typography>
            </Box>
          )}

          {/* 新功能 */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setChangelogOpen(!changelogOpen)}
            >
              <Typography variant="h6" gutterBottom>
                ✨ 新功能和改进
              </Typography>
              <IconButton size="small">
                {changelogOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            
            <Collapse in={changelogOpen}>
              <List disablePadding>
                {updateInfo.features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <IconComponent color={feature.color} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.title}
                        secondary={feature.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Box>

          {/* 错误修复 */}
          {updateInfo.bugFixes.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BugReport color="action" />
                错误修复
              </Typography>
              <List disablePadding>
                {updateInfo.bugFixes.map((fix, index) => (
                  <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={fix}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* 重要提示 */}
          {updateInfo.urgent && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>重要提示</AlertTitle>
              此更新包含重要的安全修复，强烈建议立即安装以保护您的数据安全。
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={installing}
          >
            稍后提醒
          </Button>
          <Button
            onClick={handleInstallUpdate}
            variant="contained"
            startIcon={installing ? null : <GetApp />}
            disabled={installing}
            color={updateInfo.urgent ? 'warning' : 'primary'}
          >
            {installing ? '安装中...' : '立即更新'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateNotification;
