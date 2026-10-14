// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AuthForms from './AuthForms';
import ResetPasswordForm from './ResetPasswordForm';

afterEach(() => { cleanup(); vi.useRealTimers(); });
describe('local authentication preview', () => {
  it('rejects unknown credentials and passes only the synthetic profile to the store', () => {
    const login = vi.fn();
    render(<AuthForms mode="login" onLogin={login} onModeChange={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/User ID/), { target: { value: 'unknown' } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'Wrong@123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in to demo/ }));
    expect(login).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('Use user ID teacher or sponsor');
    fireEvent.change(screen.getByLabelText(/User ID/), { target: { value: 'teacher' } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: 'Demo@123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign in to demo/ }));
    expect(login).toHaveBeenCalledWith({ name: 'Aditi Sharma', email: 'aditi@example.com', school: 'Demo Public School', state: 'Delhi', role: 'Teacher' });
    expect(screen.getByLabelText(/^Password/).getAttribute('value')).toBe('');
  });
  it('expires local verification codes and validates new password confirmation', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-14T10:00:00Z'));
    render(<ResetPasswordForm onBack={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/Mobile number/), { target: { value: '9876543210' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate demo code' }));
    vi.setSystemTime(new Date('2026-10-14T10:03:00Z'));
    fireEvent.change(screen.getByLabelText(/Verification code/), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify demo code' }));
    expect(screen.getByText(/code has expired/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Generate a new demo code' }));
    fireEvent.change(screen.getByLabelText(/Verification code/), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify demo code' }));
    fireEvent.change(screen.getByLabelText(/^New password/), { target: { value: 'Stronger@123' } });
    fireEvent.change(screen.getByLabelText(/^Confirm new password/), { target: { value: 'Mismatch@123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Preview password reset' }));
    expect(screen.getByText('The passwords do not match.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/^Confirm new password/), { target: { value: 'Stronger@123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Preview password reset' }));
    expect(screen.getByText(/No password was saved/)).toBeTruthy();
    expect(screen.queryByLabelText(/^New password/)).toBeNull();
  });
});
