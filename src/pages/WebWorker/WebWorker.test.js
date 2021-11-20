import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WebWorker from './WebWorker';

describe('<WebWorker />', () => {
  test('it should mount', () => {
    render(<WebWorker />);

    const webWorker = screen.getByTestId('WebWorker');

    expect(webWorker).toBeInTheDocument();
  });
});
