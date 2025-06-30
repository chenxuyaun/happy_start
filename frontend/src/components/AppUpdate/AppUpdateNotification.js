import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography
} from '@mui/material';
import { CheckCircle, Error, Update as UpdateIcon } from '@mui/icons-material';

const fetchUpdateInfo = async () => {
  // 模拟更新检查请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hasUpdate: true,
        version: '1.2.0',
        changelog: [
          '优化了数据同步性能',
          '新增个性化设置功能',
          '修复了一些已知问题'
        ]
      });
    }, 1500);
  });
};

const AppUpdateNotification = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        setChecking(true);
        setError(false);
        const info = await fetchUpdateInfo();
        setUpdateInfo(info);
      } catch (err) {
        setError(true);
      } finally {
        setChecking(false);
      }
    };

    checkForUpdates();
  }, []);

  const handleInstallUpdate = () => {
    alert('正在安装更新...');
    // 这里可以添加更新安装逻辑
  };

  return (
    <Dialog open={updateInfo?.hasUpdate || false} onClose={() => setUpdateInfo(null)}>
      <DialogTitle>
        <UpdateIcon /> 应用更新
      </DialogTitle>
      <DialogContent>
        {checking && <CircularProgress size={24} />}
        {error && <Typography color="error" variant="body2">检查更新失败，请稍后重试。</Typography>}
        {updateInfo && !checking && !error && (
          <List>
            <ListItem>
              <ListItemText primary="最新版本" secondary={updateInfo.version} />
            </ListItem>
            <ListItem>
              <ListItemText primary="更新内容" secondary={
                <ul>
                  {updateInfo.changelog.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              } />
            </ListItem>
          </List>
        )}
      </DialogContent>
      <DialogActions>
        {!checking && !error && (
          <Button onClick={handleInstallUpdate} startIcon={<CheckCircle />} variant="contained" color="primary">
            安装更新
          </Button>
        )}
        <Button onClick={() => setUpdateInfo(null)} color="secondary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppUpdateNotification;

