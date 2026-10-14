import { beforeEach, describe, expect, it } from 'vitest';
import { useTrainingStore, type Profile } from '../store/useTrainingStore';

const profile: Profile = { name: 'Test Teacher', email: 'teacher@example.com', school: 'Demo School', state: 'Delhi', role: 'Teacher' };

beforeEach(() => {
  localStorage.clear();
  useTrainingStore.getState().resetDemo();
});

describe('local learning state', () => {
  it('caps progress at the course lesson count', () => {
    const { completeLesson } = useTrainingStore.getState();
    for (let index = 0; index < 6; index += 1) completeLesson('new-course', 3);
    expect(useTrainingStore.getState().courseProgress['new-course']).toBe(3);
    expect(useTrainingStore.getState().courseProgress.foundations).toBe(2);
  });

  it('keeps course enrollment unique', () => {
    const { enrollCourse } = useTrainingStore.getState();
    enrollCourse('new-course');
    enrollCourse('new-course');
    expect(useTrainingStore.getState().enrolledCourses.filter((id) => id === 'new-course')).toHaveLength(1);
  });

  it('prevents duplicate session registrations and cancels only the requested session', () => {
    const { registerSession, cancelSession } = useTrainingStore.getState();
    registerSession('session-one');
    registerSession('session-one');
    registerSession('session-two');
    expect(useTrainingStore.getState().registeredSessions).toEqual(['session-one', 'session-two']);
    cancelSession('session-one');
    cancelSession('session-one');
    expect(useTrainingStore.getState().registeredSessions).toEqual(['session-two']);
  });

  it('logout clears the profile and persisted session while retaining local learning progress', () => {
    const { login, setView, completeLesson, logout } = useTrainingStore.getState();
    login(profile);
    setView('profile');
    completeLesson('foundations', 8);
    logout();
    expect(useTrainingStore.getState().profile).toBeNull();
    expect(useTrainingStore.getState().view).toBe('dashboard');
    expect(useTrainingStore.getState().courseProgress.foundations).toBe(3);
    const persisted = JSON.parse(localStorage.getItem('adding-dimension-demo') ?? '{}') as { state?: { profile?: Profile | null } };
    expect(persisted.state?.profile).toBeNull();
  });
});
