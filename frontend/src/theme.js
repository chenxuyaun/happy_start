import { createTheme } from '@mui/material/styles';

// 吉卜力风格的治愈色彩主题
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B73FF', // 温和的紫蓝色
      light: '#9C9EFF',
      dark: '#3F51B5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9A9E', // 温暖的粉色
      light: '#FFC3A0',
      dark: '#FF6B6B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#A8E6CF', // 清新的绿色
      light: '#C8E6C9',
      dark: '#4CAF50',
    },
    warning: {
      main: '#FFD3A5', // 温暖的橙色
      light: '#FFECB3',
      dark: '#FF9800',
    },
    error: {
      main: '#FF8A80',
      light: '#FFCDD2',
      dark: '#F44336',
    },
    info: {
      main: '#81D4FA',
      light: '#B3E5FC',
      dark: '#2196F3',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#34495E',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#34495E',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#34495E',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#5D6D7E',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.9)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#6B73FF',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          color: '#2C3E50',
        },
      },
    },
  },
});

export default theme;
