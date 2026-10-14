import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { it, expect, beforeEach } from 'vitest';
import ProfilePage from '../pages/ProfilePage';
import { useTrainingStore } from '../store/useTrainingStore';
beforeEach(() => useTrainingStore.getState().resetDemo());
it('preserves a registration state outside the initial five states when editing a profile', async () => {
  useTrainingStore.getState().login({ name: 'Demo Teacher', email: 'teacher@example.com', school: 'Demo School', state: 'Tamil Nadu', role: 'Teacher' });
  render(<ProfilePage/>);
  expect(screen.getByRole('combobox', { name: 'State' })).toHaveTextContent('Tamil Nadu');
  const user = userEvent.setup();
  await user.clear(screen.getByLabelText(/Full name/));
  await user.type(screen.getByLabelText(/Full name/), 'Updated Teacher');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Profile updated in this browser.');
  expect(useTrainingStore.getState().profile).toMatchObject({ name: 'Updated Teacher', state: 'Tamil Nadu' });
});
