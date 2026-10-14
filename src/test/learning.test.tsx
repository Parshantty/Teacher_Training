import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import CoursesPage from '../pages/CoursesPage';
import SessionsPage from '../pages/SessionsPage';
import { useTrainingStore } from '../store/useTrainingStore';

beforeEach(() => { localStorage.clear(); useTrainingStore.getState().resetDemo(); });

describe('course learning', () => {
  it('combines category and search filters and offers a meaningful empty state', async () => {
    const user = userEvent.setup();
    render(<CoursesPage />);
    await user.click(screen.getByRole('button', { name: 'Inclusion' }));
    expect(screen.getByRole('heading', { name: 'A classroom for everyone' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Foundations of great teaching' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search courses' }), 'digital');
    expect(screen.getByRole('alert')).toHaveTextContent('No courses match');
    await user.click(screen.getByRole('button', { name: 'All courses' }));
    expect(screen.getByRole('heading', { name: 'Digital tools, human connection' })).toBeVisible();
  });

  it('enrolls in a course and completes substantive lessons without exceeding the total', async () => {
    const user = userEvent.setup();
    render(<CoursesPage />);
    await user.click(screen.getByRole('button', { name: 'Inclusion' }));
    await user.click(screen.getByRole('button', { name: /Enroll & start learning/ }));
    expect(useTrainingStore.getState().enrolledCourses).toContain('inclusive');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Notice barriers, not labels' })).toBeVisible();
    expect(within(dialog).getByText(/Observe where an activity creates a barrier/)).toBeVisible();
    for (let lesson = 1; lesson <= 4; lesson++) {
      await user.click(within(dialog).getByRole('button', { name: /Mark complete/ }));
      expect(useTrainingStore.getState().courseProgress.inclusive).toBe(lesson);
    }
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Course complete');
    expect(within(dialog).queryByRole('button', { name: /Mark complete/ })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /Read lesson 1/ }));
    expect(within(dialog).getByRole('heading', { name: 'Notice barriers, not labels' })).toBeVisible();
    expect(useTrainingStore.getState().courseProgress.inclusive).toBe(4);
  });

  it('opens a shorter course after reviewing the final lesson of a longer one', async () => {
    const user = userEvent.setup();
    useTrainingStore.setState({ courseProgress: { foundations: 4, digital: 1 } });
    render(<CoursesPage />);
    await user.click(screen.getByRole('button', { name: /Review course/ }));
    expect(screen.getByRole('heading', { name: 'Reflect and adapt' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('button', { name: /Continue learning/ }));
    expect(screen.getByRole('heading', { name: 'Design an accessible activity' })).toBeVisible();
  });
});

describe('workshop registration', () => {
  it('registers and cancels a session, updating the personal session list', async () => {
    const user = userEvent.setup();
    render(<SessionsPage />);
    await user.click(screen.getByRole('button', { name: 'My registrations' }));
    expect(screen.getByText("You haven't registered for a session yet.")).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Explore sessions' }));
    await user.click(screen.getAllByRole('button', { name: 'Register for session' })[0]);
    expect(useTrainingStore.getState().registeredSessions).toEqual(['inclusive-workshop']);
    await user.click(screen.getByRole('button', { name: 'My registrations' }));
    expect(screen.getByRole('heading', { name: 'Making inclusion an everyday practice' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Your first digital lesson studio' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel registration' }));
    expect(useTrainingStore.getState().registeredSessions).toEqual([]);
    expect(screen.getByText("You haven't registered for a session yet.")).toBeVisible();
  });
});
