import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DynamicComponent from './DynamicComponent';

describe('<DynamicComponent />', () => {
  test('it should mount', () => {
    render(<DynamicComponent />);

    const dynamicComponent = screen.getByTestId('DynamicComponent');

    expect(dynamicComponent).toBeInTheDocument();
  });
});
