import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/pickbox/index.wxml?raw';

let definition: Record<string, unknown> | undefined;

vi.doMock('miniprogram-computed', () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../../src/components/pickbox/index');
});

function renderPickbox(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Pickbox mini definition not captured');
  }

  const id = simulate.load({
    template,
    ...(definition as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

function tick() {
  return Promise.resolve();
}

it('renders indicator and binds scroll/touch handlers in template', () => {
  expect(template).toContain('sr-pickbox__indicator');
  expect(template).toContain('bindscroll="handleColumnScroll"');
  expect(template).toContain('enhanced="{{true}}"');
  expect(template).toContain('show-scrollbar="{{false}}"');
  expect(template).toContain('binddragstart="handleColumnDragStart"');
  expect(template).toContain('binddragend="handleColumnDragEnd"');
  expect(template).toContain('bindtouchstart="handleColumnTouchStart"');
  expect(template).toContain('bindtouchmove="handleColumnTouchMove"');
  expect(template).toContain('bindtouchend="handleColumnTouchEnd"');
  expect(template).toContain('bindtouchcancel="handleColumnTouchCancel"');
  expect(template).not.toContain('bindtap="handleItemTap"');
});

it('initializes uncontrolled value with first enabled item', async () => {
  const comp = renderPickbox({
    columns: [
      {
        id: 'year',
        items: [
          { id: 'a', label: 'A', isDisabled: true },
          { id: 'b', label: 'B' },
        ],
      },
      {
        id: 'month',
        items: [{ id: 1, label: '1' }],
      },
    ],
  });

  await tick();

  const data = comp.data as { innerValue: Array<string | number | null> };
  expect(data.innerValue).toEqual(['b', 1]);

  comp.detach();
});

it('snaps to nearest enabled item after scroll end', async () => {
  vi.useFakeTimers();

  const comp = renderPickbox({
    columns: [
      {
        id: 'day',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
      },
    ],
    scrollEndDelay: 100,
  });

  const instance = comp.instance as {
    recomputeVirtualColumns: () => void;
    handleColumnScroll: (
      event: WechatMiniprogram.CustomEvent<{
        scrollTop: number;
      }>,
    ) => void;
  };

  comp.setData({
    containerHeight: 220,
    resolvedPadding: 88,
  });
  instance.recomputeVirtualColumns();

  vi.runOnlyPendingTimers();

  instance.handleColumnScroll({
    currentTarget: {
      dataset: {
        columnIndex: 0,
      },
    },
    detail: {
      scrollTop: 40,
    },
  } as WechatMiniprogram.CustomEvent<{ scrollTop: number }>);

  vi.advanceTimersByTime(100);
  await tick();

  const data = comp.data as { innerValue: Array<string | number | null> };
  expect(data.innerValue).toEqual(['b']);

  comp.detach();
  vi.useRealTimers();
});

it('keeps selected text style during auto align animation', async () => {
  const comp = renderPickbox({
    columns: [
      {
        id: 'month',
        items: [
          { id: 1, label: '1 月' },
          { id: 2, label: '2 月' },
        ],
      },
    ],
    indicatorHeight: 44,
  });

  const instance = comp.instance as {
    selectColumnItem: (
      columnIndex: number,
      itemId: string | number,
      behavior: 'auto' | 'smooth',
    ) => void;
  };

  instance.selectColumnItem(0, 2, 'smooth');
  await tick();

  const data = comp.data as {
    renderColumns: Array<{
      items: Array<{
        id: string | number;
        className: string;
      }>;
    }>;
  };

  const selectedItem = data.renderColumns[0]?.items.find((item) => item.id === 2);
  expect(selectedItem?.className).toContain('font-semibold');

  comp.detach();
});

it('cancels pending auto align on touchstart for short swipe', async () => {
  const comp = renderPickbox({
    columns: [
      {
        id: 'day',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
      },
    ],
    indicatorHeight: 44,
  });

  const instance = comp.instance as {
    recomputeVirtualColumns: () => void;
    selectColumnItem: (
      columnIndex: number,
      itemId: string | number,
      behavior: 'auto' | 'smooth',
    ) => void;
    handleColumnTouchStart: (event: WechatMiniprogram.TouchEvent) => void;
    handleColumnScroll: (
      event: WechatMiniprogram.CustomEvent<{
        scrollTop: number;
      }>,
    ) => void;
  };

  comp.setData({
    containerHeight: 220,
    resolvedPadding: 88,
  });
  instance.recomputeVirtualColumns();

  instance.selectColumnItem(0, 'b', 'smooth');
  await tick();

  instance.handleColumnTouchStart({
    currentTarget: {
      dataset: {
        columnIndex: 0,
      },
    },
  } as WechatMiniprogram.TouchEvent);
  instance.handleColumnScroll({
    currentTarget: {
      dataset: {
        columnIndex: 0,
      },
    },
    detail: {
      scrollTop: 160,
    },
  } as WechatMiniprogram.CustomEvent<{ scrollTop: number }>);
  await tick();

  const data = comp.data as {
    renderColumns: Array<{
      scrollTop: number;
    }>;
  };
  expect(data.renderColumns[0]?.scrollTop).toBe(160);

  comp.detach();
});

it('resolves default metric by size variant', async () => {
  const comp = renderPickbox({
    size: 'sm',
    columns: [
      {
        id: 'year',
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
      },
    ],
  });

  const instance = comp.instance as {
    recomputeVirtualColumns: () => void;
  };
  instance.recomputeVirtualColumns();
  await tick();

  const data = comp.data as {
    resolvedEstimateSize: number;
    resolvedIndicatorHeight: number;
  };
  expect(data.resolvedEstimateSize).toBe(36);
  expect(data.resolvedIndicatorHeight).toBe(36);

  comp.detach();
});
