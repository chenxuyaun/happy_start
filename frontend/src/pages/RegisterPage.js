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
  FormControlLabel,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  Google,
  Facebook,
  GitHub,
  Check,
  Close
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser } from '../store/userSlice';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 密码强度检查
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 25) return '弱';
    if (strength <= 50) return '一般';
    if (strength <= 75) return '较强';
    return '强';
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const validateForm = () => {
    const errors = {};
    
    // 用户名验证
    if (!formData.username) {
      errors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      errors.username = '用户名至少需要3个字符';
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(formData.username)) {
      errors.username = '用户名只能包含字母、数字、下划线和中文';
    }
    
    // 邮箱验证
    if (!formData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      errors.password = '密码至少需要8个字符';
    }
    
    // 确认密码验证
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次密码输入不一致';
    }
    
    // 同意条款验证
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = '请同意用户协议和隐私政策';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value
    }));
    
    // 密码强度检查
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
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
      const result = await dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        privacy_consent: formData.agreeToTerms,
        terms_accepted: formData.agreeToTerms
      })).unwrap();
      
      // 注册成功，跳转到登录页
      navigate('/login', { 
        state: { 
          message: '注册成功！请登录您的账户。',
          email: formData.email 
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleSocialRegister = (provider) => {
    // TODO: 实现第三方注册
    console.log(`Register with ${provider}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      py: 4
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
              🌱 加入 Happy Day
            </Typography>
            <Typography variant="body1" color="text.secondary">
              创建您的治愈之旅账户
            </Typography>
          </MotionBox>

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

          {/* 注册表单 */}
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
                name="username"
                label="用户名"
                value={formData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username || '可以使用中文、英文、数字和下划线'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#6B73FF' }} />
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
                name="email"
                type="email"
                label="邮箱地址"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email || '将用于账户验证和找回密码'}
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

              {/* 密码强度指示器 */}
              {formData.password && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      密码强度
                    </Typography>
                    <Chip 
                      label={getPasswordStrengthText(passwordStrength)}
                      size="small"
                      color={getPasswordStrengthColor(passwordStrength)}
                      variant="outlined"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength} 
                    color={getPasswordStrengthColor(passwordStrength)}
                    sx={{ borderRadius: 1, height: 6 }}
                  />
                </Box>
              )}

              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="确认密码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#6B73FF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#6B73FF' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

              {/* 用户协议 */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    sx={{ color: '#6B73FF', '&.Mui-checked': { color: '#6B73FF' } }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    我同意{' '}
                    <Link href="#" sx={{ color: '#6B73FF' }}>用户协议</Link>
                    {' '}和{' '}
                    <Link href="#" sx={{ color: '#6B73FF' }}>隐私政策</Link>
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', mt: 1 }}
              />
              {formErrors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ mt: -2, ml: 4 }}>
                  {formErrors.agreeToTerms}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #FF9A9E 30%, #FECFEF 90%)',
                  boxShadow: '0 4px 20px rgba(255, 154, 158, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8A8E 30%, #FEBFDF 90%)',
                    boxShadow: '0 6px 25px rgba(255, 154, 158, 0.6)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {loading ? '注册中...' : '创建账户'}
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

          {/* 第三方注册 */}
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
                onClick={() => handleSocialRegister('google')}
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
                使用 Google 注册
              </Button>
              
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSocialRegister('facebook')}
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
                  onClick={() => handleSocialRegister('github')}
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

          {/* 登录链接 */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            sx={{ textAlign: 'center', mt: 3 }}
          >
            <Typography variant="body2" color="text.secondary">
              已经有账户？{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#6B73FF',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                立即登录
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

export default RegisterPage;
