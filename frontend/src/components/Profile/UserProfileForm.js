import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Badge,
  FormHelperText,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Help,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/userSlice';
import { validation, validationRules } from '../../utils/validation';
import { userUtils } from '../../utils/userUtils';
import AvatarUpload from './AvatarUpload';

const UserProfileForm = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector(state => state.user);
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    phone: '',
    avatar: '',
    preferences: {
      theme: 'light',
      language: 'zh-CN',
      notifications: {
        email: true,
        push: true,
        journal: true,
        meditation: true,
        garden: false,
      },
      privacy: {
        profileVisible: true,
        showActivity: false,
        shareProgress: true,
      }
    }
  });

  // 初始化表单数据
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || '',
        location: currentUser.location || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || '',
        preferences: {
          theme: currentUser.preferences?.theme || 'light',
          language: currentUser.preferences?.language || 'zh-CN',
          notifications: {
            email: currentUser.preferences?.notifications?.email ?? true,
            push: currentUser.preferences?.notifications?.push ?? true,
            journal: currentUser.preferences?.notifications?.journal ?? true,
            meditation: currentUser.preferences?.notifications?.meditation ?? true,
            garden: currentUser.preferences?.notifications?.garden ?? false,
          },
          privacy: {
            profileVisible: currentUser.preferences?.privacy?.profileVisible ?? true,
            showActivity: currentUser.preferences?.privacy?.showActivity ?? false,
            shareProgress: currentUser.preferences?.privacy?.shareProgress ?? true,
          }
        }
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: typeof prev.preferences[category] === 'object' 
          ? { ...prev.preferences[category], [field]: value }
          : value
      }
    }));
  };

  const handleSave = async () => {
    try {
      dispatch(updateUserProfile(profileData));
      setEditing(false);
      setSuccessMessage('个人资料更新成功！');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const handleCancel = () => {
    // 重置为原始数据
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || '',
        location: currentUser.location || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || '',
        preferences: currentUser.preferences || profileData.preferences
      });
    }
    setEditing(false);
  };

  const generateAvatarUrl = (name) => {
    const initials = name ? name.charAt(0).toUpperCase() : 'U';
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=100`;
  };

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* 头像和基本信息 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AvatarUpload
              currentAvatar={profileData.avatar}
              userName={userUtils.getDisplayName(profileData)}
              size={100}
              editable={editing}
              onAvatarChange={(newAvatar) => handleInputChange('avatar', newAvatar)}
            />
            
            <Box sx={{ ml: 3, flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                {profileData.firstName || profileData.username || '用户'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profileData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.bio || '这个人很懒，什么都没留下...'}
              </Typography>
            </Box>

            <Box>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                >
                  编辑资料
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    取消
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 个人信息表单 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            个人信息
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="用户名"
                value={profileData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="邮箱"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="姓"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="名"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="出生日期"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!editing}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!editing}>
                <InputLabel>性别</InputLabel>
                <Select
                  value={profileData.gender}
                  label="性别"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="">不设置</MenuItem>
                  <MenuItem value="male">男</MenuItem>
                  <MenuItem value="female">女</MenuItem>
                  <MenuItem value="other">其他</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="所在地"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="电话"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="个人简介"
                multiline
                rows={3}
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!editing}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 偏好设置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            偏好设置
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!editing}>
                <InputLabel>主题</InputLabel>
                <Select
                  value={profileData.preferences.theme}
                  label="主题"
                  onChange={(e) => handlePreferenceChange('theme', null, e.target.value)}
                >
                  <MenuItem value="light">浅色主题</MenuItem>
                  <MenuItem value="dark">深色主题</MenuItem>
                  <MenuItem value="auto">跟随系统</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!editing}>
                <InputLabel>语言</InputLabel>
                <Select
                  value={profileData.preferences.language}
                  label="语言"
                  onChange={(e) => handlePreferenceChange('language', null, e.target.value)}
                >
                  <MenuItem value="zh-CN">简体中文</MenuItem>
                  <MenuItem value="zh-TW">繁体中文</MenuItem>
                  <MenuItem value="en-US">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            通知设置
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.notifications.email}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="邮件通知"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.notifications.push}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="推送通知"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.notifications.journal}
                    onChange={(e) => handlePreferenceChange('notifications', 'journal', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="日志提醒"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.notifications.meditation}
                    onChange={(e) => handlePreferenceChange('notifications', 'meditation', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="冥想提醒"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            隐私设置
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.privacy.profileVisible}
                    onChange={(e) => handlePreferenceChange('privacy', 'profileVisible', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="公开个人资料"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.privacy.showActivity}
                    onChange={(e) => handlePreferenceChange('privacy', 'showActivity', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="显示活动状态"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.preferences.privacy.shareProgress}
                    onChange={(e) => handlePreferenceChange('privacy', 'shareProgress', e.target.checked)}
                    disabled={!editing}
                  />
                }
                label="分享进度"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfileForm;
