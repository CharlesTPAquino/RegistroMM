import React from 'react';
import { render } from '@testing-library/react';
import { Grid as CustomGrid } from './CustomGrid';

describe('CustomGrid', () => {
  it('renders correctly with item prop', () => {
    const { container } = render(
      <CustomGrid item xs={12}>
        <div>Test</div>
      </CustomGrid>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with container prop', () => {
    const { container } = render(
      <CustomGrid container spacing={2}>
        <CustomGrid item xs={12}>
          <div>Test</div>
        </CustomGrid>
      </CustomGrid>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
