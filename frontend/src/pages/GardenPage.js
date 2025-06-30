import React, { useEffect } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Garden3D from '../components/Garden3D/Garden3D';
import GardenControls from '../components/Garden3D/GardenControls';
import { fetchGardenState } from '../store/gardenSlice';

function GardenPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.garden);

  useEffect(() => {
    // 页面加载时获取花园状态
    dispatch(fetchGardenState());
  }, [dispatch]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          🌸 虚拟花园 🌸
        </Typography>
        
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          在这个3D花园中种植、浇水并照料您的植物
        </Typography>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 花园控制面板 */}
        <GardenControls />

        {/* 3D花园场景 */}
        <Box 
          sx={{ 
            border: '2px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}
        >
          <Garden3D />
        </Box>

        {/* 加载提示 */}
        {loading && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              正在加载花园数据...
            </Typography>
          </Box>
        )}

        {/* 操作提示 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            🎮 操作指南
          </Typography>
          <Typography variant="body2" paragraph>
            • 使用鼠标拖拽来旋转视角，滚轮缩放，右键拖拽移动视角
          </Typography>
          <Typography variant="body2" paragraph>
            • 切换到种植模式，点击空地种植新花朵
          </Typography>
          <Typography variant="body2" paragraph>
            • 切换到浇水模式，点击植物给它们浇水
          </Typography>
          <Typography variant="body2">
            • 在观察模式下，点击植物查看详细信息
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default GardenPage;
