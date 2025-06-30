import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  History,
  TrendingUp,
  Create,
  SelfImprovement,
  LocalFlorist,
  Person,
  Settings,
  Clear,
  NavigateNext,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdvancedSearchDialog from '../AdvancedSearch/AdvancedSearchDialog';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const anchorRef = useRef(null);

  // 模拟搜索数据
  const mockSearchData = [
    {
      id: 1,
      type: 'journal',
      title: '今天的美好时光',
      content: '记录了一次愉快的散步...',
      date: '2025-01-15',
      icon: Create,
      color: 'primary',
      category: '日志',
    },
    {
      id: 2,
      type: 'meditation',
      title: '正念冥想 - 10分钟',
      content: '专注呼吸的冥想练习',
      date: '2025-01-14',
      icon: SelfImprovement,
      color: 'secondary',
      category: '冥想',
    },
    {
      id: 3,
      type: 'garden',
      title: '向日葵',
      content: '我的虚拟花园中的向日葵',
      date: '2025-01-13',
      icon: LocalFlorist,
      color: 'success',
      category: '花园',
    },
    {
      id: 4,
      type: 'profile',
      title: '个人资料设置',
      content: '更新个人信息和偏好',
      date: '2025-01-12',
      icon: Person,
      color: 'info',
      category: '设置',
    },
  ];

  // 快捷导航项
  const quickActions = [
    { label: '写日志', path: '/app/journal', icon: Create, color: 'primary' },
    { label: '开始冥想', path: '/app/meditation', icon: SelfImprovement, color: 'secondary' },
    { label: '查看花园', path: '/app/garden', icon: LocalFlorist, color: 'success' },
    { label: '个人资料', path: '/app/profile', icon: Person, color: 'info' },
  ];

  // 热门搜索
  const trendingSearches = [
    '今天的心情',
    '冥想记录',
    '花园植物',
    '个人设置',
    '统计数据',
  ];

  // 处理搜索
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+K 或 Cmd+K 打开搜索
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
      
      // Escape 关闭搜索
      if (event.key === 'Escape') {
        setOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchFocus = () => {
    setOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery);
      // 执行搜索逻辑
      console.log('Searching for:', searchQuery);
    }
  };

  const addToHistory = (query) => {
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleResultClick = (result) => {
    addToHistory(result.title);
    
    // 导航到相关页面
    switch (result.type) {
      case 'journal':
        navigate('/app/journal');
        break;
      case 'meditation':
        navigate('/app/meditation');
        break;
      case 'garden':
        navigate('/app/garden');
        break;
      case 'profile':
        navigate('/app/profile');
        break;
      default:
        break;
    }
    
    setOpen(false);
    setSearchQuery('');
  };

  const handleQuickActionClick = (action) => {
    navigate(action.path);
    setOpen(false);
  };

  const handleTrendingClick = (term) => {
    setSearchQuery(term);
  };

  const handleHistoryClick = (term) => {
    setSearchQuery(term);
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <Box>
      <TextField
        ref={anchorRef}
        inputRef={searchInputRef}
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        placeholder="搜索内容、功能... (Ctrl+K)"
        size="small"
        sx={{
          minWidth: 300,
          '& .MuiOutlinedInput-root': {
            borderRadius: 20,
            backgroundColor: 'background.paper',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchSubmit(e);
          }
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 500,
            maxHeight: 600,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* 搜索结果 */}
          {searchQuery && searchResults.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                搜索结果
              </Typography>
              <List disablePadding>
                {searchResults.map((result) => {
                  const IconComponent = result.icon;
                  return (
                    <ListItem
                      key={result.id}
                      button
                      onClick={() => handleResultClick(result)}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${result.color}.light` }}>
                          <IconComponent color={result.color} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={result.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {result.content}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={result.category}
                                size="small"
                                color={result.color}
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(result.date)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <NavigateNext color="action" />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}

          {/* 无搜索结果 */}
          {searchQuery && searchResults.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                没有找到相关内容
              </Typography>
            </Box>
          )}

          {/* 快捷操作 */}
          {!searchQuery && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                快捷操作
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Chip
                      key={action.label}
                      icon={<IconComponent />}
                      label={action.label}
                      onClick={() => handleQuickActionClick(action)}
                      color={action.color}
                      variant="outlined"
                      clickable
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {/* 搜索历史 */}
          {!searchQuery && searchHistory.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  最近搜索
                </Typography>
                <IconButton size="small" onClick={clearHistory}>
                  <Clear fontSize="small" />
                </IconButton>
              </Box>
              <List disablePadding>
                {searchHistory.map((term, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleHistoryClick(term)}
                    sx={{ borderRadius: 1, py: 0.5 }}
                  >
                    <ListItemIcon>
                      <History color="action" />
                    </ListItemIcon>
                    <ListItemText primary={term} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* 热门搜索 */}
          {!searchQuery && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <TrendingUp fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                热门搜索
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {trendingSearches.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    size="small"
                    onClick={() => handleTrendingClick(term)}
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* 高级搜索按钮 */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              icon={<FilterList />}
              label="高级搜索"
              onClick={() => {
                setOpen(false);
                setAdvancedSearchOpen(true);
              }}
              variant="outlined"
              color="primary"
              clickable
              sx={{ fontSize: '0.875rem' }}
            />
          </Box>
        </Box>
      </Popover>
      
      {/* 高级搜索对话框 */}
      <AdvancedSearchDialog 
        open={advancedSearchOpen} 
        onClose={() => setAdvancedSearchOpen(false)} 
      />
    </Box>
  );
};

export default GlobalSearch;
