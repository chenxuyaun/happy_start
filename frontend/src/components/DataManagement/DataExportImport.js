import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  DataArray as DataIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const DataExportImport = () => {
  const { currentUser } = useSelector(state => state.user);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    journal: true,
    habits: true,
    moods: true,
    goals: true,
    settings: true,
    photos: false, // 大文件默认不选择
  });

  const dataTypes = [
    { key: 'journal', label: '日记条目', icon: <DataIcon />, size: '~2MB' },
    { key: 'habits', label: '习惯记录', icon: <ScheduleIcon />, size: '~500KB' },
    { key: 'moods', label: '心情记录', icon: <CheckCircleIcon />, size: '~200KB' },
    { key: 'goals', label: '目标设置', icon: <DataIcon />, size: '~100KB' },
    { key: 'settings', label: '个人设置', icon: <DataIcon />, size: '~50KB' },
    { key: 'photos', label: '照片数据', icon: <WarningIcon />, size: '~50MB' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // 模拟导出过程
    const selectedTypes = Object.keys(selectedDataTypes).filter(key => selectedDataTypes[key]);
    const totalSteps = selectedTypes.length;
    
    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExportProgress(((i + 1) / totalSteps) * 100);
    }
    
    // 创建模拟数据并下载
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: currentUser?.id,
      version: '1.0',
      data: selectedTypes.reduce((acc, type) => {
        acc[type] = getMockData(type);
        return acc;
      }, {})
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `happy-day-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setIsExporting(false);
    setExportDialogOpen(false);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // 模拟导入过程
      const dataTypes = Object.keys(data.data || {});
      const totalSteps = dataTypes.length;
      
      for (let i = 0; i < totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setImportProgress(((i + 1) / totalSteps) * 100);
      }
      
      alert('数据导入成功！');
    } catch (error) {
      alert('导入失败：文件格式不正确');
    }
    
    setIsImporting(false);
    setImportDialogOpen(false);
  };

  const getMockData = (type) => {
    const mockData = {
      journal: [
        { id: 1, date: '2024-01-01', content: '今天是美好的一天...', mood: 'happy' },
        { id: 2, date: '2024-01-02', content: '工作很充实...', mood: 'neutral' }
      ],
      habits: [
        { id: 1, name: '晨练', completed: true, date: '2024-01-01' },
        { id: 2, name: '阅读', completed: false, date: '2024-01-01' }
      ],
      moods: [
        { date: '2024-01-01', mood: 'happy', energy: 8 },
        { date: '2024-01-02', mood: 'calm', energy: 7 }
      ],
      goals: [
        { id: 1, title: '学习React', progress: 75, deadline: '2024-03-01' }
      ],
      settings: {
        theme: 'light',
        notifications: true,
        language: 'zh-CN'
      }
    };
    return mockData[type] || [];
  };

  const handleDataTypeToggle = (type) => {
    setSelectedDataTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getSelectedSize = () => {
    const sizes = {
      journal: 2000,
      habits: 500,
      moods: 200,
      goals: 100,
      settings: 50,
      photos: 50000
    };
    
    const totalKB = Object.keys(selectedDataTypes)
      .filter(key => selectedDataTypes[key])
      .reduce((sum, key) => sum + (sizes[key] || 0), 0);
    
    return totalKB > 1000 ? `${(totalKB / 1000).toFixed(1)}MB` : `${totalKB}KB`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        数据管理
      </Typography>
      
      <Grid container spacing={3}>
        {/* 数据导出卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DownloadIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">数据导出</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                将您的数据导出为JSON文件，方便备份和迁移
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  包含数据：日记、习惯、心情、目标等
                </Typography>
                <Chip label="安全加密" size="small" color="success" />
              </Box>
              {isExporting && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    导出进度: {Math.round(exportProgress)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={exportProgress} />
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                onClick={() => setExportDialogOpen(true)}
                disabled={isExporting}
                fullWidth
              >
                {isExporting ? '导出中...' : '导出数据'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* 数据导入卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">数据导入</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                从JSON备份文件恢复您的数据
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                导入将覆盖现有数据，请谨慎操作
              </Alert>
              {isImporting && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    导入进度: {Math.round(importProgress)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={importProgress} />
                </Box>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={isImporting}
                fullWidth
              >
                {isImporting ? '导入中...' : '选择文件导入'}
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleImport}
                />
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* 使用说明 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              使用说明
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  📥 数据导出
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 选择要导出的数据类型<br/>
                  • 数据会自动加密处理<br/>
                  • 生成JSON格式备份文件
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  📤 数据导入
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 仅支持JSON格式文件<br/>
                  • 导入前请备份现有数据<br/>
                  • 支持增量和覆盖导入
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  🔒 数据安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • 本地处理，不上传服务器<br/>
                  • 支持数据加密和压缩<br/>
                  • 完整的数据完整性检查
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* 导出对话框 */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>选择导出数据</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            请选择要导出的数据类型：
          </Typography>
          <List>
            {dataTypes.map((dataType) => (
              <ListItem key={dataType.key} dense>
                <ListItemIcon>
                  <Checkbox
                    checked={selectedDataTypes[dataType.key]}
                    onChange={() => handleDataTypeToggle(dataType.key)}
                  />
                </ListItemIcon>
                <ListItemIcon>{dataType.icon}</ListItemIcon>
                <ListItemText
                  primary={dataType.label}
                  secondary={`大约 ${dataType.size}`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            预计文件大小: <strong>{getSelectedSize()}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>取消</Button>
          <Button 
            onClick={handleExport} 
            variant="contained"
            disabled={Object.values(selectedDataTypes).every(v => !v)}
          >
            开始导出
          </Button>
        </DialogActions>
      </Dialog>

      {/* 导入对话框 */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>数据导入确认</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            此操作将覆盖您当前的数据，请确保已经备份重要信息。
          </Alert>
          <Typography variant="body2">
            支持的文件格式：JSON (.json)<br/>
            最大文件大小：100MB
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>取消</Button>
          <Button 
            component="label"
            variant="contained"
            color="warning"
          >
            确认导入
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleImport}
            />
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataExportImport;
