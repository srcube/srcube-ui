import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Component } from '../src/react/component';

test('renders children with className', () => {
  render(
    <Component className="demo-class">
      <span>Template Content</span>
    </Component>,
  );

  const content = screen.getByText('Template Content');
  const root = content.parentElement;
  expect(root?.className ?? '').toContain('demo-class');
});
