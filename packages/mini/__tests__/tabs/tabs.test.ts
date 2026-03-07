import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/tabs/index.wxml?raw';
import { tabsMiniProps } from '../../src/components/tabs/props';

let definition: Record<string, unknown> | undefined;

vi.doMock('miniprogram-computed', () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../../src/components/tabs/index');
});

function renderTabs(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Tabs mini definition not captured');
  }

  const normalizedTemplate = template
    .replaceAll('<sr-scrollbox', '<view')
    .replaceAll('</sr-scrollbox>', '</view>');

  const id = simulate.load({
    template: normalizedTemplate,
    ...(definition as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('selects first enabled tab by default in uncontrolled mode', () => {
  const comp = renderTabs({
    items: [
      { value: 'a', label: 'A', isDisabled: true },
      { value: 'b', label: 'B' },
    ],
  });

  expect(comp.data._innerValue).toBe('b');
  comp.detach();
});

it('renders scrollbox host in mini template', () => {
  expect(template).toContain('sr-tabs__scroll-host');
  expect(template).toContain('<sr-scrollbox');
  expect(template).toContain('bind:scroll="handleScroll"');
});

it('uses default variant and placement in mini props', () => {
  expect(tabsMiniProps.variant.value).toBe('default');
  expect(tabsMiniProps.placement.value).toBe(null);
});

it('supports flat variant with twotone-like fill and no border', () => {
  const computed = (
    definition as {
      computed?: {
        $classNames?: (data: Record<string, unknown>) => {
          indicator?: string;
        };
      };
    }
  )?.computed;
  const classNames = computed?.$classNames?.({
    orientation: 'x',
    placement: null,
    color: 'primary',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    className: '',
    classNames: {},
  });

  expect(classNames?.indicator).toContain('bg-primary/10');
  expect(classNames?.indicator).toContain('border-0');
  expect(classNames?.indicator.includes('border-primary')).toBe(false);
});

it('updates uncontrolled value and emits change on tap', async () => {
  const comp = renderTabs({
    items: [
      { value: 'overview', label: 'Overview' },
      { value: 'records', label: 'Records' },
    ],
    defaultValue: 'overview',
  });

  const triggerSpy = vi.fn();
  const instance = comp.instance as {
    triggerEvent: (name: string, detail: Record<string, unknown>) => void;
    handleTabTap: (event: {
      currentTarget: {
        dataset: {
          index: number;
        };
      };
    }) => void;
  };
  instance.triggerEvent = triggerSpy;

  instance.handleTabTap({
    currentTarget: {
      dataset: {
        index: 1,
      },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(comp.data._innerValue).toBe('records');
  expect(triggerSpy).toHaveBeenCalledWith('change', { value: 'records' });

  comp.detach();
});

it('toggles tap-switching state for indicator animation', async () => {
  const comp = renderTabs({
    items: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ],
    defaultValue: 'a',
  });

  const instance = comp.instance as {
    triggerTapSwitch: () => void;
  };
  instance.triggerTapSwitch();

  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(comp.data._isTapSwitching).toBe(true);

  await new Promise((resolve) => setTimeout(resolve, 130));
  expect(comp.data._isTapSwitching).toBe(false);

  comp.detach();
});

it('renders virtual tabs subset for long list', async () => {
  const comp = renderTabs({
    items: Array.from({ length: 40 }, (_, index) => ({
      value: `tab-${index + 1}`,
      label: `Tab ${index + 1}`,
    })),
    overscan: 1,
    estimateSize: 80,
  });

  const instance = comp.instance as {
    recomputeVirtualTabs: () => void;
  };

  comp.setData({
    viewportMainSize: 240,
    viewportCrossSize: 32,
  });
  instance.recomputeVirtualTabs();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(comp.data.renderTabs.length).toBeLessThan(40);

  comp.detach();
});
