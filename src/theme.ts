import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: { primary: { main: '#17675b', dark: '#104b43', light: '#e4f0eb' }, secondary: { main: '#b65735' }, background: { default: '#f6f7f3', paper: '#ffffff' }, text: { primary: '#25352f', secondary: '#64716a' }, divider: '#e4e9e3' },
  typography: { fontFamily: '"Segoe UI", Arial, sans-serif', h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 }, h4: { fontWeight: 700, letterSpacing: '-1px' }, h5: { fontWeight: 700, letterSpacing: '-0.5px' }, h6: { fontWeight: 650 }, button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 9, padding: '10px 20px' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: 'none', border: '1px solid #e4e9e3' } } },
    MuiPaper: { styleOverrides: { outlined: { borderColor: '#e4e9e3' } } },
    MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});
