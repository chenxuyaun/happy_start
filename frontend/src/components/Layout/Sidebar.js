import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as JournalIcon,
  Park as GardenIcon,
  Psychology as AIIcon,
  SelfImprovement as MeditationIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

const menuItems = [
  {
    text: '控制台',
    icon: <DashboardIcon />,
    path: '/app/dashboard',
    description: '总览和统计'
  },
  {
    text: '心情日记',
    icon: <JournalIcon />,
    path: '/app/journal',
    description: '记录和分析情绪'
  },
  {
    text: '虚拟花园',
    icon: <GardenIcon />,
    path: '/app/garden',
    description: '3D互动花园'
  },
  {
    text: 'AI助手',
    icon: <AIIcon />,
    path: '/app/ai-assistant',
    description: '智能情绪分析'
  },
  {
    text: '冥想指导',
    icon: <MeditationIcon />,
    path: '/app/meditation',
    description: '放松和冥想'
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #f8f9ff 0%, #e8f4fd 100%)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          🌸 Happy Day
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            mt: 1
          }}
        >
          心理治愈平台
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 60,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'rgba(107, 115, 255, 0.08)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'white' : 'primary.main',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.8rem',
                    color: isActive ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/app/profile')}
            sx={{
              borderRadius: 2,
              minHeight: 50,
              backgroundColor: location.pathname === '/app/profile' ? 'primary.main' : 'transparent',
              color: location.pathname === '/app/profile' ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: location.pathname === '/app/profile' ? 'primary.dark' : 'rgba(107, 115, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === '/app/profile' ? 'white' : 'primary.main',
                minWidth: 40,
              }}
            >
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText 
              primary="个人设置"
              primaryTypographyProps={{
                fontWeight: location.pathname === '/app/profile' ? 600 : 500,
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
