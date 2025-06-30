import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Memory,
  Speed,
  Storage,
  NetworkCheck,
  Battery,
  Warning,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  Refresh,
  BugReport,
  Analytics,
} from '@mui/icons-material';

const PerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [monitoring, setMonitoring] = useState(false);

  // 性能指标
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    domNodes: 0,
    jsHeapSize: 0,
    bundleSize: 0,
    apiCallsCount: 0,
    errors: [],
    warnings: [],
  });

  // 模拟性能数据收集
  useEffect(() => {
    const collectPerformanceData = () => {
      // 模拟获取真实性能数据
      const mockData = {
        loadTime: Math.random() * 2000 + 500, // 500-2500ms
        renderTime: Math.random() * 100 + 10, // 10-110ms
        memoryUsage: Math.random() * 50 + 20, // 20-70MB
        networkLatency: Math.random() * 200 + 50, // 50-250ms
        domNodes: Math.floor(Math.random() * 1000 + 500), // 500-1500 nodes
        jsHeapSize: Math.random() * 30 + 10, // 10-40MB
        bundleSize: 2.5, // MB
        apiCallsCount: Math.floor(Math.random() * 20 + 5),
        fps: Math.floor(Math.random() * 10 + 55), // 55-65 FPS
        errors: [
          { message: 'TypeError: Cannot read property of undefined', count: 2, severity: 'error' },
          { message: 'Network request failed', count: 1, severity: 'error' },
        ],
        warnings: [
          { message: 'Large DOM tree detected', count: 1, severity: 'warning' },
          { message: 'Memory usage is high', count: 3, severity: 'warning' },
        ],
      };

      setMetrics(mockData);
    };

    if (monitoring) {
      collectPerformanceData();
      const interval = setInterval(collectPerformanceData, 5000);
      return () => clearInterval(interval);
    }
  }, [monitoring]);

  // 真实性能 API 数据收集
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      if (navigation) {
        setPerformanceData({
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnect: navigation.connectEnd - navigation.connectStart,
          serverResponse: navigation.responseEnd - navigation.requestStart,
          domParsing: navigation.domInteractive - navigation.responseEnd,
        });
      }

      // 获取内存信息（如果可用）
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          jsHeapSize: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
          heapLimit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
        }));
      }
    }
  }, []);

  const getPerformanceGrade = (loadTime) => {
    if (loadTime < 1000) return { grade: 'A', color: 'success', label: '优秀' };
    if (loadTime < 2000) return { grade: 'B', color: 'info', label: '良好' };
    if (loadTime < 3000) return { grade: 'C', color: 'warning', label: '一般' };
    return { grade: 'D', color: 'error', label: '需优化' };
  };

  const getMetricStatus = (value, thresholds) => {
    if (value <= thresholds.good) return { status: 'good', color: 'success', icon: CheckCircle };
    if (value <= thresholds.fair) return { status: 'fair', color: 'warning', icon: Warning };
    return { status: 'poor', color: 'error', icon: Warning };
  };

  const performanceGrade = getPerformanceGrade(metrics.loadTime);

  const performanceItems = [
    {
      label: '页面加载时间',
      value: `${metrics.loadTime.toFixed(0)}ms`,
      status: getMetricStatus(metrics.loadTime, { good: 1000, fair: 2000 }),
      description: '从开始导航到页面完全加载的时间',
      icon: Speed,
    },
    {
      label: '渲染时间',
      value: `${metrics.renderTime.toFixed(0)}ms`,
      status: getMetricStatus(metrics.renderTime, { good: 50, fair: 100 }),
      description: '组件渲染到DOM的时间',
      icon: Speed,
    },
    {
      label: '内存使用',
      value: `${metrics.memoryUsage.toFixed(1)}MB`,
      status: getMetricStatus(metrics.memoryUsage, { good: 30, fair: 50 }),
      description: '当前JavaScript堆内存使用量',
      icon: Memory,
    },
    {
      label: '网络延迟',
      value: `${metrics.networkLatency.toFixed(0)}ms`,
      status: getMetricStatus(metrics.networkLatency, { good: 100, fair: 200 }),
      description: 'API请求的平均响应时间',
      icon: NetworkCheck,
    },
    {
      label: 'DOM节点数',
      value: metrics.domNodes.toString(),
      status: getMetricStatus(metrics.domNodes, { good: 800, fair: 1200 }),
      description: '当前页面的DOM节点总数',
      icon: Storage,
    },
    {
      label: '帧率',
      value: `${metrics.fps || 60}fps`,
      status: getMetricStatus(60 - (metrics.fps || 60), { good: 5, fair: 10 }),
      description: '页面动画和交互的帧率',
      icon: TrendingUp,
    },
  ];

  const handleStartMonitoring = () => {
    setMonitoring(true);
  };

  const handleStopMonitoring = () => {
    setMonitoring(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (metrics.loadTime > 2000) {
      recommendations.push('考虑启用代码分割和懒加载来减少初始包大小');
    }
    if (metrics.memoryUsage > 50) {
      recommendations.push('检查内存泄漏，清理未使用的事件监听器和定时器');
    }
    if (metrics.domNodes > 1200) {
      recommendations.push('优化DOM结构，减少不必要的嵌套元素');
    }
    if (metrics.networkLatency > 200) {
      recommendations.push('优化API响应时间，考虑添加请求缓存');
    }

    return recommendations;
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Analytics color="primary" />
              <Typography variant="h6">
                性能监控
              </Typography>
              <Chip
                label={`${performanceGrade.grade}级`}
                color={performanceGrade.color}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={monitoring ? handleStopMonitoring : handleStartMonitoring}
                color={monitoring ? 'error' : 'primary'}
              >
                {monitoring ? '停止监控' : '开始监控'}
              </Button>
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Box>
          </Box>

          {/* 性能概览 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {performanceItems.slice(0, 4).map((item) => {
              const IconComponent = item.icon;
              const StatusIcon = item.status.icon;
              return (
                <Grid item xs={6} sm={3} key={item.label}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                        <IconComponent color={item.status.color} />
                        <StatusIcon 
                          color={item.status.color} 
                          sx={{ ml: 0.5, fontSize: 16 }}
                        />
                      </Box>
                      <Typography variant="h6" color={`${item.status.color}.main`}>
                        {item.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* 详细信息展开 */}
          <Box>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ mb: 2 }}
            >
              查看详细信息
            </Button>
            
            <Collapse in={expanded}>
              <Grid container spacing={2}>
                {performanceItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <IconComponent color={item.status.color} />
                            <Typography variant="subtitle2">
                              {item.label}
                            </Typography>
                            <Chip
                              label={item.value}
                              color={item.status.color}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* 错误和警告 */}
              {(metrics.errors.length > 0 || metrics.warnings.length > 0) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    问题报告
                  </Typography>
                  
                  {metrics.errors.map((error, index) => (
                    <Alert severity="error" sx={{ mb: 1 }} key={index}>
                      {error.message} (出现 {error.count} 次)
                    </Alert>
                  ))}
                  
                  {metrics.warnings.map((warning, index) => (
                    <Alert severity="warning" sx={{ mb: 1 }} key={index}>
                      {warning.message} (出现 {warning.count} 次)
                    </Alert>
                  ))}
                </Box>
              )}

              {/* 优化建议 */}
              {getRecommendations().length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    优化建议
                  </Typography>
                  <List>
                    {getRecommendations().map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUp color="success" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Collapse>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<BugReport />}
              onClick={() => setShowDetails(true)}
              size="small"
            >
              查看技术详情
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 技术详情对话框 */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>技术性能详情</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            浏览器性能 API 数据
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: 12, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <pre>{JSON.stringify(performanceData, null, 2)}</pre>
          </Box>
          
          {typeof window !== 'undefined' && window.performance?.memory && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                内存使用详情
              </Typography>
              <Box sx={{ fontFamily: 'monospace', fontSize: 12, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <pre>{JSON.stringify({
                  usedJSHeapSize: `${(window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                  totalJSHeapSize: `${(window.performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                  jsHeapSizeLimit: `${(window.performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
                }, null, 2)}</pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerformanceMonitor;
