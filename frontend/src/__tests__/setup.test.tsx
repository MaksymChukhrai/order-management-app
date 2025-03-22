// frontend/src/__tests__/setup.test.tsx

import { render, screen } from '@testing-library/react';

describe('Basic test setup', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('simple component rendering', () => {
    render(<div data-testid="test-div">Hello Jest</div>);
    expect(screen.getByTestId('test-div')).toBeInTheDocument();
    expect(screen.getByText('Hello Jest')).toBeInTheDocument();
  });
});