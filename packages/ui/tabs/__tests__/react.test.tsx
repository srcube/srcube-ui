import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TabPanel } from '../src/react/tab-panel';
import { Tabs } from '../src/react/tabs';

it('emits value change when selecting another tab', () => {
  const onValueChange = vi.fn();

  render(
    <Tabs
      items={[
        { value: 'overview', label: 'Overview' },
        { value: 'records', label: 'Records' },
      ]}
      defaultValue="overview"
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getByRole('tab', { name: 'Records' }));

  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith('records');
});

it('renders active panel under tabs context', () => {
  render(
    <Tabs
      items={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]}
      value="a"
    >
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
    </Tabs>,
  );

  expect(screen.getByText('Panel A')).toBeTruthy();
  expect(screen.queryByText('Panel B')).toBeNull();
});

it('keeps panel mounted when keepMounted is true', () => {
  render(
    <TabPanel value="b" activeValue="a" keepMounted>
      Panel B
    </TabPanel>,
  );

  const panel = screen.getByText('Panel B').closest('[data-slot="tab-panel"]');
  expect(panel).toBeTruthy();
  expect(panel?.hasAttribute('hidden')).toBe(true);
});
