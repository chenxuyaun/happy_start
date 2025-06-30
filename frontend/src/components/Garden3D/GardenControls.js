import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Chip,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  LocalFlorist,
  Water,
  EmojiNature,
  Star,
  MonetizationOn,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setGardenMode, clearSelectedPlant } from '../../store/gardenSlice';

const GardenControls = () => {
  const dispatch = useDispatch();
  const { gardenState, gardenMode, selectedPlant } = useSelector(state => state.garden);
  
  // 提供默认值以防Redux状态未初始化
  const safeGardenState = gardenState || {
    level: 1,
    experience: 0,
    coins: 100,
    plants: []
  };
  const safeMode = gardenMode || 'view';
  const safePlant = selectedPlant || null;

  const handleModeChange = (mode) => {
    dispatch(setGardenMode(mode));
    if (mode !== 'view') {
      dispatch(clearSelectedPlant());
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'view': return 'primary';
      case 'plant': return 'success';
      case 'water': return 'info';
      default: return 'default';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'view': return <Visibility />;
      case 'plant': return <LocalFlorist />;
      case 'water': return <Water />;
      default: return null;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        {/* 花园状态信息 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                花园状态
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Star sx={{ mr: 1, color: 'gold' }} />
                <Typography variant="body2">
                  等级: {gardenState.level}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" gutterBottom>
                  经验值: {gardenState.experience}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(gardenState.experience % 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MonetizationOn sx={{ mr: 1, color: 'gold' }} />
                <Typography variant="body2">
                  金币: {gardenState.coins}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiNature sx={{ mr: 1, color: 'green' }} />
                <Typography variant="body2">
                  植物数量: {gardenState.plants.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 交互模式控制 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                交互模式
              </Typography>
              <ButtonGroup
                variant="contained"
                orientation="vertical"
                fullWidth
                sx={{ mb: 2 }}
              >
                <Button
                  onClick={() => handleModeChange('view')}
                  color={getModeColor('view')}
                  variant={gardenMode === 'view' ? 'contained' : 'outlined'}
                  startIcon={getModeIcon('view')}
                >
                  观察模式
                </Button>
                <Button
                  onClick={() => handleModeChange('plant')}
                  color={getModeColor('plant')}
                  variant={gardenMode === 'plant' ? 'contained' : 'outlined'}
                  startIcon={getModeIcon('plant')}
                >
                  种植模式
                </Button>
                <Button
                  onClick={() => handleModeChange('water')}
                  color={getModeColor('water')}
                  variant={gardenMode === 'water' ? 'contained' : 'outlined'}
                  startIcon={getModeIcon('water')}
                >
                  浇水模式
                </Button>
              </ButtonGroup>
              
              <Chip
                label={`当前模式: ${gardenMode === 'view' ? '观察' : gardenMode === 'plant' ? '种植' : '浇水'}`}
                color={getModeColor(gardenMode)}
                variant="filled"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 选中植物信息 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                植物信息
              </Typography>
              {selectedPlant ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>{selectedPlant.type}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {selectedPlant.id}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      成长度: {selectedPlant.growth}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={selectedPlant.growth}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="success"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    位置: ({selectedPlant.position?.x}, {selectedPlant.position?.z})
                  </Typography>
                  {selectedPlant.lastWatered && (
                    <Typography variant="body2" color="text.secondary">
                      上次浇水: {new Date(selectedPlant.lastWatered).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  点击植物查看详细信息
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 模式说明 */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            操作说明
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Chip
                icon={<Visibility />}
                label="观察模式: 自由查看花园，点击植物查看信息"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Chip
                icon={<LocalFlorist />}
                label="种植模式: 点击空地种植新植物"
                variant="outlined"
                size="small"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Chip
                icon={<Water />}
                label="浇水模式: 点击植物进行浇水"
                variant="outlined"
                size="small"
                color="info"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GardenControls;
