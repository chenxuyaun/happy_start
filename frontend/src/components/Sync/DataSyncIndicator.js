import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
} from '@mui/material';
import {
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  CloudOff as CloudOffIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const DataSyncIndicator = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncQueue, setSyncQueue] = useState([]);

  // 模拟网络状态监听
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 模拟同步状态变化
    const syncInterval = setInterval(() => {
      if (networkStatus === 'online') {
        const random = Math.random();
        if (random > 0.8) {
          setSyncStatus('syncing');
          setTimeout(() => {
            setSyncStatus('synced');
            setLastSyncTime(new Date());
          }, 2000);
        }
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [networkStatus]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    }, 2000);
    handleClose();
  };

  const getSyncIcon = () => {
    if (networkStatus === 'offline') {
      return <CloudOffIcon />;
    }
    
    switch (syncStatus) {
      case 'syncing':
        return <SyncIcon className="spin" />;
      case 'synced':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <SyncIcon />;
    }
  };

  const getSyncColor = () => {
    if (networkStatus === 'offline') return 'error';
    
    switch (syncStatus) {
      case 'syncing':
        return 'info';
      case 'synced':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTooltipText = () => {
    if (networkStatus === 'offline') return '网络连接断开';
    
    switch (syncStatus) {
      case 'syncing':
        return '正在同步...';
      case 'synced':
        return `已同步 - ${lastSyncTime.toLocaleTimeString()}`;
      case 'error':
        return '同步失败';
      default:
        return '点击查看同步状态';
    }
  };

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <IconButton 
          onClick={handleClick}
          color={getSyncColor()}
          size="small"
        >
          <Badge 
            badgeContent={syncQueue.length > 0 ? syncQueue.length : null}
            color="warning"
          >
            {getSyncIcon()}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              同步状态
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            {networkStatus === 'online' ? 
              <CheckCircleIcon color="success" /> : 
              <CloudOffIcon color="error" />
            }
          </ListItemIcon>
          <ListItemText>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">网络状态:</Typography>
              <Chip 
                label={networkStatus === 'online' ? '在线' : '离线'}
                color={networkStatus === 'online' ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            {getSyncIcon()}
          </ListItemIcon>
          <ListItemText>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">数据同步:</Typography>
              <Chip 
                label={
                  syncStatus === 'syncing' ? '同步中' :
                  syncStatus === 'synced' ? '已同步' :
                  syncStatus === 'error' ? '失败' : '未知'
                }
                color={getSyncColor()}
                size="small"
              />
            </Box>
          </ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              上次同步: {lastSyncTime.toLocaleString()}
            </Typography>
          </ListItemText>
        </MenuItem>

        {syncQueue.length > 0 && (
          <>
            <Divider />
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                同步队列: {syncQueue.length} 项待处理
              </Typography>
            </MenuItem>
          </>
        )}

        <Divider />
        <MenuItem onClick={handleManualSync} disabled={syncStatus === 'syncing'}>
          <ListItemIcon>
            <RefreshIcon />
          </ListItemIcon>
          <ListItemText>手动同步</ListItemText>
        </MenuItem>
      </Menu>

      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default DataSyncIndicator;
