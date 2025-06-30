import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  TextField,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Keyboard,
  Search,
  Create,
  SelfImprovement,
  LocalFlorist,
  Person,
  Dashboard,
  Add,
  Help,
  Settings,
  Save,
  Refresh,
  Close,
  Edit,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ShortcutManager = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [shortcuts, setShortcuts] = useState({});
  const [customShortcuts, setCustomShortcuts] = useState({});
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  // 默认快捷键配置
  const defaultShortcuts = {
    // 全局快捷键
    'ctrl+k': {
      id: 'search',
      description: '打开全局搜索',
      category: 'global',
      icon: Search,
      action: () => {
        // 触发搜索打开事件
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true
        }));
      }
    },
    'ctrl+n': {
      id: 'quick-actions',
      description: '打开快捷操作面板',
      category: 'global',
      icon: Add,
      action: () => {
        // 触发快捷操作面板
        console.log('Opening quick actions panel');
      }
    },
    'ctrl+?': {
      id: 'help',
      description: '打开帮助中心',
      category: 'global',
      icon: Help,
      action: () => {
        // 触发帮助中心
        console.log('Opening help center');
      }
    },
    
    // 导航快捷键
    'ctrl+1': {
      id: 'dashboard',
      description: '转到仪表板',
      category: 'navigation',
      icon: Dashboard,
      action: () => navigate('/app/dashboard')
    },
    'ctrl+2': {
      id: 'journal',
      description: '转到日志页面',
      category: 'navigation',
      icon: Create,
      action: () => navigate('/app/journal')
    },
    'ctrl+3': {
      id: 'meditation',
      description: '转到冥想页面',
      category: 'navigation',
      icon: SelfImprovement,
      action: () => navigate('/app/meditation')
    },
    'ctrl+4': {
      id: 'garden',
      description: '转到虚拟花园',
      category: 'navigation',
      icon: LocalFlorist,
      action: () => navigate('/app/garden')
    },
    'ctrl+5': {
      id: 'profile',
      description: '转到个人资料',
      category: 'navigation',
      icon: Person,
      action: () => navigate('/app/profile')
    },

    // 操作快捷键
    'ctrl+s': {
      id: 'save',
      description: '保存当前内容',
      category: 'actions',
      icon: Save,
      action: () => {
        // 触发保存事件
        document.dispatchEvent(new CustomEvent('shortcut-save'));
      }
    },
    'ctrl+r': {
      id: 'refresh',
      description: '刷新页面内容',
      category: 'actions',
      icon: Refresh,
      action: () => {
        window.location.reload();
      }
    },
    'escape': {
      id: 'close',
      description: '关闭对话框/弹窗',
      category: 'actions',
      icon: Close,
      action: () => {
        // 触发关闭事件
        document.dispatchEvent(new CustomEvent('shortcut-close'));
      }
    },
  };

  const categories = {
    global: { label: '全局', icon: Keyboard },
    navigation: { label: '导航', icon: KeyboardArrowRight },
    actions: { label: '操作', icon: Edit },
  };

  useEffect(() => {
    // 加载自定义快捷键
    const saved = localStorage.getItem('customShortcuts');
    if (saved) {
      setCustomShortcuts(JSON.parse(saved));
    }

    // 加载快捷键启用状态
    const enabled = localStorage.getItem('shortcutsEnabled');
    setShortcutsEnabled(enabled !== 'false');

    // 合并默认和自定义快捷键
    setShortcuts({ ...defaultShortcuts, ...JSON.parse(saved || '{}') });
  }, []);

  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (event) => {
      // 如果正在编辑输入框，忽略快捷键
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      const combo = [
        event.ctrlKey && 'ctrl',
        event.altKey && 'alt',
        event.shiftKey && 'shift',
        key
      ].filter(Boolean).join('+');

      const shortcut = shortcuts[combo];
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, shortcutsEnabled]);

  const handleShortcutToggle = (enabled) => {
    setShortcutsEnabled(enabled);
    localStorage.setItem('shortcutsEnabled', enabled.toString());
  };

  const handleEditShortcut = (shortcutKey, shortcut) => {
    setEditingShortcut({ key: shortcutKey, ...shortcut });
  };

  const handleSaveShortcut = (key, newKey) => {
    const updatedShortcuts = { ...shortcuts };
    const shortcut = updatedShortcuts[key];
    
    if (key !== newKey) {
      delete updatedShortcuts[key];
      updatedShortcuts[newKey] = shortcut;
    }

    setShortcuts(updatedShortcuts);
    
    // 保存自定义快捷键
    const customOnly = Object.keys(updatedShortcuts)
      .filter(k => !defaultShortcuts[k])
      .reduce((obj, k) => {
        obj[k] = updatedShortcuts[k];
        return obj;
      }, {});
    
    setCustomShortcuts(customOnly);
    localStorage.setItem('customShortcuts', JSON.stringify(customOnly));
    setEditingShortcut(null);
  };

  const handleResetShortcuts = () => {
    setShortcuts(defaultShortcuts);
    setCustomShortcuts({});
    localStorage.removeItem('customShortcuts');
  };

  const formatShortcut = (shortcut) => {
    return shortcut.split('+').map(part => {
      switch (part) {
        case 'ctrl': return '⌘';
        case 'alt': return '⌥';
        case 'shift': return '⇧';
        case 'escape': return 'Esc';
        default: return part.toUpperCase();
      }
    }).join(' + ');
  };

  const filteredShortcuts = Object.entries(shortcuts).filter(([key, shortcut]) =>
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((groups, [key, shortcut]) => {
    const category = shortcut.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push([key, shortcut]);
    return groups;
  }, {});

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Keyboard color="primary" />
          <Typography variant="h6">
            键盘快捷键
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <FormControlLabel
            control={
              <Switch
                checked={shortcutsEnabled}
                onChange={(e) => handleShortcutToggle(e.target.checked)}
                color="primary"
              />
            }
            label="启用快捷键"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 搜索框 */}
        <TextField
          fullWidth
          placeholder="搜索快捷键..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 3 }}
        />

        {/* 快捷键提示卡片 */}
        <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2">
              💡 提示：按 <Chip label="Ctrl + ?" size="small" /> 随时查看快捷键列表
            </Typography>
          </CardContent>
        </Card>

        {/* 快捷键列表 */}
        {Object.entries(groupedShortcuts).map(([categoryKey, categoryShortcuts]) => {
          const category = categories[categoryKey] || { label: categoryKey, icon: Keyboard };
          const IconComponent = category.icon;
          
          return (
            <Box key={categoryKey} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <IconComponent color="primary" />
                {category.label}
              </Typography>
              
              <Grid container spacing={1}>
                {categoryShortcuts.map(([key, shortcut]) => {
                  const IconComponent = shortcut.icon;
                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconComponent color="action" fontSize="small" />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight={500}>
                                {shortcut.description}
                              </Typography>
                              <Chip
                                label={formatShortcut(key)}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5, fontSize: 11 }}
                              />
                            </Box>
                            <Tooltip title="编辑快捷键">
                              <IconButton
                                size="small"
                                onClick={() => handleEditShortcut(key, shortcut)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}

        {filteredShortcuts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              没有找到匹配的快捷键
            </Typography>
          </Box>
        )}

        {/* 快捷键使用技巧 */}
        <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              使用技巧
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="全局搜索"
                  secondary="在任何页面按 Ctrl+K 快速搜索内容和功能"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="快速导航"
                  secondary="使用 Ctrl+数字键 快速切换页面"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="关闭弹窗"
                  secondary="按 Esc 键快速关闭对话框和弹窗"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleResetShortcuts} color="warning">
          重置默认
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>
          关闭
        </Button>
      </DialogActions>

      {/* 编辑快捷键对话框 */}
      {editingShortcut && (
        <Dialog
          open={Boolean(editingShortcut)}
          onClose={() => setEditingShortcut(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>编辑快捷键</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {editingShortcut.description}
            </Typography>
            <TextField
              fullWidth
              label="快捷键组合"
              defaultValue={editingShortcut.key}
              placeholder="例如: ctrl+shift+j"
              helperText="使用 + 分隔修饰键，支持 ctrl, alt, shift"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingShortcut(null)}>
              取消
            </Button>
            <Button variant="contained">
              保存
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default ShortcutManager;
