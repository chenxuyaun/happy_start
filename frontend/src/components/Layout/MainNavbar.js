import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Keyboard as KeyboardIcon,
  Feedback as FeedbackIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { logout } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../Notifications/NotificationCenter';
import GlobalSearch from '../Search/GlobalSearch';
import DataSyncIndicator from '../Sync/DataSyncIndicator';
import KeyboardShortcutsManager from '../KeyboardShortcuts/KeyboardShortcutsManager';
import AISuggestionsDialog from '../AISuggestions/AISuggestionsDialog';
import FeedbackDialog from '../Feedback/FeedbackDialog';
import AppUpdateNotification from '../AppUpdate/AppUpdateNotification';
import BackendStatusIndicator from '../BackendStatus/BackendStatusIndicator';

const MainNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [aiSuggestionsOpen, setAiSuggestionsOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/app/profile');
    handleClose();
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          mb: 3,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            🌸 Happy Day
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GlobalSearch />
            <DataSyncIndicator />
            <NotificationCenter />
            
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BackendStatusIndicator />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {currentUser?.name || '用户'}
              </Typography>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  src={currentUser?.avatar}
                >
                  {currentUser?.name?.[0] || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 2 }} />
                  个人资料
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <SettingsIcon sx={{ mr: 2 }} />
                  设置
                </MenuItem>
                <MenuItem onClick={() => { setShortcutsOpen(true); handleClose(); }}>
                  <KeyboardIcon sx={{ mr: 2 }} />
                  快捷键设置
                </MenuItem>
                <MenuItem onClick={() => { setFeedbackOpen(true); handleClose(); }}>
                  <FeedbackIcon sx={{ mr: 2 }} />
                  反馈建议
                </MenuItem>
                <MenuItem onClick={() => { setAiSuggestionsOpen(true); handleClose(); }}>
                  <AIIcon sx={{ mr: 2 }} />
                  AI建议
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  退出登录
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* 快捷键管理器对话框 */}
      <KeyboardShortcutsManager 
        open={shortcutsOpen} 
        onClose={() => setShortcutsOpen(false)} 
      />
      
      {/* 反馈对话框 */}
      <FeedbackDialog 
        open={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
      />
      
      {/* AI建议对话框 */}
      <AISuggestionsDialog 
        open={aiSuggestionsOpen} 
        onClose={() => setAiSuggestionsOpen(false)} 
      />
      
      {/* 应用更新通知 */}
      <AppUpdateNotification />
    </>
  );
};

export default MainNavbar;
