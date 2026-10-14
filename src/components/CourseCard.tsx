import { Box, Button, Card, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import type { Course } from '../data/training';
import { useTrainingStore } from '../store/useTrainingStore';

export default function CourseCard({ course, onOpen }: { course: Course; onOpen: (course: Course) => void }) {
  const completed = useTrainingStore(s => s.courseProgress[course.id] ?? 0);
  const enrolled = useTrainingStore(s => s.enrolledCourses.includes(course.id));
  const enroll = useTrainingStore(s => s.enrollCourse);
  const percent = Math.round(completed / course.lessons.length * 100);
  return <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <Box sx={{ bgcolor: course.color, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Chip label={course.category} size="small" sx={{ bgcolor: '#ffffff99' }} />
      <Typography aria-hidden sx={{ fontSize: 48, lineHeight: 1, color: '#294d43' }}>{course.symbol}</Typography>
    </Box>
    <Stack spacing={1.5} sx={{ p: 3, flex: 1 }}>
      <Typography variant="h6">{course.title}</Typography>
      <Typography color="text.secondary" variant="body2">{course.description}</Typography>
      <Typography variant="caption" color="text.secondary">{course.lessons.length} lessons · {course.duration} · Self-paced</Typography>
      <Box sx={{ flex: 1 }} />
      {enrolled && <Box><Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}><Typography variant="caption">{completed} of {course.lessons.length} lessons</Typography><Typography variant="caption">{percent}%</Typography></Stack><LinearProgress variant="determinate" value={percent} aria-label={`${course.title} progress`} sx={{ height: 6, borderRadius: 3 }} /></Box>}
      <Button variant={enrolled ? 'outlined' : 'contained'} onClick={() => { if (!enrolled) enroll(course.id); onOpen(course); }}>{!enrolled ? 'Enroll & start learning' : percent === 100 ? 'Review course' : 'Continue learning'} <span aria-hidden style={{ marginLeft: 8 }}>↗</span></Button>
    </Stack>
  </Card>;
}
