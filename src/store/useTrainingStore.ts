import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type View = 'dashboard' | 'courses' | 'sessions' | 'sponsor' | 'profile';
export interface Profile { name: string; email: string; school: string; state: string; role: 'Teacher' | 'Sponsor' }
interface TrainingState {
  profile: Profile | null;
  view: View;
  courseProgress: Record<string, number>;
  enrolledCourses: string[];
  registeredSessions: string[];
  login: (profile: Profile) => void;
  logout: () => void;
  setView: (view: View) => void;
  updateProfile: (profile: Profile) => void;
  enrollCourse: (id: string) => void;
  completeLesson: (id: string, totalLessons: number) => void;
  registerSession: (id: string) => void;
  cancelSession: (id: string) => void;
  resetDemo: () => void;
}
const initialLearning = { courseProgress: { foundations: 2, digital: 1 }, enrolledCourses: ['foundations', 'digital'], registeredSessions: [] as string[] };
export const useTrainingStore = create<TrainingState>()(persist((set) => ({
  profile: null, view: 'dashboard', ...initialLearning,
  login: (profile) => set({ profile, view: profile.role === 'Sponsor' ? 'sponsor' : 'dashboard' }),
  logout: () => set({ profile: null, view: 'dashboard' }),
  setView: (view) => set({ view }),
  updateProfile: (profile) => set({ profile }),
  enrollCourse: (id) => set((s) => ({ enrolledCourses: [...new Set([...s.enrolledCourses, id])] })),
  completeLesson: (id, totalLessons) => set((s) => ({ courseProgress: { ...s.courseProgress, [id]: Math.min(totalLessons, (s.courseProgress[id] ?? 0) + 1) } })),
  registerSession: (id) => set((s) => ({ registeredSessions: [...new Set([...s.registeredSessions, id])] })),
  cancelSession: (id) => set((s) => ({ registeredSessions: s.registeredSessions.filter((v) => v !== id) })),
  resetDemo: () => set({ ...initialLearning, profile: null, view: 'dashboard' }),
}), { name: 'adding-dimension-demo', partialize: (s) => ({ profile: s.profile, courseProgress: s.courseProgress, enrolledCourses: s.enrolledCourses, registeredSessions: s.registeredSessions }) }));
