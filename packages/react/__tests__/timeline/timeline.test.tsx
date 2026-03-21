import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Timeline } from '../../src/components/timeline';

void React;

it('renders title and time', () => {
  render(
    <Timeline
      items={[
        { title: 'Kickoff', time: '09:30' },
        { title: 'Deliver' },
      ]}
    />,
  );

  expect(screen.getByText('Kickoff')).toBeTruthy();
  expect(screen.getByText('09:30')).toBeTruthy();
  expect(screen.getByText('Deliver')).toBeTruthy();
});

it('renders custom icon', () => {
  render(
    <Timeline
      items={[
        { title: 'Node', icon: '✓' },
      ]}
    />,
  );

  expect(screen.getByText('✓')).toBeTruthy();
});

it('renders pending item title', () => {
  render(
    <Timeline
      items={[
        { title: 'Pending', isPending: true },
      ]}
    />,
  );

  expect(screen.getByText('Pending')).toBeTruthy();
});

it('applies dark tone classes', () => {
  render(
    <Timeline
      tone="dark"
      items={[{ title: 'Dark Step', color: 'primary' }]}
    />,
  );

  expect(screen.getByText('Dark Step').className).toContain('text-primary-100');
});
