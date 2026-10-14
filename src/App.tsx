import { useEffect } from 'react';
import AppShell from './components/AppShell';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import SessionsPage from './pages/SessionsPage';
import SponsorPage from './pages/SponsorPage';
import ProfilePage from './pages/ProfilePage';
import BatchRegistrationPage from './pages/BatchRegistrationPage';
import { useTrainingStore } from './store/useTrainingStore';
import type { View } from './store/useTrainingStore';
import { useState } from 'react';
const views: View[] = ['dashboard', 'courses', 'sessions', 'sponsor', 'profile'];
export default function App() {
  const profile = useTrainingStore((s) => s.profile);
  const view = useTrainingStore((s) => s.view);
  const setView = useTrainingStore((s) => s.setView);
  const [registration, setRegistration] = useState(window.location.hash.startsWith('#register'));
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1).split('?')[0];
      setRegistration(hash === 'register');
      const found = views.find((v) => v === hash);
      if (found) setView(found);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [setView]);
  useEffect(() => {
    if (profile && !registration) window.location.hash = view;
  }, [profile, view, registration]);
  const openRegistration = () => { window.location.hash = 'register?batch=AD-DEL-01'; setRegistration(true); };
  if (registration) return <BatchRegistrationPage onBack={() => { window.location.hash = useTrainingStore.getState().profile ? 'dashboard' : 'login'; setRegistration(false); }}/>;
  if (!profile) return <AuthPage/>;
  const content = view === 'courses' ? <CoursesPage/> : view === 'sessions' ? <SessionsPage/> : view === 'sponsor' && profile.role === 'Sponsor' ? <SponsorPage/> : view === 'profile' ? <ProfilePage/> : <DashboardPage/>;
  return <AppShell onBatchLink={openRegistration}>{content}</AppShell>;
}
