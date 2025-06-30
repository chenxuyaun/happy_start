import React, { useState, useEffect } from 'react';
import {
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Alert,
  Divider
} from '@mui/material';
import {
  Cloud as CloudIcon,
  CloudOff as CloudOffIcon,
  Storage as DatabaseIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import serviceManager from '../../services/serviceManager';

const BackendStatusIndicator = () => {
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [config, setConfig] = useState(serviceManager.getConfig());

  useEffect(() => {
    checkStatus();
    
    // 监听服务模式变化
    const handleModeChange = (event) => {
      setConfig(serviceManager.getConfig());
      checkStatus();
    };

    window.addEventListener('serviceManagerModeChange', handleModeChange);
    
    // 定期检查连接状态
    const interval = setInterval(checkStatus, 30000); // 每30秒检查一次

    return () => {
      window.removeEventListener('serviceManagerModeChange', handleModeChange);
      clearInterval(interval);
    };
  }, []);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const result = await serviceManager.testBackendConnection();
      setStatus(result);
    } catch (error) {
      setStatus({ success: false, message: error.message });
    } finally {
      setChecking(false);
    }
  };

  const handleToggleMockData = () => {
    if (config.useMockData) {
      serviceManager.switchToRealMode();
    } else {
      serviceManager.switchToMockMode();
    }
    setConfig(serviceManager.getConfig());
  };

  const getStatusIcon = () => {
    if (checking) return <RefreshIcon className="rotating" />;
    if (config.useMockData) return <DatabaseIcon color="warning" />;
    if (status?.success) return <CloudIcon color="success" />;
    return <CloudOffIcon color="error" />;
  };

  const getStatusText = () => {
    if (checking) return '检查中...';
    if (config.useMockData) return '模拟数据';
    if (status?.success) return '已连接';
    return '离线';
  };

  const getStatusColor = () => {
    if (checking) return 'default';
    if (config.useMockData) return 'warning';
    if (status?.success) return 'success';
    return 'error';
  };

  const serviceStatus = serviceManager.getServiceStatus();

  return (
    <>
      <Tooltip title="后端连接状态">
        <Chip
          icon={getStatusIcon()}
          label={getStatusText()}
          color={getStatusColor()}
          variant="outlined"
          onClick={() => setOpen(true)}
          size="small"
          sx={{ cursor: 'pointer' }}
        />
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <SettingsIcon sx={{ mr: 1 }} />
            后端连接状态
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* 连接状态概览 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              当前状态
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              {getStatusIcon()}
              <Typography variant="body1" sx={{ ml: 1, mr: 2 }}>
                {getStatusText()}
              </Typography>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={checkStatus}
                disabled={checking}
              >
                刷新
              </Button>
            </Box>
            
            {status && (
              <Alert 
                severity={status.success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                {status.message}
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 数据模式切换 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              数据模式
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.useMockData}
                  onChange={handleToggleMockData}
                />
              }
              label={config.useMockData ? '使用模拟数据' : '使用真实数据'}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              {config.useMockData 
                ? '当前使用本地模拟数据，无需后端连接'
                : '当前连接后端API获取真实数据'
              }
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 服务详情 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              服务详情
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {serviceStatus.services.journal === 'real' ? 
                    <CheckIcon color="success" /> : 
                    <WarningIcon color="warning" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary="日记服务"
                  secondary={`当前使用: ${serviceStatus.services.journal === 'real' ? '真实数据' : '模拟数据'}`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  {serviceStatus.services.auth === 'real' ? 
                    <CheckIcon color="success" /> : 
                    <WarningIcon color="warning" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary="认证服务"
                  secondary={`当前使用: ${serviceStatus.services.auth === 'real' ? '真实数据' : '模拟数据'}`}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 配置信息 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              配置信息
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="API地址"
                  secondary={config.apiUrl}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="调试模式"
                  secondary={config.debug ? '开启' : '关闭'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="超时时间"
                  secondary={`${serviceStatus.config.timeout}ms`}
                />
              </ListItem>
            </List>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        .rotating {
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default BackendStatusIndicator;
