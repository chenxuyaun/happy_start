import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  Divider,
  Chip,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Circle,
  MoreVert,
  Delete,
  MarkAsUnread,
  Settings,
  Clear,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
  Celebration,
  SelfImprovement,
  Create,
  LocalFlorist,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    type: 'meditation',
    title: '冥想提醒',
    message: '您今天还没有进行冥想练习，现在开始10分钟的放松冥想吧！',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'normal',
    icon: SelfImprovement,
    color: 'secondary',
  },
  {
    id: 2,
    type: 'journal',
    title: '日志记录',
    message: '记录今天的美好时光，写下您的感悟和收获。',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'normal',
    icon: Create,
    color: 'primary',
  },
  {
    id: 3,
    type: 'achievement',
    title: '成就解锁',
    message: '恭喜您！已连续使用应用7天，获得"坚持不懈"徽章！',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'high',
    icon: Celebration,
    color: 'success',
  },
  {
    id: 4,
    type: 'garden',
    title: '虚拟花园',
    message: '您的向日葵需要浇水了，快去照顾它吧！',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: 'normal',
    icon: LocalFlorist,
    color: 'info',
  },
  {
    id: 5,
    type: 'system',
    title: '系统更新',
    message: 'Happy Day 应用已更新到 v2.1.0，新增了更多冥想课程！',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    icon: Info,
    color: 'info',
  },
];

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all'); // all, unread, today
  const [selectedNotification, setSelectedNotification] = useState(null);

  const open = Boolean(anchorEl);
  const menuOpen = Boolean(menuAnchorEl);

  // 未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 过滤通知
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'today') {
      const today = new Date();
      const notificationDate = new Date(notification.timestamp);
      return notificationDate.toDateString() === today.toDateString();
    }
    return true;
  });

  // 打开通知面板
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭通知面板
  const handleClose = () => {
    setAnchorEl(null);
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  // 打开菜单
  const handleMenuClick = (event, notification) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  // 标记为已读/未读
  const toggleReadStatus = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read: !n.read }
          : n
      )
    );
    handleMenuClose();
  };

  // 删除通知
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    handleMenuClose();
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 清空所有通知
  const clearAllNotifications = () => {
    setNotifications([]);
    handleClose();
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return timestamp.toLocaleDateString();
  };

  // 获取通知图标
  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    return (
      <Avatar sx={{ bgcolor: `${notification.color}.light` }}>
        <IconComponent color={notification.color} />
      </Avatar>
    );
  };

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'normal': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Tooltip title="通知中心">
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label="notifications"
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
          }
        }}
      >
        {/* 头部 */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              通知中心
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={markAllAsRead}
                  startIcon={<CheckCircle />}
                >
                  全部已读
                </Button>
              )}
              <IconButton
                size="small"
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Clear />
              </IconButton>
            </Box>
          </Box>

          {/* 过滤选项 */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Chip
              label="全部"
              size="small"
              color={filter === 'all' ? 'primary' : 'default'}
              onClick={() => setFilter('all')}
            />
            <Chip
              label="未读"
              size="small"
              color={filter === 'unread' ? 'primary' : 'default'}
              onClick={() => setFilter('unread')}
            />
            <Chip
              label="今天"
              size="small"
              color={filter === 'today' ? 'primary' : 'default'}
              onClick={() => setFilter('today')}
            />
          </Box>
        </Box>

        {/* 通知列表 */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsOff sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {filter === 'all' ? '暂无通知' : 
                 filter === 'unread' ? '没有未读通知' : '今天没有通知'}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    button
                    onClick={() => toggleReadStatus(notification.id)}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      {getNotificationIcon(notification)}
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                          )}
                          <Chip
                            size="small"
                            label={notification.priority}
                            color={getPriorityColor(notification.priority)}
                            sx={{ height: 16, fontSize: 10 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />

                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleMenuClick(e, notification)}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* 底部操作 */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Settings />}
              size="small"
            >
              通知设置
            </Button>
          </Box>
        )}
      </Popover>

      {/* 通知操作菜单 */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {selectedNotification && (
          <div>
            <MenuItem onClick={() => toggleReadStatus(selectedNotification.id)}>
              <MarkAsUnread sx={{ mr: 1 }} />
              {selectedNotification.read ? '标记为未读' : '标记为已读'}
            </MenuItem>
            <MenuItem 
              onClick={() => deleteNotification(selectedNotification.id)}
              sx={{ color: 'error.main' }}
            >
              <Delete sx={{ mr: 1 }} />
              删除通知
            </MenuItem>
          </div>
        )}
      </Menu>
    </Box>
  );
};

export default NotificationCenter;
