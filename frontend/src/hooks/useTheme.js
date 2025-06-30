import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

export const useAppTheme = () => {
  const { currentUser } = useSelector(state => state.user);
  const themeMode = currentUser?.preferences?.theme || 'light';

  const theme = useMemo(() => {
    const isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#90caf9' : '#1976d2',
          light: isDark ? '#e3f2fd' : '#42a5f5',
          dark: isDark ? '#42a5f5' : '#1565c0',
        },
        secondary: {
          main: isDark ? '#f48fb1' : '#dc004e',
          light: isDark ? '#fce4ec' : '#f06292',
          dark: isDark ? '#f06292' : '#c51162',
        },
        success: {
          main: isDark ? '#81c784' : '#2e7d32',
          light: isDark ? '#c8e6c9' : '#4caf50',
          dark: isDark ? '#4caf50' : '#1b5e20',
        },
        warning: {
          main: isDark ? '#ffb74d' : '#ed6c02',
          light: isDark ? '#fff3e0' : '#ff9800',
          dark: isDark ? '#ff9800' : '#e65100',
        },
        error: {
          main: isDark ? '#e57373' : '#d32f2f',
          light: isDark ? '#ffebee' : '#f44336',
          dark: isDark ? '#f44336' : '#c62828',
        },
        info: {
          main: isDark ? '#64b5f6' : '#0288d1',
          light: isDark ? '#e1f5fe' : '#03a9f4',
          dark: isDark ? '#03a9f4' : '#01579b',
        },
        background: {
          default: isDark ? '#121212' : '#fafafa',
          paper: isDark ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: isDark ? '#ffffff' : '#212121',
          secondary: isDark ? '#b0b0b0' : '#757575',
        },
        divider: isDark ? '#333333' : '#e0e0e0',
        action: {
          hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          disabled: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
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
          fontWeight: 600,
          letterSpacing: '-0.02em',
        },
        h2: {
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
        button: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarWidth: 'thin',
              scrollbarColor: isDark ? '#333333 #121212' : '#c0c0c0 #fafafa',
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: isDark ? '#121212' : '#fafafa',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: isDark ? '#333333' : '#c0c0c0',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: isDark ? '#555555' : '#a0a0a0',
                },
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              boxShadow: isDark 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: isDark 
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: isDark 
                  ? '0 4px 8px rgba(0, 0, 0, 0.3)'
                  : '0 4px 8px rgba(0, 0, 0, 0.12)',
              },
            },
            contained: {
              background: isDark 
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: isDark 
                  ? 'linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#333333' : '#f5f5f5',
              color: isDark ? '#ffffff' : '#212121',
              '&:hover': {
                backgroundColor: isDark ? '#555555' : '#eeeeee',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-focused': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                },
              },
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              borderRight: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              backgroundImage: 'none',
            },
          },
        },
        MuiPopover: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            },
          },
        },
        MuiFab: {
          styleOverrides: {
            root: {
              background: isDark 
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: isDark 
                  ? 'linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)'
                  : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              },
            },
          },
        },
      },
    });
  }, [themeMode]);

  return theme;
};

export default useAppTheme;
