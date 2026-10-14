import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthPage from '../pages/AuthPage';
import { useTrainingStore } from '../store/useTrainingStore';

beforeEach(() => {
  localStorage.clear();
  useTrainingStore.getState().resetDemo();
});

describe('account forms', () => {
  it('shows mandatory registration validation and does not create an empty profile', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('tab', { name: 'Self registration' }));
    await user.click(screen.getByRole('button', { name: /Create demo profile/i }));
    for (const message of ['Enter your full name.', 'Enter a valid email address.', 'Use at least 8 characters for this demo.', 'Enter your school or organization.', 'Choose your state or union territory.', 'Please acknowledge the demo terms to continue.']) {
      expect(screen.getByText(message)).toBeVisible();
    }
    expect(useTrainingStore.getState().profile).toBeNull();
  });

  it('rejects credentials other than the published demo credentials', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.type(screen.getByLabelText(/User ID/i), 'unrecognized');
    await user.type(screen.getByLabelText(/^Password/i), 'Wrong@123');
    await user.click(screen.getByRole('button', { name: /Sign in to demo/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Use user ID teacher or sponsor');
    expect(useTrainingStore.getState().profile).toBeNull();
  });

  it('accepts published teacher credentials without persisting the password', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.type(screen.getByLabelText(/User ID/i), 'teacher');
    await user.type(screen.getByLabelText(/^Password/i), 'Demo@123');
    await user.click(screen.getByRole('button', { name: /Sign in to demo/i }));
    expect(useTrainingStore.getState().profile?.role).toBe('Teacher');
    expect(screen.getByLabelText(/^Password/i)).toHaveValue('');
    expect(localStorage.getItem('adding-dimension-demo')).not.toContain('Demo@123');
  });

  it.each(['Teacher', 'Sponsor'] as const)('opens the %s demo with the matching role', async (role) => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: `${role} demo` }));
    expect(useTrainingStore.getState().profile?.role).toBe(role);
    expect(useTrainingStore.getState().view).toBe(role === 'Sponsor' ? 'sponsor' : 'dashboard');
  });
});

describe('password reset preview', () => {
  it('validates mobile, OTP, password strength, and matching confirmation before completing locally', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Forgot password?' }));
    await user.click(screen.getByRole('button', { name: 'Generate demo code' }));
    expect(screen.getByText('Enter a valid 10-digit Indian mobile number.')).toBeVisible();
    await user.type(screen.getByLabelText(/Mobile number/i), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Generate demo code' }));
    await user.type(screen.getByLabelText(/Verification code/i), '000000');
    await user.click(screen.getByRole('button', { name: 'Verify demo code' }));
    expect(screen.getByText('Use the demo code 123456.')).toBeVisible();
    await user.clear(screen.getByLabelText(/Verification code/i));
    await user.type(screen.getByLabelText(/Verification code/i), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify demo code' }));
    await user.type(screen.getByLabelText(/^New password/i), 'weakpass');
    await user.type(screen.getByLabelText(/Confirm new password/i), 'weakpass');
    await user.click(screen.getByRole('button', { name: 'Preview password reset' }));
    expect(screen.getByText(/Use at least 8 characters, an uppercase letter/i)).toBeVisible();
    await user.clear(screen.getByLabelText(/^New password/i));
    await user.type(screen.getByLabelText(/^New password/i), 'Strong@456');
    await user.click(screen.getByRole('button', { name: 'Preview password reset' }));
    expect(screen.getByText('The passwords do not match.')).toBeVisible();
    await user.clear(screen.getByLabelText(/Confirm new password/i));
    await user.type(screen.getByLabelText(/Confirm new password/i), 'Strong@456');
    await user.click(screen.getByRole('button', { name: 'Preview password reset' }));
    expect(screen.getByRole('status')).toHaveTextContent('No password was saved');
    expect(localStorage.getItem('adding-dimension-demo')).not.toContain('Strong@456');
    expect(useTrainingStore.getState().profile).toBeNull();
  });

  it('rejects an expired code and allows a newly generated code', async () => {
    const user = userEvent.setup();
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Forgot password?' }));
    await user.type(screen.getByLabelText(/Mobile number/i), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Generate demo code' }));
    await user.type(screen.getByLabelText(/Verification code/i), '123456');
    now.mockReturnValue(1_120_001);
    await user.click(screen.getByRole('button', { name: 'Verify demo code' }));
    expect(screen.getByText('This demo code has expired. Generate a new code.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Generate a new demo code' }));
    await user.type(screen.getByLabelText(/Verification code/i), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify demo code' }));
    expect(screen.getByLabelText(/^New password/i)).toBeVisible();
  });
});
