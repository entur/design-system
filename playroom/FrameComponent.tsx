import React from 'react';
import { TestBench } from '../src/components/TestBench';

const FrameComponent = ({ children }) => {
  return (
    <div style={{ margin: '2rem' }}>
      <TestBench />
      {children}
    </div>
  );
};

export default FrameComponent;
