import { useState } from 'react';
import { Box, Button, Chip, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import AuthForms, { demoProfile, type AuthMode } from '../components/AuthForms';
import { useTrainingStore } from '../store/useTrainingStore';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const login = useTrainingStore((state) => state.login);
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
    <Box sx={{ bgcolor: '#103d35', color: '#fff', p: { xs: 4, md: 7 }, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box aria-hidden="true" sx={{ width: 42, height: 42, bgcolor: '#d7edb7', borderRadius: 2, display: 'grid', placeItems: 'center', color: '#103d35' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M3 7c4-1 8 0 11 2 3-2 7-3 11-2v15c-4-1-8 0-11 2-3-2-7-3-11-2V7Z" stroke="currentColor" strokeWidth="1.8" /><path d="M14 9v15M7 11l3 1M18 12l3-1M7 15l3 1M18 16l3-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </Box>
        <Box><Typography sx={{ fontWeight: 750, fontSize: 20 }}>Adding Dimension</Typography><Typography color="#b9d3ca" sx={{ fontSize: 11, letterSpacing: 1.7 }}>TEACHER TRAINING</Typography></Box>
      </Stack>
      <Box sx={{ my: 'auto', py: { xs: 5, md: 8 }, maxWidth: 530, zIndex: 1 }}>
        <Chip label="A LITTLE LEARNING. A BIG DIFFERENCE." sx={{ color: '#d7edb7', bgcolor: '#ffffff0d', border: '1px solid #ffffff24', fontSize: 10, letterSpacing: 1.3, mb: 4 }} />
        <Typography component="h1" sx={{ fontSize: { xs: 42, lg: 64 }, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-2px' }}>Great teaching<br />starts with<br /><Box component="span" sx={{ color: '#d7edb7' }}>curiosity.</Box></Typography>
        <Typography sx={{ color: '#c2d7cf', fontSize: 17, lineHeight: 1.8, mt: 3, maxWidth: 390 }}>Build your confidence, discover fresh ideas, and bring meaningful change to your classroom.</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 5, alignItems: 'center' }}>
          <Stack direction="row" sx={{ '& > div + div': { ml: -1 } }}>{['AS', 'RK', 'MP'].map((initials, index) => <Box key={initials} sx={{ width: 38, height: 38, border: '3px solid #103d35', borderRadius: '50%', bgcolor: ['#c7d6bf', '#d9c3a7', '#c3d2dc'][index], color: '#103d35', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>{initials}</Box>)}</Stack>
          <Typography variant="body2" sx={{ color: '#c2d7cf' }}>A space for educators<br /><Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>to learn and grow together.</Box></Typography>
        </Stack>
      </Box>
      <Typography variant="caption" color="#b9d3ca" sx={{ zIndex: 1 }}>Learn with purpose. Teach with possibility.</Typography>
      <Box aria-hidden="true" sx={{ position: 'absolute', width: 370, height: 370, border: '1px solid #ffffff12', borderRadius: '50%', right: -190, bottom: -60, '&:after': { content: '""', position: 'absolute', inset: 40, border: '1px solid #ffffff12', borderRadius: '50%' } }} />
    </Box>
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: { xs: 5, md: 7 }, px: { xs: 3, md: 7 } }}>
      <Stack direction="row" sx={{ mb: 5, justifyContent: 'space-between', alignItems: 'center' }}><Chip size="small" label="LEARNING PORTAL" variant="outlined" sx={{ fontSize: 10, letterSpacing: 1.2 }} /><Typography variant="caption" color="text.secondary">Frontend preview</Typography></Stack>
      <Typography component="h2" variant="h4" sx={{ fontWeight: 650, letterSpacing: '-1px', mb: 1 }}>{mode === 'login' ? 'Welcome back.' : mode === 'register' ? 'Your next chapter.' : 'Let’s get you back in.'}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{mode === 'login' ? 'A fresh idea for your classroom is one step away.' : mode === 'register' ? 'Create a demo profile and explore your learning journey.' : 'Preview the password reset experience.'}</Typography>
      {mode !== 'reset' && <Tabs value={mode} onChange={(_, value: AuthMode) => setMode(value)} aria-label="Account form" sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}><Tab value="login" label="Sign in" /><Tab value="register" label="Self registration" /></Tabs>}
      <AuthForms key={mode} mode={mode} onLogin={login} onModeChange={setMode} />
      <Divider sx={{ my: 3 }}><Typography variant="caption" color="text.secondary">OR EXPLORE FIRST</Typography></Divider>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Button variant="outlined" fullWidth onClick={() => login(demoProfile)}>Teacher demo</Button><Button variant="outlined" fullWidth onClick={() => login({ ...demoProfile, name: 'Riya Mehta', email: 'sponsor@example.com', role: 'Sponsor', school: 'Demo Education Foundation' })}>Sponsor demo</Button></Stack>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 3, lineHeight: 1.7 }}>UI demo only. No real authentication or emails. Passwords are never saved. Demo profiles and learning progress stay in this browser.</Typography>
    </Container>
  </Box>;
}
