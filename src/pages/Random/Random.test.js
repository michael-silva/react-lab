import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Random from './Random';

describe('<Random />', () => {
  test('it should mount', () => {
    render(<Random />);

    const random = screen.getByTestId('Random');

    expect(random).toBeInTheDocument();
  });
});
