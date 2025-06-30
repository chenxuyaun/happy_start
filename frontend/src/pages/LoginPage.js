import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Google,
  Facebook,
  GitHub
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../store/userSlice';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector(state => state.user);
  
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // 邮箱验证
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      errors.password = '密码至少需要6个字符';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    
    // 清除相应字段的错误
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      })).unwrap();
      
      // 登录成功，跳转到控制台
      navigate('/app/dashboard');
    } catch (error) {
      // 错误已经在store中处理
      console.error('Login failed:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: 实现第三方登录
    console.log(`Login with ${provider}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 154, 158, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(107, 115, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(168, 230, 207, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          {/* 标题区域 */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ textAlign: 'center', mb: 4 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: '#6B73FF',
                mb: 1
              }}
            >
              🌸 欢迎回来
            </Typography>
            <Typography variant="body1" color="text.secondary">
              登录到你的 Happy Day 账户
            </Typography>
          </MotionBox>

          {/* 成功提示 */}
          {successMessage && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ mb: 3 }}
            >
              <Alert 
                severity="success" 
                sx={{ borderRadius: 2 }}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            </MotionBox>
          )}

          {/* 错误提示 */}
          {error && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ mb: 3 }}
            >
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </MotionBox>
          )}

          {/* 登录表单 */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="邮箱地址"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#6B73FF' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#6B73FF',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="密码"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#6B73FF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#6B73FF' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#6B73FF',
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      sx={{ color: '#6B73FF', '&.Mui-checked': { color: '#6B73FF' } }}
                    />
                  }
                  label="记住我"
                  sx={{ color: 'text.secondary' }}
                />
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{ 
                    color: '#6B73FF',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  忘记密码？
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #6B73FF 30%, #9C9EFF 90%)',
                  boxShadow: '0 4px 20px rgba(107, 115, 255, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5A63E8 30%, #8B8EFF 90%)',
                    boxShadow: '0 6px 25px rgba(107, 115, 255, 0.6)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Stack>
          </MotionBox>

          {/* 分隔线 */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{ my: 3 }}
          >
            <Divider sx={{ color: 'text.secondary' }}>
              或者
            </Divider>
          </MotionBox>

          {/* 第三方登录 */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('google')}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: '#DB4437',
                  color: '#DB4437',
                  '&:hover': {
                    borderColor: '#DB4437',
                    backgroundColor: 'rgba(219, 68, 55, 0.04)'
                  }
                }}
              >
                使用 Google 登录
              </Button>
              
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSocialLogin('facebook')}
                  sx={{
                    borderRadius: 2,
                    borderColor: '#4267B2',
                    color: '#4267B2',
                    '&:hover': {
                      borderColor: '#4267B2',
                      backgroundColor: 'rgba(66, 103, 178, 0.04)'
                    }
                  }}
                >
                  Facebook
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHub />}
                  onClick={() => handleSocialLogin('github')}
                  sx={{
                    borderRadius: 2,
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#333',
                      backgroundColor: 'rgba(51, 51, 51, 0.04)'
                    }
                  }}
                >
                  GitHub
                </Button>
              </Stack>
            </Stack>
          </MotionBox>

          {/* 注册链接 */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            sx={{ textAlign: 'center', mt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              还没有账户？{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: '#6B73FF',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                立即注册
              </Link>
            </Typography>
          </MotionBox>
        </MotionPaper>
      </Container>

      {/* 返回首页按钮 */}
      <Button
        component={RouterLink}
        to="/"
        variant="text"
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        ← 返回首页
      </Button>
    </Box>
  );
}

export default LoginPage;
