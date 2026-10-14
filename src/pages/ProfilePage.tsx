import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTrainingStore } from '../store/useTrainingStore';
import { states } from '../data/states';
export default function ProfilePage() {
  const profile = useTrainingStore((s) => s.profile);
  const update = useTrainingStore((s) => s.updateProfile);
  const reset = useTrainingStore((s) => s.resetDemo);
  const [name, setName] = useState(profile?.name ?? '');
  const [school, setSchool] = useState(profile?.school ?? '');
  const [state, setState] = useState(profile?.state ?? 'Delhi');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  return <Stack spacing={3}><Box><Typography variant="overline" color="primary">YOUR DETAILS</Typography><Typography variant="h4" component="h1">My profile</Typography><Typography color="text.secondary">Make this learning space your own.</Typography></Box><Card sx={{ maxWidth: 700 }}><CardContent sx={{ p: 3 }}><Box component="form" onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !school.trim()) { setError('Your name and school are required.'); return; } if (profile) update({ ...profile, name: name.trim(), school: school.trim(), state }); setError(''); setSaved(true); }}><Stack spacing={3}>{saved && <Alert severity="success">Profile updated in this browser.</Alert>}{error && <Alert severity="error">{error}</Alert>}<TextField label="Full name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} required/><TextField label="Email" value={profile?.email ?? ''} slotProps={{ input: { readOnly: true } }} helperText="Email identifies your demo profile."/><TextField label="School / organisation" value={school} onChange={(e) => { setSchool(e.target.value); setSaved(false); }} required/><TextField select label="State" value={state} onChange={(e) => setState(e.target.value)}>{states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}</TextField><Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save changes</Button></Stack></Box><Divider sx={{ my: 4 }}/><Typography sx={{ fontWeight: 650 }}>Start fresh</Typography><Typography color="text.secondary" variant="body2" sx={{ my: 1 }}>Clear your demo profile, learning progress, and session registrations on this device.</Typography><Button color="error" variant="outlined" onClick={() => { if (window.confirm('Clear all demo progress on this device?')) reset(); }}>Reset demo data</Button></CardContent></Card></Stack>;
}
