import { Box, Button, MenuItem, TextField } from '@mui/material';
import { emptyFilters, filterFields, sponsorRows, type SponsorFilters as Filters } from '../data/sponsor';

interface Props { filters: Filters; onChange: (value: Filters) => void; start: string; end: string; onStart: (value: string) => void; onEnd: (value: string) => void }
export default function SponsorFilters({ filters, onChange, start, end, onStart, onEnd }: Props) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
    {filterFields.map(([key, label]) => <TextField key={key} select label={label} value={filters[key]} onChange={e => onChange({ ...filters, [key]: e.target.value })} size="small"><MenuItem value="">All {label.toLowerCase()}s</MenuItem>{[...new Set(sponsorRows.map(row => row[key]))].map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}</TextField>)}
    <TextField type="date" label="From date" value={start} onChange={e => onStart(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} size="small" />
    <TextField type="date" label="To date" value={end} onChange={e => onEnd(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} size="small" />
    <Button onClick={() => { onChange(emptyFilters); onStart(''); onEnd(''); }} sx={{ justifySelf: 'start' }}>Reset filters</Button>
  </Box>;
}
