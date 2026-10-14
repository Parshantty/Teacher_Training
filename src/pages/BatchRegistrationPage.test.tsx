// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BatchRegistrationPage from './BatchRegistrationPage';
import { useTrainingStore } from '../store/useTrainingStore';

afterEach(() => { cleanup(); window.location.hash = ''; useTrainingStore.getState().resetDemo(); vi.restoreAllMocks(); });
describe('batch registration preview', () => {
  it('prefills a valid deep link and validates registration before creating a local profile', () => {
    window.location.hash = '#register?batch=AD-HAR-02';
    const back = vi.fn();
    render(<BatchRegistrationPage onBack={back} />);
    expect(screen.getByLabelText('State').getAttribute('value')).toBe('Haryana');
    expect(screen.getByLabelText('School / training location').getAttribute('value')).toBe('Demo Learning School');
    fireEvent.click(screen.getByRole('button', { name: 'Create learner demo profile' }));
    expect(screen.getByText('Enter your full name.')).toBeTruthy();
    expect(useTrainingStore.getState().profile).toBeNull();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: 'Demo Teacher' } });
    fireEvent.change(screen.getByLabelText(/^Email address/), { target: { value: 'teacher@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Mobile number/), { target: { value: '9876543210' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Create learner demo profile' }));
    expect(useTrainingStore.getState().profile).toEqual({ name: 'Demo Teacher', email: 'teacher@example.com', school: 'Demo Learning School', state: 'Haryana', role: 'Teacher' });
    expect(JSON.stringify(useTrainingStore.getState().profile)).not.toContain('9876543210');
    expect(back).toHaveBeenCalledOnce();
  });
  it('rejects unknown batch codes and clears an earlier verified location', () => {
    window.location.hash = '#register?batch=AD-DEL-01';
    render(<BatchRegistrationPage onBack={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Batch code'), { target: { value: 'UNKNOWN' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify batch' }));
    expect(screen.getByText(/This batch code is not available/)).toBeTruthy();
    expect(screen.getByLabelText('State').getAttribute('value')).toBe('');
  });
  it('copies a complete batch registration URL and provides a manual fallback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<BatchRegistrationPage onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration link' }));
    await waitFor(() => expect(screen.getByText('Registration link copied.')).toBeTruthy());
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}${window.location.pathname}#register?batch=AD-DEL-01`);
    writeText.mockRejectedValueOnce(new Error('Clipboard unavailable'));
    fireEvent.click(screen.getByRole('button', { name: 'Copy registration link' }));
    await waitFor(() => expect(screen.getByText(/Select and copy the registration link above/)).toBeTruthy());
  });
});
