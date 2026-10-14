import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppBar, Avatar, Box, Button, Chip, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import AutoStoriesOutlined from '@mui/icons-material/AutoStoriesOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import { useTrainingStore } from '../store/useTrainingStore';
import type { View } from '../store/useTrainingStore';
const items: { label: string; view: View; icon: ReactNode }[] = [
  { label: 'Overview', view: 'dashboard', icon: <DashboardOutlined/> },
  { label: 'My learning', view: 'courses', icon: <AutoStoriesOutlined/> },
  { label: 'Live sessions', view: 'sessions', icon: <CalendarMonthOutlined/> },
  { label: 'Sponsor dashboard', view: 'sponsor', icon: <InsightsOutlined/> },
  { label: 'My profile', view: 'profile', icon: <PersonOutlined/> },
];
export default function AppShell({ children, onBatchLink }: { children: ReactNode; onBatchLink: () => void }) {
  const [open, setOpen] = useState(false);
  const profile = useTrainingStore((s) => s.profile);
  const view = useTrainingStore((s) => s.view);
  const setView = useTrainingStore((s) => s.setView);
  const logout = useTrainingStore((s) => s.logout);
  const navigate = (v: View) => { setView(v); window.location.hash = v; setOpen(false); };
  const sidebar = <Stack sx={{ height: '100%', p: 2.5 }}>
    <Stack direction="row" spacing={1.5} sx={{ mb: 4, mt: 1, alignItems: "center" }}><Avatar variant="rounded" sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}><SchoolOutlined/></Avatar><Box><Typography sx={{ fontWeight: 750 }}>Adding Dimension</Typography><Typography variant="caption" color="text.secondary">TEACHER TRAINING</Typography></Box></Stack>
    <Typography variant="overline" color="text.secondary" sx={{ px: 1.5 }}>Your workspace</Typography>
    <List sx={{ mt: 1 }}>{items.filter((item) => item.view !== 'sponsor' || profile?.role === 'Sponsor').map((item) => <ListItemButton key={item.view} selected={view === item.view} onClick={() => navigate(item.view)} sx={{ mb: 1, borderRadius: 2, '&.Mui-selected': { bgcolor: '#e4f0eb', color: 'primary.main' } }}><ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon><ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: view === item.view ? 700 : 500 } } }}/></ListItemButton>)}</List>
    <Divider sx={{ my: 2 }}/><Button startIcon={<LinkOutlined/>} onClick={() => { onBatchLink(); setOpen(false); }} sx={{ justifyContent: 'flex-start' }}>Batch registration</Button>
    <Box sx={{ flexGrow: 1 }}/><Box sx={{ bgcolor: '#f2f5ef', p: 2, borderRadius: 2, mb: 2 }}><Typography sx={{ fontWeight: 650 }} variant="body2">A little learning, every day.</Typography><Typography color="text.secondary" variant="caption">Build skills that make a difference in your classroom.</Typography></Box>
    <Button startIcon={<Logout/>} onClick={() => { logout(); window.location.hash = 'login'; }} sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Log out</Button>
  </Stack>;
  return <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Box component="a" href="#main-content" sx={{ position: 'absolute', left: -10000, '&:focus': { left: 12, top: 12, zIndex: 2000, bgcolor: 'white', p: 2 } }}>Skip to content</Box>
    <Drawer variant="permanent" sx={{ display: { xs: 'none', lg: 'block' }, width: 264, '& .MuiDrawer-paper': { width: 264, boxSizing: 'border-box' } }}>{sidebar}</Drawer>
    <Drawer open={open} onClose={() => setOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 280 } }}><IconButton aria-label="Close navigation" onClick={() => setOpen(false)} sx={{ alignSelf: 'flex-end' }}><Close/></IconButton>{sidebar}</Drawer>
    <Box sx={{ flex: 1, minWidth: 0 }}><AppBar position="sticky" elevation={0} color="transparent" sx={{ bgcolor: 'rgba(255,255,255,.96)', borderBottom: '1px solid', borderColor: 'divider' }}><Toolbar sx={{ gap: 2 }}><IconButton aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ display: { lg: 'none' } }}><Menu/></IconButton><Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>Your next chapter starts here.</Typography><Chip label="Demo workspace" size="small" variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' } }}/><Avatar sx={{ bgcolor: '#dcece3', color: 'primary.dark', width: 36, height: 36 }}>{profile?.name.charAt(0)}</Avatar><Box sx={{ display: { xs: 'none', sm: 'block' } }}><Typography variant="body2" sx={{ fontWeight: 650 }}>{profile?.name}</Typography><Typography variant="caption" color="text.secondary">{profile?.role}</Typography></Box></Toolbar></AppBar>
    <Box component="main" id="main-content" tabIndex={-1} sx={{ p: { xs: 2, sm: 3, xl: 5 }, maxWidth: 1500, mx: 'auto', outline: 'none' }}>{children}</Box>
    <Box component="footer" sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}><Typography variant="caption" color="text.secondary">Adding Dimension · Learning with purpose</Typography><Typography variant="caption" color="text.secondary">Sample data · Changes stay in this browser</Typography></Box></Box>
  </Box>;
}
