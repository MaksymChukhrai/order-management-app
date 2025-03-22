import React from 'react';

interface TestButtonProps {
  onClick: () => void;
  label: string;
}

const TestButton: React.FC<TestButtonProps> = ({ onClick, label }) => {
  return (
    <button onClick={onClick} data-testid="test-button">
      {label}
    </button>
  );
};

export default TestButton;