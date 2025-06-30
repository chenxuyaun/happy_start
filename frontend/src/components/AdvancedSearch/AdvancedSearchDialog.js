import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Book as BookIcon,
  SelfImprovement as MeditationIcon,
  LocalFlorist as GardenIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const AdvancedSearchDialog = ({ open, onClose }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    contentType: 'all',
    dateRange: {
      start: null,
      end: null,
    },
    tags: [],
    mood: '',
    includeDrafts: false,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const contentTypes = [
    { value: 'all', label: '全部内容', icon: '📄' },
    { value: 'journal', label: '日记', icon: '📝' },
    { value: 'meditation', label: '冥想记录', icon: '🧘' },
    { value: 'garden', label: '花园记录', icon: '🌱' },
    { value: 'habits', label: '习惯记录', icon: '✅' },
  ];

  const moods = [
    { value: '', label: '全部心情' },
    { value: 'happy', label: '开心 😊' },
    { value: 'sad', label: '伤心 😢' },
    { value: 'calm', label: '平静 😌' },
    { value: 'excited', label: '兴奋 🤩' },
    { value: 'stressed', label: '焦虑 😰' },
  ];

  const sortOptions = [
    { value: 'date', label: '按日期' },
    { value: 'relevance', label: '按相关性' },
    { value: 'title', label: '按标题' },
    { value: 'mood', label: '按心情' },
  ];

  const mockResults = [
    {
      id: 1,
      type: 'journal',
      title: '美好的一天',
      content: '今天心情很好，完成了很多工作...',
      date: '2024-01-15',
      mood: 'happy',
      tags: ['工作', '心情'],
    },
    {
      id: 2,
      type: 'meditation',
      title: '晨间冥想',
      content: '进行了20分钟的正念冥想...',
      date: '2024-01-14',
      tags: ['冥想', '早晨'],
    },
    {
      id: 3,
      type: 'garden',
      title: '种植新花',
      content: '在花园里种植了玫瑰花...',
      date: '2024-01-13',
      tags: ['园艺', '玫瑰'],
    },
  ];

  const handleSearch = async () => {
    setSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      // 这里应该是实际的搜索逻辑
      let results = mockResults;
      
      // 根据搜索参数过滤结果
      if (searchParams.query) {
        results = results.filter(item => 
          item.title.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          item.content.toLowerCase().includes(searchParams.query.toLowerCase())
        );
      }
      
      if (searchParams.contentType !== 'all') {
        results = results.filter(item => item.type === searchParams.contentType);
      }
      
      if (searchParams.mood) {
        results = results.filter(item => item.mood === searchParams.mood);
      }
      
      setSearchResults(results);
      setSearching(false);
    }, 1500);
  };

  const handleClear = () => {
    setSearchParams({
      query: '',
      contentType: 'all',
      dateRange: { start: null, end: null },
      tags: [],
      mood: '',
      includeDrafts: false,
      sortBy: 'date',
      sortOrder: 'desc',
    });
    setSearchResults([]);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'journal': return <BookIcon />;
      case 'meditation': return <MeditationIcon />;
      case 'garden': return <GardenIcon />;
      default: return <BookIcon />;
    }
  };

  const getTypeName = (type) => {
    const typeObj = contentTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ mr: 1 }} />
          高级搜索
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* 基础搜索 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="搜索关键词"
              value={searchParams.query}
              onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
              placeholder="输入要搜索的内容..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          {/* 高级筛选 */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  高级筛选
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>内容类型</InputLabel>
                      <Select
                        value={searchParams.contentType}
                        label="内容类型"
                        onChange={(e) => setSearchParams({...searchParams, contentType: e.target.value})}
                      >
                        {contentTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box display="flex" alignItems="center">
                              <Typography sx={{ mr: 1 }}>{type.icon}</Typography>
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>心情</InputLabel>
                      <Select
                        value={searchParams.mood}
                        label="心情"
                        onChange={(e) => setSearchParams({...searchParams, mood: e.target.value})}
                      >
                        {moods.map(mood => (
                          <MenuItem key={mood.value} value={mood.value}>
                            {mood.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>排序方式</InputLabel>
                      <Select
                        value={searchParams.sortBy}
                        label="排序方式"
                        onChange={(e) => setSearchParams({...searchParams, sortBy: e.target.value})}
                      >
                        {sortOptions.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>排序顺序</InputLabel>
                      <Select
                        value={searchParams.sortOrder}
                        label="排序顺序"
                        onChange={(e) => setSearchParams({...searchParams, sortOrder: e.target.value})}
                      >
                        <MenuItem value="desc">降序</MenuItem>
                        <MenuItem value="asc">升序</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={searchParams.includeDrafts}
                          onChange={(e) => setSearchParams({...searchParams, includeDrafts: e.target.checked})}
                        />
                      }
                      label="包含草稿"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                搜索结果 ({searchResults.length})
              </Typography>
              <List>
                {searchResults.map((result, index) => (
                  <React.Fragment key={result.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getTypeIcon(result.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">{result.title}</Typography>
                            <Chip label={getTypeName(result.type)} size="small" />
                            {result.mood && (
                              <Chip 
                                label={moods.find(m => m.value === result.mood)?.label || result.mood} 
                                size="small" 
                                color="primary" 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {result.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {result.date}
                            </Typography>
                            {result.tags && result.tags.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {result.tags.map(tag => (
                                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < searchResults.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={handleClear}
          startIcon={<ClearIcon />}
          disabled={searching}
        >
          清除
        </Button>
        <Button
          onClick={handleSearch}
          variant="contained"
          startIcon={<SearchIcon />}
          disabled={searching}
        >
          {searching ? '搜索中...' : '搜索'}
        </Button>
        <Button onClick={onClose}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
