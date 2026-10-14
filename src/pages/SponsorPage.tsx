import { Alert, Box, Button, Card, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useState } from 'react';
import SponsorFilters from '../components/SponsorFilters';
import SponsorCharts from '../components/SponsorCharts';
import { downloadSponsorCsv, emptyFilters, filterFields, sponsorRows, summarize, type SponsorFilters as Filters } from '../data/sponsor';

export default function SponsorPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const invalidDates = Boolean(start && end && start > end);
  const rows = sponsorRows.filter(row => !invalidDates && filterFields.every(([key]) => !filters[key] || row[key] === filters[key]) && (!start || row.date >= start) && (!end || row.date <= end));
  const metrics = summarize(rows);
  const levels = ['state', 'district', 'school'] as const;
  return <Stack spacing={3}>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: "space-between", gap: 2, alignItems: { sm: 'center' } }}><Box><Typography variant="overline" color="primary">ERNET / SPONSOR OVERVIEW</Typography><Typography variant="h3">See the difference, together.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>A clear view of participation, progress, and programme reach.</Typography></Box><Button variant="outlined" disabled={!rows.length} onClick={() => downloadSponsorCsv(rows)}>Export sample CSV ↗</Button></Stack>
    <Alert severity="info">Illustrative sample data, independent of your learning profile. Filters apply to batch start dates. This demo provides no access to real participant or sponsor records.</Alert>
    <Card sx={{ p: 3 }}><Typography variant="h6" sx={{ mb: 2 }}>Explore your programme</Typography><SponsorFilters filters={filters} onChange={setFilters} start={start} end={end} onStart={setStart} onEnd={setEnd} /></Card>
    {invalidDates && <Alert severity="error">Choose an end date on or after the start date.</Alert>}
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>{[
      ['Target participants', metrics.target], ['Registered participants', metrics.registered], ['Trained participants', metrics.trained], ['Attendance rate', `${metrics.attendance}%`],
    ].map(([label, value]) => <Card key={label} sx={{ p: 2.5 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h3" sx={{ mt: 1 }}>{value}</Typography></Card>)}</Box>
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}><Chip label={`${metrics.active} active batches`} color="primary" /><Chip label={`${metrics.completed} completed batches`} /><Chip label={`${metrics.upcoming} upcoming batches`} /><Chip label={`${metrics.hours} completed training hours`} /><Chip label={`${metrics.certifications} sample certifications`} /></Stack>
    <Typography variant="caption" color="text.secondary">Attendance = attended / registered in active and completed batches. Completed hours count trained participants × 6 sample course hours.</Typography>
    {!rows.length && <Alert severity="info">No cohorts match these filters. Reset filters to explore all sample data.</Alert>}
    <SponsorCharts rows={rows} />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>{levels.map(level => <Card key={level} sx={{ p: 3 }}><Typography variant="h6" sx={{  textTransform: 'capitalize' , mb: 2 }}>{level} outcomes</Typography>{[...new Set(rows.map(row => row[level]))].map(value => { const result = summarize(rows.filter(row => row[level] === value)); return <Box key={value} sx={{ mb: 2 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{result.hours} hours · {result.certifications} certifications</Typography></Box>; })}{!rows.length && <Typography variant="body2" color="text.secondary">No matching outcomes.</Typography>}</Card>)}</Box>
    <Card sx={{ overflow: 'hidden' }}><Typography variant="h6" sx={{ p: 3 }}>School & batch overview</Typography><TableContainer><Table aria-label="Sample school and batch metrics" size="small"><TableHead><TableRow>{['School / district', 'Batch / status', 'Target', 'Registered', 'Trained', 'Hours'].map(heading => <TableCell key={heading}>{heading}</TableCell>)}</TableRow></TableHead><TableBody>{rows.map(row => <TableRow key={row.batch}><TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{row.school}</Typography><Typography variant="caption" color="text.secondary">{row.district}</Typography></TableCell><TableCell>{row.batch}<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{row.status}</Typography></TableCell><TableCell>{row.target}</TableCell><TableCell>{row.teachers}</TableCell><TableCell>{row.trained}</TableCell><TableCell>{row.hours}</TableCell></TableRow>)}</TableBody></Table></TableContainer></Card>
  </Stack>;
}
