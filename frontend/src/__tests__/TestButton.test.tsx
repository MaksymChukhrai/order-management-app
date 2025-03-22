/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TestButton from '../components/TestButton';

describe('TestButton Component', () => {
  test('renders with label', () => {
    const mockOnClick = jest.fn();
    render(<TestButton onClick={mockOnClick} label="Click Me" />);
    const button = screen.getByTestId('test-button');
    expect(button).toBeTruthy();
    expect(button.textContent).toBe('Click Me');
  });

  test('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<TestButton onClick={mockOnClick} label="Click Me" />);
    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});