import { useState } from 'react';
import { Alert, Button, Chip, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { trainingBatches } from '../data/batches';

export default function BatchShareCard() {
  const [code, setCode] = useState(trainingBatches[0].code);
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const link = `${window.location.origin}${window.location.pathname}#register?batch=${encodeURIComponent(code)}`;
  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setStatus('copied'); }
    catch { setStatus('manual'); }
  }
  return <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}><Stack spacing={2.5}>
    <Chip size="small" label="FOR TRAINERS · DEMO" sx={{ alignSelf: 'flex-start' }} />
    <Typography component="h2" variant="h6">Invite your next cohort</Typography>
    <Typography variant="body2" color="text.secondary">Choose an eligible sample batch and share its registration link. Both batches are open in this frontend preview.</Typography>
    <TextField select fullWidth label="Eligible training batch" value={code} onChange={(event) => { setCode(event.target.value); setStatus('idle'); }}>{trainingBatches.map((batch) => <MenuItem value={batch.code} key={batch.code}>{batch.name}</MenuItem>)}</TextField>
    <TextField fullWidth label="Registration link" value={link} slotProps={{ input: { readOnly: true } }} helperText="Select this field to copy the link manually if needed." />
    <Button variant="outlined" onClick={copyLink}>Copy registration link</Button>
    {status === 'copied' && <Alert severity="success" role="status">Registration link copied.</Alert>}
    {status === 'manual' && <Alert severity="info" role="status">Clipboard access is unavailable. Select and copy the registration link above.</Alert>}
  </Stack></Paper>;
}
