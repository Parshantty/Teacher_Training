import { cohorts } from './training';
export const sponsorRows = cohorts.map((cohort, index) => ({
  ...cohort, project: 'Adding Dimension Teacher Training',
  plan: index % 2 ? 'Digital classroom' : 'Teaching foundations',
  state: cohort.district === 'Delhi' ? 'Delhi' : cohort.district === 'Jaipur' ? 'Rajasthan' : 'Uttar Pradesh',
  batch: `ADT-${String(index + 1).padStart(3, '0')}`,
  date: ['2026-09-14', '2026-09-28', '2026-10-05', '2026-10-20', '2026-10-26'][index],
  participantType: index === 1 || index === 4 ? 'School leader' : 'Teacher',
  status: index < 2 ? 'Completed' : index === 2 ? 'Active' : 'Upcoming',
  target: cohort.teachers + 8,
  trained: index < 3 ? cohort.completed : 0,
  attended: index < 3 ? cohort.active : 0,
  hours: index < 3 ? cohort.completed * 6 : 0,
  certifications: index < 3 ? Math.max(0, cohort.completed - 2) : 0,
}));
export type SponsorRow = typeof sponsorRows[number];
export const filterFields = [
  ['project', 'Project'], ['plan', 'Training plan'], ['state', 'State'], ['district', 'District'],
  ['school', 'School'], ['batch', 'Batch'], ['participantType', 'Participant type'],
] as const;
export type FilterKey = typeof filterFields[number][0];
export type SponsorFilters = Record<FilterKey, string>;
export const emptyFilters: SponsorFilters = { project: '', plan: '', state: '', district: '', school: '', batch: '', participantType: '' };
export function summarize(rows: SponsorRow[]) {
  const sum = (key: 'target' | 'teachers' | 'trained' | 'attended' | 'hours' | 'certifications') => rows.reduce((total, row) => total + row[key], 0);
  const eligible = rows.filter(row => row.status !== 'Upcoming').reduce((total, row) => total + row.teachers, 0);
  return { target: sum('target'), registered: sum('teachers'), trained: sum('trained'), hours: sum('hours'), certifications: sum('certifications'), attendance: eligible ? Math.round(sum('attended') / eligible * 100) : 0, active: rows.filter(row => row.status === 'Active').length, completed: rows.filter(row => row.status === 'Completed').length, upcoming: rows.filter(row => row.status === 'Upcoming').length };
}
export function downloadSponsorCsv(rows: SponsorRow[]) {
  const columns = ['Project', 'Training plan', 'State', 'District', 'School', 'Batch', 'Date', 'Participant type', 'Status', 'Target participants', 'Registered', 'Trained', 'Attended', 'Completed hours', 'Certifications'];
  const values = rows.map(row => [row.project, row.plan, row.state, row.district, row.school, row.batch, row.date, row.participantType, row.status, row.target, row.teachers, row.trained, row.attended, row.hours, row.certifications]);
  const encode = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = [columns, ...values].map(row => row.map(encode).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = 'adding-dimension-sample-cohorts.csv'; link.click(); URL.revokeObjectURL(url);
}
