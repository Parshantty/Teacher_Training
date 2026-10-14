import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function ResetPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [expiresAt, setExpiresAt] = useState(0);
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    if (step === 0) {
      if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
      setExpiresAt(Date.now() + 120_000); setStep(1);
    } else if (step === 1) {
      if (Date.now() > expiresAt) { setError('This demo code has expired. Generate a new code.'); return; }
      if (otp !== '123456') { setError('Use the demo code 123456.'); return; }
      setStep(2); setOtp('');
    } else {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/.test(password)) { setError('Use at least 8 characters, an uppercase letter, a lowercase letter, a number, and a symbol, with no spaces.'); return; }
      if (password !== confirm) { setError('The passwords do not match.'); return; }
      setPassword(''); setConfirm(''); setMobile(''); setStep(3);
    }
  }
  return <Box component="form" noValidate onSubmit={submit}><Stack spacing={2.25}>
    <Alert severity="info">Local preview only. No SMS is sent and no account password is changed.</Alert>
    {step === 0 && <TextField required fullWidth label="Mobile number" type="tel" autoComplete="tel-national" value={mobile} onChange={(e) => setMobile(e.target.value)} helperText="10-digit Indian mobile number, without country code" />}
    {step === 1 && <>
      <Typography variant="body2">Demo verification code: <strong>123456</strong>. Valid for 2 minutes after generation.</Typography>
      <TextField required fullWidth label="Verification code" value={otp} onChange={(e) => setOtp(e.target.value)} autoComplete="one-time-code" slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }} />
      <Button onClick={() => { setExpiresAt(Date.now() + 120_000); setOtp(''); setError(''); }}>Generate a new demo code</Button>
    </>}
    {step === 2 && <>
      <TextField required fullWidth type="password" label="New password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} helperText="8+ characters, uppercase, lowercase, number and symbol. Use a made-up password." />
      <TextField required fullWidth type="password" label="Confirm new password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
    </>}
    {error && <Alert severity="error" role="alert">{error}</Alert>}
    {step === 3 ? <Alert severity="success" role="status">Password reset preview complete. No password was saved. Sign in using the published demo credentials.</Alert> : <Button type="submit" variant="contained" size="large">{['Generate demo code', 'Verify demo code', 'Preview password reset'][step]}</Button>}
    <Button onClick={onBack}>Back to sign in</Button>
  </Stack></Box>;
}
