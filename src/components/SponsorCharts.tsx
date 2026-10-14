import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';
import { summarize, type SponsorRow } from '../data/sponsor';

export default function SponsorCharts({ rows }: { rows: SponsorRow[] }) {
  const districts = [...new Set(rows.map(row => row.district))];
  const past = rows.filter(row => row.status !== 'Upcoming').sort((a, b) => a.date.localeCompare(b.date));
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
    <Card sx={{ p: 3 }}><Typography variant="h6" sx={{ mb: 1 }}>Target participants vs trained</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Training reach by district</Typography>{districts.map(district => {
      const metrics = summarize(rows.filter(row => row.district === district));
      return <Box key={district} sx={{ mb: 2.5 }}><Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}><Typography variant="body2">{district}</Typography><Typography variant="body2">{metrics.trained} / {metrics.target}</Typography></Stack><LinearProgress variant="determinate" value={metrics.target ? metrics.trained / metrics.target * 100 : 0} aria-label={`${district}: ${metrics.trained} trained of ${metrics.target} target`} sx={{ height: 9, borderRadius: 4, bgcolor: '#e8eee2' }} /></Box>;
    })}{!districts.length && <Typography color="text.secondary">No matching district data.</Typography>}</Card>
    <Card sx={{ p: 3 }}><Typography variant="h6" sx={{ mb: 1 }}>Attendance across batches</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sample attendance by batch start date</Typography>{past.map(row => <Box key={row.batch} sx={{ mb: 2.5 }}><Stack direction="row" sx={{ justifyContent: "space-between", mb: 1 }}><Typography variant="body2">{row.date} · {row.batch}</Typography><Typography variant="body2">{Math.round(row.attended / row.teachers * 100)}%</Typography></Stack><LinearProgress variant="determinate" value={row.attended / row.teachers * 100} aria-label={`${row.batch} attendance: ${row.attended} of ${row.teachers}`} sx={{ height: 9, borderRadius: 4, bgcolor: '#f5e4d7', '& .MuiLinearProgress-bar': { bgcolor: '#aa7053' } }} /></Box>)}{!past.length && <Typography color="text.secondary">Attendance becomes available for active or completed batches.</Typography>}</Card>
  </Box>;
}
