import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Lifecycle from './Lifecycle';

describe('<Lifecycle />', () => {
  test('it should mount', () => {
    render(<Lifecycle />);

    const lifecycle = screen.getByTestId('Lifecycle');

    expect(lifecycle).toBeInTheDocument();
  });
});
