import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  Security,
  VpnKey,
  PhoneAndroid,
  Email,
  History,
  Warning,
  CheckCircle,
  Block,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const AccountSecurity = () => {
  const { currentUser } = useSelector(state => state.user);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [newEmail, setNewEmail] = useState('');

  // 模拟登录历史数据
  const loginHistory = [
    {
      id: 1,
      device: 'Windows Chrome',
      ip: '192.168.1.100',
      location: '北京, 中国',
      time: '2025-06-28 04:30:15',
      current: true,
    },
    {
      id: 2,
      device: 'iPhone Safari',
      ip: '192.168.1.101',
      location: '北京, 中国',
      time: '2025-06-27 18:22:33',
      current: false,
    },
    {
      id: 3,
      device: 'Android Chrome',
      ip: '10.0.2.15',
      location: '上海, 中国',
      time: '2025-06-26 14:15:22',
      current: false,
    },
  ];

  // 安全设置状态
  const securitySettings = {
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('新密码与确认密码不匹配');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('密码长度至少8位');
      return;
    }
    
    // 这里应该调用API更改密码
    setSuccessMessage('密码修改成功！');
    setPasswordDialogOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEmailChange = () => {
    if (!newEmail || !newEmail.includes('@')) {
      setErrorMessage('请输入有效的邮箱地址');
      return;
    }
    
    // 这里应该调用API更改邮箱
    setSuccessMessage('邮箱修改请求已发送，请查收验证邮件！');
    setEmailDialogOpen(false);
    setNewEmail('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRevokeSession = (sessionId) => {
    // 这里应该调用API撤销会话
    setSuccessMessage('会话已撤销');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* 密码和邮箱安全 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
            账户安全
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">登录密码</Typography>
                  <Typography variant="body2" color="text.secondary">
                    上次修改: 2025-06-20
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<VpnKey />}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  修改密码
                </Button>
              </Box>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">邮箱地址</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser?.email || 'user@example.com'}
                    {securitySettings.emailVerified && (
                      <CheckCircle sx={{ ml: 1, fontSize: 16, color: 'success.main' }} />
                    )}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => setEmailDialogOpen(true)}
                >
                  修改邮箱
                </Button>
              </Box>
              <Divider />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 两步验证和安全设置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            高级安全设置
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <PhoneAndroid />
              </ListItemIcon>
              <ListItemText
                primary="两步验证"
                secondary={securitySettings.twoFactorEnabled ? "已启用" : "未启用 - 建议开启以提高账户安全性"}
              />
              <Chip
                label={securitySettings.twoFactorEnabled ? "已启用" : "未启用"}
                color={securitySettings.twoFactorEnabled ? "success" : "warning"}
                variant="outlined"
              />
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                color={securitySettings.twoFactorEnabled ? "error" : "primary"}
              >
                {securitySettings.twoFactorEnabled ? "关闭" : "启用"}
              </Button>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="登录通知"
                secondary="新设备登录时发送邮件通知"
              />
              <Chip
                label={securitySettings.loginNotifications ? "已启用" : "未启用"}
                color={securitySettings.loginNotifications ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Warning />
              </ListItemIcon>
              <ListItemText
                primary="异常活动警告"
                secondary="检测到可疑活动时发送警告"
              />
              <Chip
                label={securitySettings.suspiciousActivityAlerts ? "已启用" : "未启用"}
                color={securitySettings.suspiciousActivityAlerts ? "success" : "default"}
                variant="outlined"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* 登录历史 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <History sx={{ mr: 1, verticalAlign: 'middle' }} />
            登录历史
          </Typography>
          
          <List>
            {loginHistory.map((session) => (
              <ListItem key={session.id}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {session.device}
                      </Typography>
                      {session.current && (
                        <Chip label="当前会话" color="primary" size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        IP: {session.ip} • {session.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.time}
                      </Typography>
                    </Box>
                  }
                />
                {!session.current && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Block />}
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    撤销
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* 修改密码对话框 */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>修改密码</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="当前密码"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="新密码"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            margin="normal"
            helperText="密码长度至少8位，建议包含数字、字母和特殊字符"
          />
          <TextField
            fullWidth
            type="password"
            label="确认新密码"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>取消</Button>
          <Button onClick={handlePasswordChange} variant="contained">确认修改</Button>
        </DialogActions>
      </Dialog>

      {/* 修改邮箱对话框 */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>修改邮箱</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            当前邮箱: {currentUser?.email || 'user@example.com'}
          </Typography>
          <TextField
            fullWidth
            type="email"
            label="新邮箱地址"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            margin="normal"
            helperText="修改后需要验证新邮箱地址"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>取消</Button>
          <Button onClick={handleEmailChange} variant="contained">确认修改</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSecurity;
