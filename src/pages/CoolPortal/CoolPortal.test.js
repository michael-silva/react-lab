import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CoolPortal from './CoolPortal';

describe('<CoolPortal />', () => {
  test('it should mount', () => {
    render(<CoolPortal />);

    const coolPortal = screen.getByTestId('CoolPortal');

    expect(coolPortal).toBeInTheDocument();
  });
});
