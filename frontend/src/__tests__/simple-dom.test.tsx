/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

describe('Simple DOM Test', () => {
  test('renders elements', () => {
    render(<div data-testid="test-div">Hello, Jest!</div>);
    const element = screen.getByTestId('test-div');
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Hello, Jest!');
  });
});