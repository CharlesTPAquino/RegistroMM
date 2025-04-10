import React from 'react';
import { render } from '@testing-library/react';
import EmployeeTab from './EmployeeTab';

describe('EmployeeTab', () => {
  it('renders without crashing', () => {
    render(<EmployeeTab />);
  });
});
