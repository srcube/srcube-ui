import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

let definition: Record<string, unknown> | undefined;

type ScrollboxMetrics = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

type ScrollboxInstance = {
  updateMasks: (metrics: ScrollboxMetrics) => void;
};

vi.doMock('@srcube-ui/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function renderScrollbox(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Scrollbox mini definition not captured');
  }

  const id = simulate.load({
    template,
    ...(definition as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('updates mask state from metrics', () => {
  const comp = renderScrollbox();
  const instance = comp.instance as unknown as ScrollboxInstance;

  instance.updateMasks({
    scrollTop: 10,
    scrollLeft: 0,
    scrollHeight: 200,
    scrollWidth: 100,
    clientHeight: 100,
    clientWidth: 100,
  });

  expect(comp.data.showMaskTop).toBe(true);
  expect(comp.data.showMaskBottom).toBe(true);

  comp.detach();
});

it('respects hideMasks', () => {
  const comp = renderScrollbox({ hideMasks: true });
  const instance = comp.instance as unknown as ScrollboxInstance;

  instance.updateMasks({
    scrollTop: 10,
    scrollLeft: 0,
    scrollHeight: 200,
    scrollWidth: 100,
    clientHeight: 100,
    clientWidth: 100,
  });

  expect(comp.data.showMaskTop).toBe(false);
  expect(comp.data.showMaskBottom).toBe(false);

  comp.detach();
});
