import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Checkbox, Chip, Container, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import BatchShareCard from '../components/BatchShareCard';
import { batchFromHash, findBatch, type TrainingBatch } from '../data/batches';
import { useTrainingStore } from '../store/useTrainingStore';

export default function BatchRegistrationPage({ onBack }: { onBack: () => void }) {
  const initialBatch = batchFromHash(window.location.hash);
  const [code, setCode] = useState(initialBatch?.code ?? new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('batch') ?? '');
  const [batch, setBatch] = useState<TrainingBatch | undefined>(initialBatch);
  const [batchError, setBatchError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const login = useTrainingStore((state) => state.login);
  const errors = {
    name: name.trim().length >= 2 ? '' : 'Enter your full name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? '' : 'Enter a valid email address.',
    mobile: /^[6-9]\d{9}$/.test(mobile) ? '' : 'Enter a valid 10-digit Indian mobile number.',
  };
  function verifyBatch() {
    const found = findBatch(code); setBatch(found);
    setBatchError(found ? '' : 'This batch code is not available in the demo. Try AD-DEL-01 or AD-HAR-02.');
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true);
    if (!batch) { setBatchError('Verify a valid batch code before continuing.'); return; }
    if (errors.name || errors.email || errors.mobile || !terms) return;
    login({ name: name.trim(), email: email.trim(), school: batch.school, state: batch.state, role: 'Teacher' });
    setMobile(''); onBack();
  }
  const helper = (field: keyof typeof errors) => submitted ? errors[field] : '';
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 6 } }}>
    <Container maxWidth="lg">
      <Button onClick={onBack} sx={{ mb: 3 }}>← Back to learning portal</Button>
      <Chip label="ADDING DIMENSION · SELF REGISTRATION" sx={{ display: 'flex', width: 'fit-content', mb: 2 }} />
      <Typography component="h1" variant="h3" sx={{ fontWeight: 650, letterSpacing: '-1.5px', mb: 1 }}>Your classroom journey starts here.</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Find your training batch, confirm its location, and create your demo learner profile.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 3, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Typography component="h2" variant="h5">Join a training batch</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Batch code" value={code} onChange={(event) => { setCode(event.target.value); setBatch(undefined); setBatchError(''); }} helperText="Sample codes: AD-DEL-01 or AD-HAR-02" />
              <Button variant="outlined" onClick={verifyBatch} sx={{ flexShrink: 0 }}>Verify batch</Button>
            </Stack>
            {batchError && <Alert severity="error" role="alert">{batchError}</Alert>}
            {batch && <Box sx={{ bgcolor: '#edf2e6', borderRadius: 2, p: 2.5 }}>
              <Chip size="small" label="BATCH VERIFIED · DEMO" sx={{ mb: 1.5 }} />
              <Typography sx={{ fontWeight: 600 }}>{batch.name}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{batch.school} · {batch.state}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{batch.trainer} · {batch.date}</Typography>
            </Box>}
            <Box component="form" onSubmit={submit} noValidate><Stack spacing={2.25}>
              <TextField required fullWidth label="Full name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} error={!!helper('name')} helperText={helper('name')} />
              <TextField required fullWidth label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={!!helper('email')} helperText={helper('email')} />
              <TextField required fullWidth label="Mobile number" type="tel" autoComplete="tel-national" value={mobile} onChange={(event) => setMobile(event.target.value)} error={!!helper('mobile')} helperText={helper('mobile') || 'Used to preview validation only; never saved.'} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="School / training location" value={batch?.school ?? ''} slotProps={{ input: { readOnly: true } }} />
                <TextField fullWidth label="State" value={batch?.state ?? ''} slotProps={{ input: { readOnly: true } }} />
              </Stack>
              <Box><FormControlLabel control={<Checkbox required checked={terms} onChange={(event) => setTerms(event.target.checked)} />} label={<Typography variant="body2">I understand this is a local demo and my profile is saved in this browser.</Typography>} />{submitted && !terms && <Typography variant="caption" color="error" role="alert">Acknowledge the demo terms to continue.</Typography>}</Box>
              <Button variant="contained" type="submit" size="large">Create learner demo profile</Button>
            </Stack></Box>
            <Alert severity="info">Frontend preview only. No real batch enrollment, authentication, email, or SMS occurs. Use sample details. Passwords and mobile numbers are never saved.</Alert>
          </Stack>
        </Paper>
        <BatchShareCard />
      </Box>
    </Container>
  </Box>;
}
