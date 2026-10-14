import { Alert, Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { sessions } from '../data/training';
import { useTrainingStore } from '../store/useTrainingStore';

export default function SessionsPage() {
  const registered = useTrainingStore(s => s.registeredSessions);
  const register = useTrainingStore(s => s.registerSession);
  const cancel = useTrainingStore(s => s.cancelSession);
  const [filter, setFilter] = useState('All sessions');
  const [message, setMessage] = useState('');
  const visible = sessions.filter(s => filter === 'All sessions' || registered.includes(s.id));
  return <Stack spacing={3}>
    <Box><Typography variant="overline" color="primary">BETTER, TOGETHER</Typography><Typography variant="h3">Meet your learning community.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Fresh ideas and shared experiences, one conversation at a time.</Typography></Box>
    <Alert severity="info">Demo workshop schedule. Registrations are saved in this browser; these sample events have no live meeting links.</Alert>
    {message && <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>}
    <Stack direction="row" sx={{ gap: 1 }}>{['All sessions', 'My registrations'].map(item => <Chip key={item} label={item} clickable color={filter === item ? 'primary' : 'default'} onClick={() => setFilter(item)} aria-pressed={filter === item} />)}</Stack>
    {visible.length ? visible.map(session => {
      const booked = registered.includes(session.id);
      return <Card key={session.id} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: session.color, p: 3, minWidth: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="overline">OCTOBER 2026</Typography><Typography variant="h3">{session.date.split(' ')[1]}</Typography><Typography variant="body2">{session.date.split(',')[0]}</Typography></Box>
        <Stack spacing={1} sx={{ p: 3, flex: 1 }}><Typography variant="overline" color="primary">{session.category}</Typography><Typography variant="h5">{session.title}</Typography><Typography color="text.secondary">With {session.host} · {session.time}</Typography><Typography variant="body2" color="text.secondary">Online · {session.capacity}</Typography></Stack>
        <Stack sx={{ p: 3, alignItems: { xs: 'stretch', md: 'flex-end' }, justifyContent: 'center', minWidth: 180 }} spacing={1}>{booked && <Chip label="You're registered" color="primary" size="small" />}<Button variant={booked ? 'outlined' : 'contained'} onClick={() => { if (booked) cancel(session.id); else register(session.id); setMessage(booked ? `Registration cancelled for ${session.title}.` : `You're registered for ${session.title}. Demo booking saved.`); }}>{booked ? 'Cancel registration' : 'Register for session'}</Button></Stack>
      </Card>;
    }) : <Card sx={{ p: 4 }}><Typography variant="h6">Your next conversation is waiting.</Typography><Typography color="text.secondary" sx={{ my: 2 }}>You haven't registered for a session yet.</Typography><Button variant="contained" onClick={() => setFilter('All sessions')}>Explore sessions</Button></Card>}
  </Stack>;
}
