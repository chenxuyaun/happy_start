import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import MainNavbar from './MainNavbar';
import Sidebar from './Sidebar';
import QuickActionPanel from '../QuickActions/QuickActionPanel';
import UpdateNotification from '../Updates/UpdateNotification';
import HelpSystem from '../Help/HelpSystem';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MainNavbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
        
        {/* 全局组件 */}
        <QuickActionPanel />
        <UpdateNotification />
        <HelpSystem />
      </Box>
    </Box>
  );
};

export default Layout;
