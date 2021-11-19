import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorBoudary from './ErrorBoudary';

describe('<ErrorBoudary />', () => {
  test('it should mount', () => {
    render(<ErrorBoudary />);

    const errorBoudary = screen.getByTestId('ErrorBoudary');

    expect(errorBoudary).toBeInTheDocument();
  });
});
