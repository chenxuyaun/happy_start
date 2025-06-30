import React from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Person,
  Security,
  Assessment,
  Settings,
} from '@mui/icons-material';
import {
  UserProfileForm,
  AccountSecurity,
} from '../components/Profile';
import ProfileStats from '../components/Profile/ProfileStats';
import DataExport from '../components/Settings/DataExport';
import ThemeSwitcher from '../components/Settings/ThemeSwitcher';
import PerformanceMonitor from '../components/Performance/PerformanceMonitor';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          用户设置
        </Typography>

        {/* 标签页导航 */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<Person />}
              label="个人资料"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Security />}
              label="账户安全"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Assessment />}
              label="数据统计"
              {...a11yProps(2)}
            />
            <Tab
              icon={<Settings />}
              label="应用设置"
              {...a11yProps(3)}
            />
          </Tabs>
        </Paper>

        {/* 标签页内容 */}
        <TabPanel value={activeTab} index={0}>
          <UserProfileForm />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <AccountSecurity />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ProfileStats />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ThemeSwitcher />
            <DataExport />
            <PerformanceMonitor />
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
}

export default ProfilePage;
