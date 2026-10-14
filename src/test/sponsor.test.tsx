import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SponsorPage from '../pages/SponsorPage';

const expectMetric = (label: string, value: string) => {
  expect(screen.getByText(label).parentElement).toHaveTextContent(value);
};

describe('sample sponsor analytics', () => {
  it('recomputes metrics and table rows when a district is selected and resets all filters', async () => {
    const user = userEvent.setup();
    render(<SponsorPage />);
    expectMetric('Target participants', '200');
    expectMetric('Registered participants', '160');
    await user.click(screen.getByRole('combobox', { name: 'District' }));
    await user.click(screen.getByRole('option', { name: 'Delhi' }));
    expectMetric('Target participants', '86');
    expectMetric('Registered participants', '70');
    expectMetric('Trained participants', '30');
    expectMetric('Attendance rate', '83%');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).queryByText('Oakwood School')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    expectMetric('Target participants', '200');
    expect(within(table).getAllByRole('row')).toHaveLength(6);
  });

  it('handles a no-match date range without misleading metrics or a downloadable report', async () => {
    const user = userEvent.setup();
    render(<SponsorPage />);
    await user.type(screen.getByLabelText('From date'), '2027-01-01');
    expect(screen.getByText(/No cohorts match these filters/)).toBeVisible();
    expectMetric('Target participants', '0');
    expectMetric('Attendance rate', '0%');
    expect(screen.getByRole('button', { name: /Export sample CSV/ })).toBeDisabled();
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(1);
  });

  it('validates reversed dates and filters participant type with all outcomes recomputed', async () => {
    const user = userEvent.setup();
    render(<SponsorPage />);
    await user.click(screen.getByRole('combobox', { name: 'Participant type' }));
    await user.click(screen.getByRole('option', { name: 'School leader' }));
    expectMetric('Registered participants', '59');
    expectMetric('Trained participants', '12');
    await user.type(screen.getByLabelText('From date'), '2026-10-26');
    await user.type(screen.getByLabelText('To date'), '2026-09-01');
    expect(screen.getByText('Choose an end date on or after the start date.')).toBeVisible();
    expectMetric('Registered participants', '0');
  });
});
