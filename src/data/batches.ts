export interface TrainingBatch { code: string; name: string; school: string; state: string; trainer: string; date: string }
export const trainingBatches: TrainingBatch[] = [
  { code: 'AD-DEL-01', name: 'Classroom foundations · Delhi', school: 'Demo Public School', state: 'Delhi', trainer: 'Demo trainer A', date: '20 November 2026' },
  { code: 'AD-HAR-02', name: 'Digital teaching · Haryana', school: 'Demo Learning School', state: 'Haryana', trainer: 'Demo trainer B', date: '25 November 2026' },
];
export const findBatch = (code: string) => trainingBatches.find((batch) => batch.code === code.trim().toUpperCase());
export function batchFromHash(hash: string) { return findBatch(new URLSearchParams(hash.split('?')[1] ?? '').get('batch') ?? ''); }
