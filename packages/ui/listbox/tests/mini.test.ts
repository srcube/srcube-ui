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
  const computed = (definition as {
    computed?: Record<string, (data: Record<string, unknown>) => unknown>;
  }).computed?.$scrollboxClassNames;

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
    handleItemTap: (event: { currentTarget: { dataset: { index: number } } }) => void;
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
