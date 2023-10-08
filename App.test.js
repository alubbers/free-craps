import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders dice roll button', () => {
  render(<App />);
  const diceButton = screen.getByText(/roll dice/i);
  expect(diceButton).toBeInTheDocument();
});
