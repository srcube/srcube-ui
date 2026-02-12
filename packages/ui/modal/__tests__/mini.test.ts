import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

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

function renderModal(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Modal mini definition not captured');
  }

  const { relations: _relations, ...rest } = definition;
  void _relations;

  const id = simulate.load({
    template,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('respects defaultOpen when uncontrolled', async () => {
  const comp = renderModal({ defaultOpen: true });

  await Promise.resolve();

  expect(comp.data.isVisible).toBe(true);
  comp.detach();
});

it('applies classNames overrides', async () => {
  const comp = renderModal({
    defaultOpen: true,
    classNames: {
      content: 'custom-content',
    },
  });

  await Promise.resolve();

  expect(comp.data.$classNames.content).toContain('custom-content');
  comp.detach();
});
