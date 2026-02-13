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

it('scrolls tablist when selecting edge tab in long list', () => {
  const onValueChange = vi.fn();

  render(
    <Tabs
      items={Array.from({ length: 24 }, (_, index) => ({
        value: `tab-${index + 1}`,
        label: `Tab ${index + 1}`,
      }))}
      defaultValue="tab-1"
      onValueChange={onValueChange}
    />,
  );

  const tabList = screen.getByRole('tablist');
  const scrollElement = tabList.parentElement?.parentElement as HTMLElement;
  expect(scrollElement).toBeTruthy();

  if (!scrollElement) {
    return;
  }

  Object.defineProperty(scrollElement, 'clientWidth', {
    value: 320,
    configurable: true,
  });
  Object.defineProperty(scrollElement, 'scrollLeft', {
    value: 0,
    writable: true,
    configurable: true,
  });

  const scrollTo = vi.fn(
    (next: ScrollToOptions) => {
      const left = Number(next.left ?? 0);
      Object.defineProperty(scrollElement, 'scrollLeft', {
        value: left,
        writable: true,
        configurable: true,
      });
    },
  );
  scrollElement.scrollTo = scrollTo;

  fireEvent.click(screen.getByRole('tab', { name: 'Tab 7' }));

  expect(onValueChange).toHaveBeenCalledWith('tab-7');
  expect(scrollTo).toHaveBeenCalled();
  expect(scrollTo.mock.calls.some((call) => Number(call[0]?.left ?? 0) > 0)).toBe(
    true,
  );
});
