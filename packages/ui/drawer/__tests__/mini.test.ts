import { readFileSync } from 'node:fs';
import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

const testTemplate = template.replaceAll('sr-popup', 'view');

let definition: Record<string, unknown> | undefined;

vi.doMock('@srcube-ui/runtime/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function renderDrawer(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Drawer mini definition not captured');
  }

  const id = simulate.load({
    template: testTemplate,
    ...(definition as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('uses sibling mini modal component mapping', () => {
  const json = JSON.parse(
    readFileSync('packages/ui/drawer/src/mini/index.json', 'utf8'),
  ) as {
    usingComponents?: Record<string, string>;
  };

  expect(json.usingComponents?.['sr-popup']).toBe('../popup/index');
});

it('binds $modal host class and className separately', () => {
  expect(template).toContain('class="sr-drawer__modal {{$classNames.$modal}}"');
  expect(template).toContain('className="{{className}}"');
});

it('respects defaultOpen in uncontrolled mode', async () => {
  const comp = renderDrawer({ defaultOpen: true });

  await Promise.resolve();

  expect(comp.data._innerOpen).toBe(true);
  comp.detach();
});

it('updates inner open state via openchange when uncontrolled', () => {
  const comp = renderDrawer({ defaultOpen: true });

  const instance = comp.instance as {
    handleOpenChange: (event: { detail: { isOpen: boolean } }) => void;
  };

  instance.handleOpenChange({ detail: { isOpen: false } });

  expect(comp.data._innerOpen).toBe(false);
  comp.detach();
});
