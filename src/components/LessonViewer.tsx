import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { Course } from '../data/training';
import { useTrainingStore } from '../store/useTrainingStore';

export default function LessonViewer({ course, onClose }: { course: Course | null; onClose: () => void }) {
  return course ? <LessonDialog key={course.id} course={course} onClose={onClose} /> : null;
}

function LessonDialog({ course, onClose }: { course: Course; onClose: () => void }) {
  const progress = useTrainingStore(s => s.courseProgress[course.id] ?? 0);
  const completeLesson = useTrainingStore(s => s.completeLesson);
  const [index, setIndex] = useState(() => Math.min(progress, course.lessons.length - 1));
  const lesson = course.lessons[index];
  const complete = progress >= course.lessons.length;
  const markComplete = () => { completeLesson(course.id, course.lessons.length); if (index < course.lessons.length - 1) setIndex(index + 1); };
  return <Dialog open onClose={onClose} fullWidth maxWidth="md" aria-labelledby="lesson-title">
    <DialogTitle id="lesson-title">{course.title}</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{progress} of {course.lessons.length} lessons completed</Typography>
      <LinearProgress variant="determinate" value={progress / course.lessons.length * 100} aria-label="Course completion" sx={{ mb: 3 }} />
      {complete && <Alert severity="success" sx={{ mb: 3 }}>Course complete. You can revisit any lesson below.</Alert>}
      <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", mb: 3 }}>{course.lessons.map((item, i) => <Button key={item.title} variant={index === i ? 'contained' : 'outlined'} size="small" onClick={() => setIndex(i)} aria-label={`Read lesson ${i + 1}: ${item.title}`} disabled={i > progress}>{i < progress ? '✓ ' : ''}{i + 1}</Button>)}</Stack>
      <Typography variant="overline" color="text.secondary">Lesson {index + 1}</Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>{lesson.title}</Typography>
      <Typography sx={{ lineHeight: 1.9 }}>{lesson.content}</Typography>
      <Box sx={{ bgcolor: '#f3f5ed', p: 3, borderRadius: 3, mt: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Put it into practice</Typography><Typography>{lesson.activity}</Typography></Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>Demo learning activity. Completion is saved on this browser; no certificate is issued.</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 3 }}><Button onClick={onClose}>Close</Button>{index < progress ? <Button onClick={() => setIndex(Math.min(progress, course.lessons.length - 1))}>Go to current lesson</Button> : !complete && <Button variant="contained" onClick={markComplete}>Mark complete & {index === course.lessons.length - 1 ? 'finish' : 'continue'}</Button>}</DialogActions>
  </Dialog>;
}
