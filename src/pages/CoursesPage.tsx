import { Alert, Box, Chip, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import LessonViewer from '../components/LessonViewer';
import { courses, type Course } from '../data/training';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All courses');
  const [selected, setSelected] = useState<Course | null>(null);
  const filtered = courses.filter(c => (category === 'All courses' || c.category === category) && `${c.title} ${c.description}`.toLowerCase().includes(search.toLowerCase()));
  return <Stack spacing={3}>
    <Box><Typography variant="overline" color="primary">YOUR LEARNING JOURNEY</Typography><Typography variant="h3">Small steps. Lasting impact.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Practical ideas you can bring to your classroom tomorrow.</Typography></Box>
    <TextField label="Search courses" placeholder="Try inclusion or digital tools" value={search} onChange={e => setSearch(e.target.value)} fullWidth sx={{ maxWidth: 520 }} />
    <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>{['All courses', ...new Set(courses.map(c => c.category))].map(item => <Chip key={item} label={item} clickable color={category === item ? 'primary' : 'default'} onClick={() => setCategory(item)} aria-pressed={category === item} />)}</Stack>
    <Typography variant="body2" color="text.secondary">{filtered.length} courses · Sample learning library</Typography>
    {filtered.length ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 3 }}>{filtered.map(course => <CourseCard key={course.id} course={course} onOpen={setSelected} />)}</Box> : <Alert severity="info">No courses match your search. Try another keyword or category.</Alert>}
    <LessonViewer course={selected} onClose={() => setSelected(null)} />
  </Stack>;
}
