import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import App from '../App';
import { theme } from '../theme';
import { useTrainingStore } from '../store/useTrainingStore';

beforeEach(() => { useTrainingStore.getState().resetDemo(); window.history.replaceState({}, '', '/'); });
describe('application navigation and logout', () => {
  it('opens teacher workspace and removes access after logout', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider theme={theme}><App/></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Teacher demo' }));
    expect(screen.getByText('Hello, Aditi.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sponsor dashboard' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Log out' }));
    expect(screen.getByRole('button', { name: 'Teacher demo' })).toBeInTheDocument();
    expect(screen.queryByText('Hello, Aditi.')).not.toBeInTheDocument();
    expect(useTrainingStore.getState().profile).toBeNull();
  });
  it('opens sponsor overview and supports public batch deep links', async () => {
    const user = userEvent.setup();
    const app = render(<ThemeProvider theme={theme}><App/></ThemeProvider>);
    await user.click(screen.getByRole('button', { name: 'Sponsor demo' }));
    expect(screen.getByText('See the difference, together.')).toBeInTheDocument();
    app.unmount();
    useTrainingStore.getState().resetDemo();
    window.history.replaceState({}, '', '/#register?batch=AD-DEL-01');
    render(<ThemeProvider theme={theme}><App/></ThemeProvider>);
    expect(screen.getByText('Join a training batch')).toBeInTheDocument();
    expect(screen.getByLabelText('School / training location')).toHaveValue('Demo Public School');
    expect(screen.queryByText('See the difference, together.')).not.toBeInTheDocument();
  });
});
