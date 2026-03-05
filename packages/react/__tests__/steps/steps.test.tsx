import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Steps } from '../../src/components/steps';

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
  const { container } = render(
    <Steps
      current={1}
      items={[
        { title: 'Start' },
        { title: 'Middle' },
      ]}
    />,
  );

  expect(container.querySelector('.icon-steps-success')).toBeTruthy();
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

it('supports color and variant', () => {
  const { container } = render(
    <Steps
      current={0}
      color="warning"
      variant="outline"
      items={[
        { title: 'Warn A' },
        { title: 'Warn B' },
      ]}
    />,
  );

  const indicator = container.querySelector('.border-warning');
  expect(indicator?.className).toContain('border-warning');
});

it('supports twotone variant', () => {
  const { container } = render(
    <Steps
      current={0}
      color="success"
      variant="twotone"
      items={[
        { title: 'Tone A' },
        { title: 'Tone B' },
      ]}
    />,
  );

  const indicator = container.querySelector('.bg-success-100');
  expect(indicator?.className).toContain('bg-success-100');
});

it('supports orientation y', () => {
  render(
    <Steps
      orientation="y"
      items={[
        { title: 'Vertical A' },
        { title: 'Vertical B' },
      ]}
    />,
  );

  const list = screen.getByText('Vertical A').closest('ol');
  expect(list?.className).toContain('flex-col');
});
