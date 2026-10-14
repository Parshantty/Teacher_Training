import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { Profile } from '../store/useTrainingStore';
import ResetPasswordForm from './ResetPasswordForm';
import { states } from '../data/states';

export type AuthMode = 'login' | 'register' | 'reset';
export const demoProfile: Profile = { name: 'Aditi Sharma', email: 'aditi@example.com', school: 'Demo Public School', state: 'Delhi', role: 'Teacher' };
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);


interface Props { mode: AuthMode; onLogin: (profile: Profile) => void; onModeChange: (mode: AuthMode) => void }
export default function AuthForms({ mode, onLogin, onModeChange }: Props) {
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', school: '', state: '', role: 'Teacher' });
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const errors = {
    email: validEmail(profile.email.trim()) ? '' : 'Enter a valid email address.',
    password: password.length >= 8 ? '' : 'Use at least 8 characters for this demo.',
    name: profile.name.trim().length >= 2 ? '' : 'Enter your full name.',
    school: profile.school.trim() ? '' : 'Enter your school or organization.',
    state: profile.state ? '' : 'Choose your state or union territory.',
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true); setLoginError('');
    if (mode === 'register' && errors.email) return;
    if (errors.password) return;
    if (mode === 'login' && (!['teacher', 'sponsor'].includes(profile.email.trim().toLowerCase()) || password !== 'Demo@123')) { setLoginError('Use user ID teacher or sponsor and the demo password Demo@123.'); return; }
    if (mode === 'register' && (errors.name || errors.school || errors.state || !terms)) return;
    setPassword('');
    onLogin(mode === 'register' ? { ...profile, name: profile.name.trim(), email: profile.email.trim(), school: profile.school.trim() } : profile.email.trim().toLowerCase() === 'sponsor' ? { ...demoProfile, name: 'Riya Mehta', role: 'Sponsor', email: 'sponsor@example.com', school: 'Demo Education Foundation' } : demoProfile);
  }
  const fieldError = (key: keyof typeof errors) => submitted ? errors[key] : '';
  if (mode === 'reset') return <ResetPasswordForm onBack={() => onModeChange('login')} />;
  return <Box component="form" onSubmit={submit} noValidate>
    <Stack spacing={2.25}>
      {mode === 'register' && <TextField label="Full name" autoComplete="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} error={!!fieldError('name')} helperText={fieldError('name')} required fullWidth />}
      <TextField label={mode === 'login' ? 'User ID' : 'Email address'} type={mode === 'login' ? 'text' : 'email'} autoComplete={mode === 'login' ? 'username' : 'email'} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} error={mode === 'register' && !!fieldError('email')} helperText={mode === 'login' ? 'Demo user ID: teacher or sponsor' : fieldError('email')} required fullWidth />
      <TextField label="Password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} error={!!fieldError('password')} helperText={fieldError('password') || (mode === 'login' ? 'Demo password: Demo@123' : 'Demo only — use a made-up password.')} required fullWidth />
      <FormControlLabel control={<Checkbox checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />} label="Show password" />
      {mode === 'register' && <>
        <TextField label="School / organization" autoComplete="organization" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} error={!!fieldError('school')} helperText={fieldError('school')} required fullWidth />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField select label="State / union territory" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} error={!!fieldError('state')} helperText={fieldError('state')} required fullWidth>{states.map((state) => <MenuItem key={state} value={state}>{state}</MenuItem>)}</TextField>
          <TextField select label="I am a" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value === 'Sponsor' ? 'Sponsor' : 'Teacher' })} fullWidth><MenuItem value="Teacher">Teacher</MenuItem><MenuItem value="Sponsor">Sponsor</MenuItem></TextField>
        </Stack>
        <Box><FormControlLabel control={<Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} required />} label={<Typography variant="body2">I understand this is a demo and my profile will be saved in this browser.</Typography>} />{submitted && !terms && <Typography color="error" variant="caption" role="alert">Please acknowledge the demo terms to continue.</Typography>}</Box>
      </>}
      {mode === 'login' && <Button onClick={() => onModeChange('reset')} sx={{ alignSelf: 'flex-end', p: 0 }}>Forgot password?</Button>}
      {loginError && <Alert severity="error" role="alert">{loginError}</Alert>}
      <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.6 }}>{mode === 'login' ? 'Sign in to demo' : 'Create demo profile'} <Box component="span" aria-hidden="true" sx={{ ml: 1 }}>→</Box></Button>
    </Stack>
  </Box>;
}
