import { render, screen } from '@testing-library/react';
import { CalendarPage } from './CalendarPage';

describe('CalendarPage component', () => {
  it('CalendarPage renders', () => {
    render(<CalendarPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).toBeNull();
  });
});
