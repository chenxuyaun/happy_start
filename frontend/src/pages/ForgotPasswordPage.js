import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ForgotPasswordPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ 
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          p: 4,
          borderRadius: 4,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#6B73FF' }}>
            忘记密码
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            忘记密码功能正在开发中...
          </Typography>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #6B73FF 30%, #9C9EFF 90%)',
              mr: 2
            }}
          >
            返回登录
          </Button>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="outlined"
          >
            返回首页
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPasswordPage;
