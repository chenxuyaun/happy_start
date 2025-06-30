import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Help,
  ExpandMore,
  Search,
  QuestionAnswer,
  VideoLibrary,
  Description,
  ContactSupport,
  Create,
  SelfImprovement,
  LocalFlorist,
  Person,
  Settings,
  GetApp,
  Security,
  TrendingUp,
} from '@mui/icons-material';

const HelpSystem = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const helpCategories = [
    { id: 'all', label: '全部', icon: Help },
    { id: 'getting-started', label: '快速入门', icon: TrendingUp },
    { id: 'journal', label: '日志功能', icon: Create },
    { id: 'meditation', label: '冥想指导', icon: SelfImprovement },
    { id: 'garden', label: '虚拟花园', icon: LocalFlorist },
    { id: 'profile', label: '个人设置', icon: Person },
    { id: 'troubleshooting', label: '问题排查', icon: ContactSupport },
  ];

  const helpItems = [
    {
      id: 1,
      category: 'getting-started',
      question: '如何开始使用 Happy Day？',
      answer: '欢迎使用 Happy Day！首先完善您的个人资料，然后尝试写第一篇日志或开始一次冥想练习。您也可以查看虚拟花园，开始照料您的第一株植物。',
      tags: ['新手', '入门'],
      type: 'faq',
    },
    {
      id: 2,
      category: 'journal',
      question: '如何写日志？',
      answer: '点击侧边栏的"日志"或使用快捷操作面板中的"写日志"按钮。您可以记录心情、添加标签、插入图片，并设置隐私级别。',
      tags: ['日志', '写作'],
      type: 'faq',
    },
    {
      id: 3,
      category: 'meditation',
      question: '冥想功能怎么使用？',
      answer: '在冥想页面选择适合的冥想类型和时长，点击开始按钮。您可以选择引导冥想或自由冥想，系统会记录您的练习进度。',
      tags: ['冥想', '放松'],
      type: 'faq',
    },
    {
      id: 4,
      category: 'garden',
      question: '虚拟花园如何运作？',
      answer: '虚拟花园反映您的使用活跃度。完成日志、冥想等活动会为植物提供"营养"，让它们成长。定期浇水和施肥可以保持植物健康。',
      tags: ['花园', '植物', '成长'],
      type: 'faq',
    },
    {
      id: 5,
      category: 'profile',
      question: '如何保护我的隐私？',
      answer: '在个人资料的隐私设置中，您可以控制资料可见性、活动状态显示等。我们严格保护您的数据安全，不会与第三方分享个人信息。',
      tags: ['隐私', '安全', '设置'],
      type: 'faq',
    },
    {
      id: 6,
      category: 'troubleshooting',
      question: '应用运行缓慢怎么办？',
      answer: '尝试清除浏览器缓存、关闭其他标签页。您也可以在应用设置中查看性能监控，了解具体的性能指标和优化建议。',
      tags: ['性能', '缓慢', '优化'],
      type: 'faq',
    },
    {
      id: 7,
      category: 'getting-started',
      question: '如何使用搜索功能？',
      answer: '按 Ctrl+K 快速打开搜索面板，或点击顶部导航栏的搜索框。您可以搜索日志内容、功能页面等，支持历史记录和热门搜索。',
      tags: ['搜索', '快捷键'],
      type: 'faq',
    },
    {
      id: 8,
      category: 'profile',
      question: '如何导出我的数据？',
      answer: '在个人设置的"应用设置"标签页中，找到"数据导出"功能。您可以选择要导出的数据类型，支持 JSON 和 CSV 格式。',
      tags: ['数据', '导出', '备份'],
      type: 'faq',
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: '5分钟快速上手 Happy Day',
      description: '了解应用的核心功能和基本操作',
      duration: '5分钟',
      type: 'video',
      category: 'getting-started',
    },
    {
      id: 2,
      title: '如何写出有意义的日志',
      description: '学习日志写作技巧和最佳实践',
      duration: '8分钟',
      type: 'guide',
      category: 'journal',
    },
    {
      id: 3,
      title: '冥想入门指南',
      description: '从零开始学习冥想基础知识',
      duration: '10分钟',
      type: 'guide',
      category: 'meditation',
    },
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setActiveCategory('all');
  };

  const getCategoryIcon = (categoryId) => {
    const category = helpCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : Help;
  };

  return (
    <>
      {/* 帮助浮动按钮 */}
      <Fab
        color="secondary"
        aria-label="help"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          backgroundColor: 'secondary.main',
          '&:hover': {
            backgroundColor: 'secondary.dark',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s',
          zIndex: 999,
        }}
      >
        <Help />
      </Fab>

      {/* 帮助对话框 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Help color="secondary" />
            <Typography variant="h6">
              帮助中心
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* 搜索框 */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="搜索帮助内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* 分类过滤 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {helpCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Chip
                    key={category.id}
                    icon={<IconComponent />}
                    label={category.label}
                    onClick={() => setActiveCategory(category.id)}
                    color={activeCategory === category.id ? 'primary' : 'default'}
                    variant={activeCategory === category.id ? 'filled' : 'outlined'}
                    clickable
                  />
                );
              })}
            </Box>
          </Box>

          {/* 快速教程 */}
          {activeCategory === 'all' && !searchQuery && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoLibrary color="primary" />
                快速教程
              </Typography>
              <Grid container spacing={2}>
                {tutorials.map((tutorial) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {React.createElement(getCategoryIcon(tutorial.category), { color: 'primary' })}
                          <Chip
                            label={tutorial.type === 'video' ? '视频' : '指南'}
                            size="small"
                            color={tutorial.type === 'video' ? 'secondary' : 'info'}
                          />
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {tutorial.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {tutorial.description}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {tutorial.duration}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* 常见问题 */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuestionAnswer color="primary" />
              常见问题 ({filteredItems.length})
            </Typography>

            {filteredItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  没有找到相关的帮助内容
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  尝试调整搜索关键词或选择不同的分类
                </Typography>
              </Box>
            ) : (
              filteredItems.map((item) => {
                const IconComponent = getCategoryIcon(item.category);
                return (
                  <Accordion key={item.id}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <IconComponent color="action" />
                        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                          {item.question}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {item.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 10 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            )}
          </Box>

          {/* 联系支持 */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContactSupport color="primary" />
              需要更多帮助？
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              如果您没有找到需要的答案，我们很乐意为您提供帮助。
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<Description />}>
                查看文档
              </Button>
              <Button variant="outlined" size="small" startIcon={<QuestionAnswer />}>
                联系客服
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpSystem;
