import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  GetApp,
  CloudDownload,
  CheckCircle,
  Warning,
  Info,
  FileDownload,
  DataObject,
  Create,
  SelfImprovement,
  LocalFlorist,
  Person,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const DataExport = () => {
  const { currentUser } = useSelector(state => state.user);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedData, setSelectedData] = useState({
    profile: true,
    journals: true,
    meditation: true,
    garden: false,
    preferences: true,
    stats: true,
  });
  const [exportFormat, setExportFormat] = useState('json');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const steps = ['选择数据', '确认导出', '下载文件'];

  const dataTypes = [
    {
      key: 'profile',
      label: '个人资料',
      description: '用户名、邮箱、个人信息等',
      icon: Person,
      size: '< 1KB',
      color: 'primary',
    },
    {
      key: 'journals',
      label: '日志记录',
      description: '所有日志条目、心情记录等',
      icon: Create,
      size: '~150KB',
      color: 'secondary',
    },
    {
      key: 'meditation',
      label: '冥想数据',
      description: '冥想会话、进度、统计等',
      icon: SelfImprovement,
      size: '~50KB',
      color: 'info',
    },
    {
      key: 'garden',
      label: '虚拟花园',
      description: '植物状态、园艺活动记录',
      icon: LocalFlorist,
      size: '~25KB',
      color: 'success',
    },
    {
      key: 'preferences',
      label: '应用设置',
      description: '主题、通知、隐私等设置',
      icon: DataObject,
      size: '< 1KB',
      color: 'warning',
    },
    {
      key: 'stats',
      label: '统计数据',
      description: '使用统计、成就、徽章等',
      icon: CheckCircle,
      size: '~10KB',
      color: 'error',
    },
  ];

  const handleDataToggle = (dataType) => {
    setSelectedData(prev => ({
      ...prev,
      [dataType]: !prev[dataType]
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      // 模拟数据收集过程
      const selectedTypes = Object.keys(selectedData).filter(key => selectedData[key]);
      const totalSteps = selectedTypes.length;
      
      const exportData = {};
      
      for (let i = 0; i < selectedTypes.length; i++) {
        const dataType = selectedTypes[i];
        
        // 模拟数据收集延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据收集
        exportData[dataType] = generateMockData(dataType);
        
        setExportProgress(((i + 1) / totalSteps) * 100);
      }

      // 添加导出元数据
      exportData._metadata = {
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser.username,
        version: '1.0.0',
        format: exportFormat,
      };

      // 创建文件并下载
      const fileName = `happy-day-data-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      let fileContent, mimeType;

      if (exportFormat === 'json') {
        fileContent = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
      } else if (exportFormat === 'csv') {
        fileContent = convertToCSV(exportData);
        mimeType = 'text/csv';
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      handleNext();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const generateMockData = (dataType) => {
    switch (dataType) {
      case 'profile':
        return {
          username: currentUser.username,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          bio: currentUser.bio,
          joinedAt: currentUser.joinedAt,
        };
      case 'journals':
        return Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          title: `日志 ${i + 1}`,
          content: `这是第 ${i + 1} 篇日志的内容...`,
          mood: ['happy', 'sad', 'excited', 'calm', 'anxious'][i % 5],
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        }));
      case 'meditation':
        return Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          duration: [5, 10, 15, 20][i % 4],
          type: ['breathing', 'mindfulness', 'body-scan', 'loving-kindness'][i % 4],
          completedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        }));
      case 'garden':
        return {
          plants: [
            { id: 1, type: 'sunflower', level: 3, lastWatered: new Date().toISOString() },
            { id: 2, type: 'rose', level: 2, lastWatered: new Date().toISOString() },
          ],
          activities: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            action: ['water', 'fertilize', 'prune'][i % 3],
            plantId: (i % 2) + 1,
            timestamp: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
          })),
        };
      case 'preferences':
        return currentUser.preferences;
      case 'stats':
        return {
          totalJournals: 25,
          totalMeditations: 15,
          totalGardenActivities: 10,
          streak: 7,
          badges: ['beginner', 'consistent', 'writer'],
        };
      default:
        return {};
    }
  };

  const convertToCSV = (data) => {
    // 简单的CSV转换（实际应用中需要更复杂的处理）
    const csv = [];
    csv.push('Data Type,Key,Value');
    
    Object.keys(data).forEach(dataType => {
      if (dataType === '_metadata') return;
      
      const typeData = data[dataType];
      if (Array.isArray(typeData)) {
        typeData.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            csv.push(`${dataType}[${index}],${key},${item[key]}`);
          });
        });
      } else if (typeof typeData === 'object') {
        Object.keys(typeData).forEach(key => {
          csv.push(`${dataType},${key},${JSON.stringify(typeData[key])}`);
        });
      }
    });
    
    return csv.join('\n');
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setExporting(false);
    setExportProgress(0);
  };

  const getTotalSize = () => {
    const selectedTypes = Object.keys(selectedData).filter(key => selectedData[key]);
    let totalSize = 0;
    
    selectedTypes.forEach(type => {
      const dataType = dataTypes.find(dt => dt.key === type);
      if (dataType) {
        const sizeStr = dataType.size.replace(/[^0-9]/g, '');
        totalSize += parseInt(sizeStr) || 0;
      }
    });
    
    return totalSize > 1000 ? `~${(totalSize / 1000).toFixed(1)}MB` : `~${totalSize}KB`;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              选择您要导出的数据类型。所有数据将以您选择的格式打包下载。
            </Typography>
            
            <FormControl component="fieldset" variant="standard" sx={{ mb: 3 }}>
              <FormLabel component="legend">数据类型</FormLabel>
              <FormGroup>
                {dataTypes.map((dataType) => {
                  const IconComponent = dataType.icon;
                  return (
                    <FormControlLabel
                      key={dataType.key}
                      control={
                        <Checkbox
                          checked={selectedData[dataType.key]}
                          onChange={() => handleDataToggle(dataType.key)}
                          color={dataType.color}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconComponent color={dataType.color} fontSize="small" />
                          <Box>
                            <Typography variant="body2">
                              {dataType.label} ({dataType.size})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dataType.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">导出格式</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                    />
                  }
                  label="JSON (.json)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                    />
                  }
                  label="CSV (.csv)"
                />
              </FormGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                即将导出以下数据，预计文件大小：{getTotalSize()}
              </Typography>
            </Alert>

            <List>
              {Object.keys(selectedData)
                .filter(key => selectedData[key])
                .map(key => {
                  const dataType = dataTypes.find(dt => dt.key === key);
                  const IconComponent = dataType.icon;
                  return (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <IconComponent color={dataType.color} />
                      </ListItemIcon>
                      <ListItemText
                        primary={dataType.label}
                        secondary={`${dataType.description} • ${dataType.size}`}
                      />
                    </ListItem>
                  );
                })}
            </List>

            {exporting && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  导出进度: {Math.round(exportProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={exportProgress} />
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              导出完成！
            </Typography>
            <Typography variant="body2" color="text.secondary">
              您的数据已成功导出并下载到本地。
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GetApp color="primary" />
            数据导出
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            导出您在 Happy Day 中的所有数据，包括日志、冥想记录、虚拟花园等。
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            onClick={() => setOpen(true)}
            size="large"
          >
            开始导出
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={exporting}
      >
        <DialogTitle>
          数据导出
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={exporting}
          >
            {activeStep === 2 ? '关闭' : '取消'}
          </Button>
          
          {activeStep > 0 && activeStep < 2 && (
            <Button
              onClick={handleBack}
              disabled={exporting}
            >
              上一步
            </Button>
          )}
          
          {activeStep === 0 && (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={Object.values(selectedData).every(v => !v)}
            >
              下一步
            </Button>
          )}
          
          {activeStep === 1 && (
            <Button
              onClick={handleExport}
              variant="contained"
              disabled={exporting}
              startIcon={exporting ? <CircularProgress size={16} /> : <FileDownload />}
            >
              {exporting ? '导出中...' : '开始导出'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataExport;
