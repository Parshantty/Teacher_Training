import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import LessonViewer from '../components/LessonViewer';
import { courses, sessions, type Course } from '../data/training';
import { useTrainingStore } from '../store/useTrainingStore';

export default function DashboardPage() {
  const profile = useTrainingStore(s => s.profile);
  const enrolled = useTrainingStore(s => s.enrolledCourses);
  const progress = useTrainingStore(s => s.courseProgress);
  const registered = useTrainingStore(s => s.registeredSessions);
  const setView = useTrainingStore(s => s.setView);
  const [selected, setSelected] = useState<Course | null>(null);
  const active = courses.filter(c => enrolled.includes(c.id));
  const complete = active.filter(c => (progress[c.id] ?? 0) >= c.lessons.length).length;
  const completedLessons = courses.reduce((total, c) => total + (progress[c.id] ?? 0), 0);
  return <Stack spacing={4}>
    <Card sx={{ bgcolor: '#e8eee2', p: { xs: 3, md: 4 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', right: { xs: -40, md: 35 }, top: -42, fontSize: 240, opacity: .12, color: '#285548', pointerEvents: 'none' }} aria-hidden>✳</Box>
      <Box sx={{ position: 'relative', maxWidth: 660 }}><Chip label="A LITTLE LEARNING, EVERY DAY" size="small" sx={{ bgcolor: '#ffffff80', mb: 2 }} /><Typography variant="h3">Hello, {profile?.name.split(' ')[0] || 'teacher'}.</Typography><Typography variant="h4" sx={{ fontWeight: 400, mt: .5 }}>Your next chapter starts here.</Typography><Typography sx={{ mt: 2, mb: 3, maxWidth: 440 }} color="text.secondary">Grow your practice, connect with your peers, and make a difference in every classroom.</Typography><Button variant="contained" onClick={() => setView('courses')}>Explore your learning path <span aria-hidden style={{ marginLeft: 12 }}>↗</span></Button></Box>
    </Card>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>{[
      { value: active.length, label: 'Courses enrolled', note: 'Your learning collection' }, { value: completedLessons, label: 'Lessons completed', note: 'One step at a time' }, { value: complete, label: 'Courses completed', note: 'Keep the momentum' }, { value: registered.length, label: 'Sessions booked', note: 'Learn together' },
    ].map(item => <Card key={item.label} sx={{ p: 2.5 }}><Typography variant="h3">{item.value.toString().padStart(2, '0')}</Typography><Typography sx={{ fontWeight: 600, mt: 1 }}>{item.label}</Typography><Typography variant="caption" color="text.secondary">{item.note}</Typography></Card>)}</Box>
    <Box><Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}><Box><Typography variant="h5">Pick up where you left off</Typography><Typography color="text.secondary" variant="body2">A few minutes today can change tomorrow.</Typography></Box><Button onClick={() => setView('courses')}>All courses ↗</Button></Stack>
      {active.length ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>{active.slice(0, 2).map(course => <CourseCard key={course.id} course={course} onOpen={setSelected} />)}</Box> : <Card sx={{ p: 3 }}><Typography sx={{ mb: 2 }}>Your learning journey is ready to begin.</Typography><Button onClick={() => setView('courses')}>Find your first course</Button></Card>}
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: 3 }}>
      <Card sx={{ p: 3 }}><Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}><Typography variant="h5">Learning, together</Typography><Button onClick={() => setView('sessions')}>View sessions ↗</Button></Stack>{sessions.slice(0, 2).map(session => <Box key={session.id} sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider' }}><Typography sx={{ fontWeight: 600 }}>{session.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{session.date} · {session.time}</Typography>{registered.includes(session.id) && <Chip label="Registered" size="small" color="primary" sx={{ mt: 1 }} />}</Box>)}<Typography variant="caption" color="text.secondary">Sample sessions for this demo.</Typography></Card>
      <Card sx={{ bgcolor: '#f5e4d7', p: 3 }}><Typography variant="overline">YOUR TEACHING TOOLKIT</Typography><Typography variant="h5" sx={{ mt: 1 }}>Make room for growth.</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>Keep your profile up to date and find the support you need.</Typography><Stack spacing={1}><Button variant="outlined" onClick={() => setView('profile')}>Update my profile ↗</Button><Button variant="outlined" onClick={() => setView('sessions')}>Find a peer workshop ↗</Button></Stack></Card>
    </Box>
    <LessonViewer course={selected} onClose={() => setSelected(null)} />
  </Stack>;
}
