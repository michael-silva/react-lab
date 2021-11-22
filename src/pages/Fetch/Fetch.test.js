import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Fetch from './Fetch';

describe('<Fetch />', () => {
  test('it should mount', () => {
    render(<Fetch />);

    const fetch = screen.getByTestId('Fetch');

    expect(fetch).toBeInTheDocument();
  });
});
