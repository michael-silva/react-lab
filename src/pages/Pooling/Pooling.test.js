import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pooling from './Pooling';

describe('<Pooling />', () => {
  test('it should mount', () => {
    render(<Pooling />);

    const pooling = screen.getByTestId('Pooling');

    expect(pooling).toBeInTheDocument();
  });
});
