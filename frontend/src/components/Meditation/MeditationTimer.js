import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateTimerElapsed,
  addToHistory,
} from '../../store/meditationSlice';

const MeditationTimer = () => {
  const dispatch = useDispatch();
  const { activeTimer, settings } = useSelector(state => state.meditation);
  const [selectedDuration, setSelectedDuration] = useState(10); // 默认10分钟
  const [backgroundSound, setBackgroundSound] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  // 预设时间选项（分钟）
  const durationOptions = [5, 10, 15, 20, 30, 45, 60];

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const getProgress = () => {
    if (activeTimer.duration === 0) return 0;
    return (activeTimer.elapsed / activeTimer.duration) * 100;
  };

  // 计算剩余时间
  const getRemainingTime = () => {
    return Math.max(0, activeTimer.duration - activeTimer.elapsed);
  };

  // 开始计时器
  const handleStart = () => {
    const durationInSeconds = selectedDuration * 60;
    dispatch(startTimer(durationInSeconds));
  };

  // 暂停计时器
  const handlePause = () => {
    dispatch(pauseTimer());
  };

  // 恢复计时器
  const handleResume = () => {
    dispatch(resumeTimer());
  };

  // 停止计时器
  const handleStop = () => {
    dispatch(stopTimer());
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // 完成冥想
  const handleComplete = () => {
    const sessionData = {
      duration: selectedDuration,
      completedAt: new Date().toISOString(),
      type: 'timer',
      mood: 'peaceful', // 可以让用户选择
    };
    dispatch(addToHistory(sessionData));
    handleStop();
  };

  // 计时器效果
  useEffect(() => {
    if (activeTimer.isRunning) {
      const id = setInterval(() => {
        dispatch(updateTimerElapsed(activeTimer.elapsed + 1));
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [activeTimer.isRunning, activeTimer.elapsed, dispatch]);

  // 检查是否完成
  useEffect(() => {
    if (activeTimer.isRunning && activeTimer.elapsed >= activeTimer.duration) {
      handleComplete();
    }
  }, [activeTimer.elapsed, activeTimer.duration, activeTimer.isRunning]);

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          冥想计时器
        </Typography>

        {/* 时间选择 */}
        {!activeTimer.isRunning && !activeTimer.isPaused && (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>选择时长</InputLabel>
              <Select
                value={selectedDuration}
                label="选择时长"
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {durationOptions.map((duration) => (
                  <MenuItem key={duration} value={duration}>
                    {duration} 分钟
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* 计时器显示 */}
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
          <CircularProgress
            variant="determinate"
            value={getProgress()}
            size={200}
            thickness={4}
            sx={{
              color: activeTimer.isRunning ? '#4caf50' : '#e0e0e0',
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" component="div" color="text.secondary">
              {formatTime(getRemainingTime())}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              剩余时间
            </Typography>
          </Box>
        </Box>

        {/* 控制按钮 */}
        <Box sx={{ mb: 2 }}>
          {!activeTimer.isRunning && !activeTimer.isPaused && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={handleStart}
              size="large"
            >
              开始冥想
            </Button>
          )}

          {activeTimer.isRunning && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <IconButton
                color="primary"
                onClick={handlePause}
                size="large"
              >
                <Pause />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={handleStop}
                size="large"
              >
                <Stop />
              </IconButton>
            </Box>
          )}

          {activeTimer.isPaused && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <IconButton
                color="primary"
                onClick={handleResume}
                size="large"
              >
                <PlayArrow />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={handleStop}
                size="large"
              >
                <Stop />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* 音效控制 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <IconButton
            onClick={() => setBackgroundSound(!backgroundSound)}
            color={backgroundSound ? 'primary' : 'default'}
          >
            {backgroundSound ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
          <Typography variant="caption">
            背景音乐
          </Typography>
        </Box>

        {/* 进度信息 */}
        {(activeTimer.isRunning || activeTimer.isPaused) && (
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Typography variant="body2" color="text.secondary">
              已完成: {formatTime(activeTimer.elapsed)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              总时长: {formatTime(activeTimer.duration)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MeditationTimer;
