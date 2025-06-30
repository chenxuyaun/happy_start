import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/userSlice';

const ThemeSwitcher = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const toggleTheme = () => {
    const newTheme = currentUser.preferences?.theme === 'light' ? 'dark' : 'light';
    dispatch(updateUserProfile({ preferences: { ...currentUser.preferences, theme: newTheme } }));
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <Button 
        variant="contained"
        startIcon={theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        onClick={toggleTheme}
      >
        {theme.palette.mode === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
      </Button>
    </Box>
  );
};

export default ThemeSwitcher;
