import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tab,
  Tabs,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  CircularProgress,
  Fab,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Mood,
  MoodBad,
  Analytics,
  CalendarToday,
  Search,
  FilterList,
  Refresh,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Timeline,
  TrendingUp,
  Psychology,
  BookmarkBorder,
  Share
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import {
  fetchJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  getEmotionAnalysis,
  setCurrentJournal,
  clearCurrentJournal,
  setFilters,
  clearFilters,
  clearError
} from '../store/journalSlice';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`journal-tabpanel-${index}`}
      aria-labelledby={`journal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const emotionOptions = [
  { value: 'very_happy', label: '非常开心', icon: <SentimentVerySatisfied />, color: '#4caf50' },
  { value: 'happy', label: '开心', icon: <SentimentSatisfied />, color: '#8bc34a' },
  { value: 'neutral', label: '平静', icon: <SentimentNeutral />, color: '#ffc107' },
  { value: 'sad', label: '难过', icon: <SentimentDissatisfied />, color: '#ff9800' },
  { value: 'very_sad', label: '非常难过', icon: <SentimentVeryDissatisfied />, color: '#f44336' }
];

const stressLevels = [
  { value: 1, label: '非常放松' },
  { value: 2, label: '放松' },
  { value: 3, label: '正常' },
  { value: 4, label: '紧张' },
  { value: 5, label: '非常紧张' }
];

const energyLevels = [
  { value: 1, label: '非常疲惫' },
  { value: 2, label: '疲惫' },
  { value: 3, label: '正常' },
  { value: 4, label: '充满活力' },
  { value: 5, label: '精力充沛' }
];

function JournalPage() {
  const dispatch = useDispatch();
  const { journals, currentJournal, emotionAnalysis, loading, error, pagination, filters } = useSelector(
    (state) => state.journal
  );

  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [journalForm, setJournalForm] = useState({
    title: '',
    content: '',
    emotion: 'neutral',
    mood: 3,
    stress: 3,
    energy: 3,
    tags: [],
    date: new Date()
  });
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchJournals());
    dispatch(getEmotionAnalysis({ period: '30d' }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (journal = null) => {
    if (journal) {
      setJournalForm({
        title: journal.title,
        content: journal.content,
        emotion: journal.emotion,
        mood: journal.mood || 3,
        stress: journal.stress || 3,
        energy: journal.energy || 3,
        tags: journal.tags || [],
        date: new Date(journal.createdAt)
      });
      setEditMode(true);
      dispatch(setCurrentJournal(journal));
    } else {
      setJournalForm({
        title: '',
        content: '',
        emotion: 'neutral',
        mood: 3,
        stress: 3,
        energy: 3,
        tags: [],
        date: new Date()
      });
      setEditMode(false);
      dispatch(clearCurrentJournal());
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    dispatch(clearCurrentJournal());
    setJournalForm({
      title: '',
      content: '',
      emotion: 'neutral',
      mood: 3,
      stress: 3,
      energy: 3,
      tags: [],
      date: new Date()
    });
  };

  const handleSaveJournal = async () => {
    try {
      const journalData = {
        ...journalForm,
        date: journalForm.date.toISOString()
      };

      if (editMode && currentJournal) {
        await dispatch(updateJournal({ id: currentJournal.id, data: journalData })).unwrap();
      } else {
        await dispatch(createJournal(journalData)).unwrap();
      }
      
      handleCloseDialog();
      dispatch(fetchJournals()); // 刷新列表
    } catch (error) {
      console.error('保存日记失败:', error);
    }
  };

  const handleDeleteJournal = async (journalId) => {
    if (window.confirm('确定要删除这篇日记吗？')) {
      try {
        await dispatch(deleteJournal(journalId)).unwrap();
      } catch (error) {
        console.error('删除日记失败:', error);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !journalForm.tags.includes(tagInput.trim())) {
      setJournalForm({
        ...journalForm,
        tags: [...journalForm.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setJournalForm({
      ...journalForm,
      tags: journalForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getEmotionIcon = (emotion) => {
    const emotionOption = emotionOptions.find(opt => opt.value === emotion);
    return emotionOption ? emotionOption.icon : <SentimentNeutral />;
  };

  const getEmotionColor = (emotion) => {
    const emotionOption = emotionOptions.find(opt => opt.value === emotion);
    return emotionOption ? emotionOption.color : '#ffc107';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  const filteredJournals = journals.filter(journal => {
    if (searchQuery && !journal.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !journal.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.emotion && journal.emotion !== filters.emotion) {
      return false;
    }
    if (filters.startDate && new Date(journal.createdAt) < filters.startDate) {
      return false;
    }
    if (filters.endDate && new Date(journal.createdAt) > filters.endDate) {
      return false;
    }
    return true;
  });

  // 生成模拟的情绪分析数据
  const mockEmotionData = {
    trends: [
      { date: '06-20', mood: 4, stress: 2, energy: 4 },
      { date: '06-21', mood: 3, stress: 3, energy: 3 },
      { date: '06-22', mood: 5, stress: 1, energy: 5 },
      { date: '06-23', mood: 2, stress: 4, energy: 2 },
      { date: '06-24', mood: 4, stress: 2, energy: 4 },
      { date: '06-25', mood: 3, stress: 3, energy: 3 },
      { date: '06-26', mood: 4, stress: 2, energy: 4 }
    ],
    emotionDistribution: [
      { name: '开心', value: 45, color: '#4caf50' },
      { name: '平静', value: 30, color: '#ffc107' },
      { name: '难过', value: 15, color: '#ff9800' },
      { name: '兴奋', value: 10, color: '#2196f3' }
    ],
    insights: [
      '本周你的整体心情比较稳定，开心的时候占多数',
      '压力水平相对较低，保持得很好',
      '建议在难过的时候尝试进行冥想练习',
      '你的能量水平与心情成正比，说明情绪管理很重要'
    ]
  };

  const speedDialActions = [
    {
      icon: <Add />,
      name: '新建日记',
      onClick: () => handleOpenDialog()
    },
    {
      icon: <Analytics />,
      name: '情绪分析',
      onClick: () => setTabValue(1)
    },
    {
      icon: <FilterList />,
      name: '筛选',
      onClick: () => setShowFilters(!showFilters)
    }
  ];

  if (loading && journals.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          {/* 页面标题 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
              心情日记
            </Typography>
            <Box>
              <Tooltip title="刷新">
                <IconButton onClick={() => dispatch(fetchJournals())}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* 标签页 */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="journal tabs">
              <Tab label="我的日记" icon={<BookmarkBorder />} />
              <Tab label="情绪分析" icon={<Analytics />} />
            </Tabs>
          </Paper>

          {/* 日记列表标签页 */}
          <TabPanel value={tabValue} index={0}>
            {/* 搜索和筛选 */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="搜索日记内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    筛选
                  </Button>
                </Grid>
              </Grid>

              {/* 筛选器 */}
              {showFilters && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>情绪</InputLabel>
                        <Select
                          value={filters.emotion || ''}
                          onChange={(e) => dispatch(setFilters({ emotion: e.target.value || null }))}
                        >
                          <MenuItem value="">全部</MenuItem>
                          {emotionOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.icon} {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="开始日期"
                        type="date"
                        value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => dispatch(setFilters({ startDate: e.target.value ? new Date(e.target.value) : null }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="结束日期"
                        type="date"
                        value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => dispatch(setFilters({ endDate: e.target.value ? new Date(e.target.value) : null }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button onClick={() => dispatch(clearFilters())}>
                      清除筛选
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>

            {/* 日记列表 */}
            <Grid container spacing={3}>
              {filteredJournals.length > 0 ? (
                filteredJournals.map((journal) => (
                  <Grid item xs={12} md={6} lg={4} key={journal.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getEmotionColor(journal.emotion),
                              mr: 1
                            }}
                          >
                            {getEmotionIcon(journal.emotion)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" noWrap>
                              {journal.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(journal.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {journal.content.length > 100
                            ? `${journal.content.substring(0, 100)}...`
                            : journal.content}
                        </Typography>

                        {/* 情绪指标 */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" display="block">
                            心情: <Rating value={journal.mood || 3} readOnly size="small" />
                          </Typography>
                          <Typography variant="caption" display="block">
                            压力: {stressLevels.find(s => s.value === (journal.stress || 3))?.label}
                          </Typography>
                          <Typography variant="caption" display="block">
                            精力: {energyLevels.find(e => e.value === (journal.energy || 3))?.label}
                          </Typography>
                        </Box>

                        {/* 标签 */}
                        {journal.tags && journal.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {journal.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                      
                      <CardActions>
                        <Button size="small" onClick={() => handleOpenDialog(journal)}>
                          <Edit sx={{ mr: 1 }} />编辑
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteJournal(journal.id)}>
                          <Delete sx={{ mr: 1 }} />删除
                        </Button>
                        <Button size="small">
                          <Share sx={{ mr: 1 }} />分享
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Mood sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      还没有日记记录
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      开始记录你的心情，追踪情绪变化
                    </Typography>
                    <Button variant="contained" onClick={() => handleOpenDialog()}>写第一篇日记</Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* 情绪分析标签页 */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* 情绪趋势图 */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                      情绪趋势 (最近7天)
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockEmotionData.trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 5]} />
                        <ChartTooltip />
                        <Line type="monotone" dataKey="mood" stroke="#2196f3" strokeWidth={2} name="心情" />
                        <Line type="monotone" dataKey="stress" stroke="#f44336" strokeWidth={2} name="压力" />
                        <Line type="monotone" dataKey="energy" stroke="#4caf50" strokeWidth={2} name="精力" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* 情绪分布饼图 */}
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      情绪分布
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mockEmotionData.emotionDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockEmotionData.emotionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* 情绪洞察 */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                      情绪洞察
                    </Typography>
                    <List>
                      {mockEmotionData.insights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.light' }}>
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={insight} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* 悬浮操作按钮 */}
          <SpeedDial
            ariaLabel="快速操作"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>

          {/* 日记编辑对话框 */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              {editMode ? '编辑日记' : '新建日记'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="标题"
                    value={journalForm.title}
                    onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="内容"
                    value={journalForm.content}
                    onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                    placeholder="记录今天的心情和想法..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>情绪</InputLabel>
                    <Select
                      value={journalForm.emotion}
                      onChange={(e) => setJournalForm({ ...journalForm, emotion: e.target.value })}
                    >
                      {emotionOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="日期"
                    type="date"
                    value={journalForm.date ? journalForm.date.toISOString().split('T')[0] : ''}
                    onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value ? new Date(e.target.value) : new Date() })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography gutterBottom>心情评分</Typography>
                  <Rating
                    value={journalForm.mood}
                    onChange={(event, newValue) => {
                      setJournalForm({ ...journalForm, mood: newValue });
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>压力水平</Typography>
                  <Slider
                    value={journalForm.stress}
                    onChange={(event, newValue) => {
                      setJournalForm({ ...journalForm, stress: newValue });
                    }}
                    marks={stressLevels.map(level => ({ value: level.value, label: level.label }))}
                    step={1}
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>精力水平</Typography>
                  <Slider
                    value={journalForm.energy}
                    onChange={(event, newValue) => {
                      setJournalForm({ ...journalForm, energy: newValue });
                    }}
                    marks={energyLevels.map(level => ({ value: level.value, label: level.label }))}
                    step={1}
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <TextField
                      size="small"
                      label="添加标签"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button onClick={handleAddTag}>添加</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {journalForm.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>取消</Button>
              <Button onClick={handleSaveJournal} variant="contained" disabled={!journalForm.title || !journalForm.content}>
                {editMode ? '更新' : '保存'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
  );
}

export default JournalPage;
