import { readFileSync } from 'node:fs';
import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

const testTemplate = template.replaceAll('sr-scrollbox', 'view');

let definition: Record<string, unknown> | undefined;

vi.doMock('@srcube-ui/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function renderListbox(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Listbox mini definition not captured');
  }

  const id = simulate.load({
    template: testTemplate,
    ...(definition as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('uses sibling mini scrollbox component mapping', () => {
  const json = JSON.parse(
    readFileSync('packages/ui/listbox/src/mini/index.json', 'utf8'),
  ) as {
    usingComponents?: Record<string, string>;
  };

  expect(json.usingComponents?.['sr-scrollbox']).toBe('../scrollbox/index');
});

it('binds $scrollbox host class and scrollbox className separately', () => {
  expect(template).toContain(
    'class="sr-listbox__scroll-host {{$classNames.$scrollbox}}"',
  );
  expect(template).toContain('className="{{$classNames.scrollbox}}"');
});

it('does not force h-full on scrollbox content in horizontal mini mode', () => {
  const computed = (
    definition as {
      computed?: Record<string, (data: Record<string, unknown>) => unknown>;
    }
  ).computed?.$scrollboxClassNames;

  expect(computed).toBeTypeOf('function');

  if (!computed) {
    return;
  }

  const result = computed({
    orientation: 'x',
    hasDivider: false,
    classNames: {},
  }) as {
    content?: string;
  };

  expect(result.content ?? '').not.toContain('h-full');
});

it('renders empty state when items is empty', () => {
  const comp = renderListbox({ items: [] });

  const data = comp.data as {
    renderItems: unknown[];
    innerSelectedKeys: Array<string | number>;
  };

  expect(data.renderItems.length).toBe(0);
  expect(data.innerSelectedKeys).toEqual([]);

  comp.detach();
});

it('updates selected keys on item tap in uncontrolled mode', () => {
  const comp = renderListbox({
    items: [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ],
    estimateSize: 40,
  });

  const instance = comp.instance as {
    handleItemTap: (event: {
      currentTarget: { dataset: { index: number } };
    }) => void;
  };

  instance.handleItemTap({ currentTarget: { dataset: { index: 0 } } });

  expect(comp.data.innerSelectedKeys).toEqual(['a']);

  comp.detach();
});

it('computes horizontal mode from orientation with explicit content height', () => {
  const comp = renderListbox({
    orientation: 'x',
    items: [{ id: 'a', label: 'Alpha' }],
    estimateSize: 120,
  });

  const data = comp.data as { contentStyle: string };
  expect(data.contentStyle).toContain('width:');
  expect(data.contentStyle).toContain('height:');
  expect(data.contentStyle).not.toContain('height:100%');

  comp.detach();
});

it('applies position:sticky style to active sticky item in vertical mode', () => {
  const comp = renderListbox({
    items: [
      { id: 'group-a', label: 'Group A', isSticky: true },
      { id: 'a', label: 'Alpha' },
    ],
    estimateSize: 40,
  });

  const data = comp.data as {
    renderItems: Array<{
      id: string | number;
      style: string;
      isActiveSticky: boolean;
    }>;
  };

  const stickyItem = data.renderItems.find((item) => item.id === 'group-a');
  expect(stickyItem).toBeTruthy();
  expect(stickyItem?.isActiveSticky).toBe(true);
  expect(stickyItem?.style ?? '').toContain('position:sticky');
  expect(stickyItem?.style ?? '').toContain('height:40px');

  comp.detach();
});

it('applies sticky width style in horizontal mode', () => {
  const comp = renderListbox({
    orientation: 'x',
    items: [
      { id: 'group-a', label: 'Group A', isSticky: true },
      { id: 'a', label: 'Alpha' },
    ],
    estimateSize: 120,
  });

  const data = comp.data as {
    renderItems: Array<{
      id: string | number;
      style: string;
      isActiveSticky: boolean;
    }>;
  };

  const stickyItem = data.renderItems.find((item) => item.id === 'group-a');
  expect(stickyItem).toBeTruthy();
  expect(stickyItem?.isActiveSticky).toBe(true);
  expect(stickyItem?.style ?? '').toContain('position:sticky');
  expect(stickyItem?.style ?? '').toContain('width:120px');

  comp.detach();
});

it('updates active sticky item by scroll offset when scrolling', async () => {
  const comp = renderListbox({
    items: [
      { id: 's1', label: 'Section 1', isSticky: true },
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
      { id: 's2', label: 'Section 2', isSticky: true },
      { id: 'c', label: 'Gamma' },
    ],
    estimateSize: 40,
  });

  const instance = comp.instance as {
    handleScroll: (event: {
      detail: {
        scrollTop: number;
        scrollLeft: number;
      };
    }) => void;
  };

  instance.handleScroll({
    detail: {
      scrollTop: 120,
      scrollLeft: 0,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 0));

  const data = comp.data as {
    renderItems: Array<{
      id: string | number;
      style: string;
      isActiveSticky: boolean;
    }>;
  };

  const s1 = data.renderItems.find((item) => item.id === 's1');
  const s2 = data.renderItems.find((item) => item.id === 's2');

  expect(s1?.isActiveSticky).toBe(false);
  expect(s2?.isActiveSticky).toBe(true);
  expect(s2?.style ?? '').toContain('position:sticky');

  comp.detach();
});
