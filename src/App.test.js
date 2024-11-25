import { render, screen } from '@testing-library/react';
import App from './App';


test('renders dice roll button', () => {
  render(<App />);
  const soloButton = screen.getByText(/single player/i);
  expect(soloButton).toBeInTheDocument();
});
