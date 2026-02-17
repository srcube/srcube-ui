import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Steps } from '../src/react';

void React;

it('renders step titles', () => {
  render(
    <Steps
      items={[
        { title: 'A' },
        { title: 'B' },
        { title: 'C' },
      ]}
    />,
  );

  expect(screen.getByText('A')).toBeTruthy();
  expect(screen.getByText('B')).toBeTruthy();
  expect(screen.getByText('C')).toBeTruthy();
});

it('resolves current step status with finish icon', () => {
  render(
    <Steps
      current={1}
      items={[
        { title: 'Start' },
        { title: 'Middle' },
      ]}
    />,
  );

  expect(screen.getByText('✓')).toBeTruthy();
  expect(screen.getByText('2')).toBeTruthy();
});

it('supports dot mode', () => {
  render(
    <Steps
      isDot
      items={[
        { title: 'Dot A' },
        { title: 'Dot B' },
      ]}
    />,
  );

  expect(screen.getByText('Dot A')).toBeTruthy();
  expect(screen.queryByText('1')).toBeNull();
});
