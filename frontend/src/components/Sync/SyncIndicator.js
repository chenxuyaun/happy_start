import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Sync,
  SyncDisabled,
  Cloud,
  CloudOff,
  CloudDone,
  CloudSync,
  ErrorOutline,
  CheckCircle,
  Schedule,
  Refresh,
  MoreVert,
  SignalWifiOff,
  SignalWifi4Bar,
} from '@mui/icons-material';

const SyncIndicator = () => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error, offline
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [syncQueue, setSyncQueue] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // 模拟同步队列项目
  const mockSyncItems = [
    { id: 1, type: 'journal', title: '日志条目 #123', status: 'pending', timestamp: new Date() },
    { id: 2, type: 'meditation', title: '冥想会话数据', status: 'syncing', timestamp: new Date() },
    { id: 3, type: 'profile', title: '个人资料更新', status: 'completed', timestamp: new Date() },
    { id: 4, type: 'garden', title: '花园状态同步', status: 'failed', timestamp: new Date() },
  ];

  // 监听网络连接状态
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('online');
      setNotificationMessage('网络连接已恢复');
      setShowNotification(true);
      // 自动开始同步
      setTimeout(() => {
        handleSync();
      }, 1000);
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
      setSyncStatus('offline');
      setNotificationMessage('网络连接已断开，数据将在本地保存');
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始状态检查
    if (!navigator.onLine) {
      setConnectionStatus('offline');
      setSyncStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 模拟定期同步
  useEffect(() => {
    if (connectionStatus === 'online') {
      const interval = setInterval(() => {
        if (syncStatus === 'idle') {
          handleAutoSync();
        }
      }, 30000); // 每30秒自动同步

      return () => clearInterval(interval);
    }
  }, [connectionStatus, syncStatus]);

  // 模拟同步队列更新
  useEffect(() => {
    setSyncQueue(mockSyncItems);
  }, []);

  const handleSync = async () => {
    if (connectionStatus === 'offline') {
      setNotificationMessage('网络连接不可用，无法同步');
      setShowNotification(true);
      return;
    }

    setSyncStatus('syncing');
    
    try {
      // 模拟同步过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功同步
      setSyncStatus('success');
      setLastSyncTime(new Date());
      setNotificationMessage('数据同步成功');
      setShowNotification(true);
      
      // 更新同步队列
      setSyncQueue(prev => prev.map(item => ({
        ...item,
        status: 'completed',
        timestamp: new Date()
      })));

      // 3秒后回到idle状态
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
      
    } catch (error) {
      setSyncStatus('error');
      setNotificationMessage('数据同步失败，请检查网络连接');
      setShowNotification(true);
      
      // 5秒后回到idle状态
      setTimeout(() => {
        setSyncStatus('idle');
      }, 5000);
    }
  };

  const handleAutoSync = async () => {
    // 静默自动同步
    setSyncStatus('syncing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncStatus('success');
      setLastSyncTime(new Date());
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 2000);
      
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatLastSyncTime = () => {
    const now = new Date();
    const diff = now - lastSyncTime;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return '刚刚同步';
    if (minutes < 60) return `${minutes}分钟前同步`;
    if (hours < 24) return `${hours}小时前同步`;
    return lastSyncTime.toLocaleDateString();
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <CircularProgress size={16} />;
      case 'success':
        return <CloudDone />;
      case 'error':
        return <ErrorOutline />;
      case 'offline':
        return <CloudOff />;
      default:
        return connectionStatus === 'online' ? <Cloud /> : <CloudOff />;
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'info';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'offline':
        return 'default';
      default:
        return connectionStatus === 'online' ? 'primary' : 'default';
    }
  };

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'syncing':
        return '同步中...';
      case 'success':
        return '已同步';
      case 'error':
        return '同步失败';
      case 'offline':
        return '离线模式';
      default:
        return connectionStatus === 'online' ? '在线' : '离线';
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'journal':
        return <Sync />;
      case 'meditation':
        return <Schedule />;
      case 'profile':
        return <CheckCircle />;
      case 'garden':
        return <ErrorOutline />;
      default:
        return <Sync />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'syncing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'syncing':
        return '同步中';
      case 'failed':
        return '失败';
      default:
        return '等待中';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* 网络状态指示器 */}
      <Tooltip title={connectionStatus === 'online' ? '网络连接正常' : '网络连接断开'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {connectionStatus === 'online' ? (
            <SignalWifi4Bar color="success" fontSize="small" />
          ) : (
            <SignalWifiOff color="error" fontSize="small" />
          )}
        </Box>
      </Tooltip>

      {/* 同步状态芯片 */}
      <Tooltip title={`点击手动同步 • ${formatLastSyncTime()}`}>
        <Chip
          icon={getSyncIcon()}
          label={getSyncLabel()}
          color={getSyncColor()}
          size="small"
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: `${getSyncColor()}.light`,
            },
            transition: 'all 0.2s',
          }}
        />
      </Tooltip>

      {/* 更多选项菜单 */}
      <Tooltip title="同步选项">
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ ml: 0.5 }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* 同步菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 300 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            数据同步状态
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatLastSyncTime()}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleSync} disabled={syncStatus === 'syncing'}>
          <ListItemIcon>
            <Refresh />
          </ListItemIcon>
          <ListItemText primary="立即同步" />
        </MenuItem>
        
        <Divider />
        
        <Box sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            同步队列 ({syncQueue.length})
          </Typography>
          <List dense>
            {syncQueue.slice(0, 3).map((item) => (
              <ListItem key={item.id} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {getItemIcon(item.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={getStatusLabel(item.status)}
                        size="small"
                        color={getStatusColor(item.status)}
                        sx={{ height: 16, fontSize: 10 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Menu>

      {/* 通知消息 */}
      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity={syncStatus === 'error' ? 'error' : 'info'}
          variant="filled"
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SyncIndicator;
