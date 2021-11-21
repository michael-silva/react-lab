import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Forms from './Forms';

describe('<Forms />', () => {
  test('it should mount', () => {
    render(<Forms />);

    const forms = screen.getByTestId('Forms');

    expect(forms).toBeInTheDocument();
  });
});
