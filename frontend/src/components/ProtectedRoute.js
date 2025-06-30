import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { getCurrentUser } from '../store/userSlice';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // 检查token是否存在且有效
    const token = authService.getToken();
    if (token && authService.isTokenValid() && !currentUser) {
      // 如果有有效token但没有用户信息，则获取用户信息
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  // 如果正在加载用户信息，显示加载状态
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // 如果未认证且没有有效token，重定向到登录页
  if (!isAuthenticated && !authService.isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  // 如果已认证，渲染子组件
  return children;
};

export default ProtectedRoute;
