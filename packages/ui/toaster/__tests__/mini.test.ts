import { expect, it, vi, beforeAll } from 'vitest';
// @ts-expect-error -- raw wxml import for template assertions
import template from '../src/mini/index.wxml?raw';
import { toasterMiniProps } from '../src/mini/props';

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

// ---------------------------------------------------------------------------
// Template structure assertions
// ---------------------------------------------------------------------------

it('contains toast loop with wx:for on $renderToasts', () => {
  expect(template).toContain('wx:for="{{$renderToasts}}"');
});

it('uses id as wx:key', () => {
  expect(template).toContain('wx:key="id"');
});

it('uses item as wx:for-item', () => {
  expect(template).toContain('wx:for-item="item"');
});

it('conditionally shows container via wx:if on length', () => {
  expect(template).toContain('wx:if="{{$renderToasts.length > 0}}"');
});

it('binds style attribute on root', () => {
  expect(template).toContain('style="{{style}}"');
});

it('binds $classNames.base on root element', () => {
  expect(template).toContain('{{$classNames.base}}');
});

it('binds $classNames.stack on stack element', () => {
  expect(template).toContain('{{$classNames.stack}}');
});

it('binds item.classes.toast on toast element', () => {
  expect(template).toContain('{{item.classes.toast}}');
});

it('binds item.classes.layer on layer element', () => {
  expect(template).toContain('{{item.classes.layer}}');
});

it('binds layer style on item element', () => {
  expect(template).toContain('style="{{item.layerStyle}}"');
});

it('binds item.classes.icon on icon element', () => {
  expect(template).toContain('{{item.classes.icon}}');
});

it('conditionally shows custom icon via wx:if', () => {
  expect(template).toContain('wx:if="{{item.icon}}"');
});

it('shows default icon via wx:else', () => {
  expect(template).toContain('wx:else');
  expect(template).toContain('{{item.classes._iIcon}}');
});

it('conditionally shows title via wx:if', () => {
  expect(template).toContain('wx:if="{{item.title}}"');
});

it('conditionally shows description via wx:if', () => {
  expect(template).toContain('wx:if="{{item.description}}"');
});

it('conditionally shows close button via wx:if on isClosable', () => {
  expect(template).toContain('wx:if="{{item.isClosable}}"');
});

it('has BEM class structure', () => {
  expect(template).toContain('sr-toaster');
  expect(template).toContain('sr-toaster__stack');
  expect(template).toContain('sr-toaster__item');
  expect(template).toContain('sr-toaster__card');
  expect(template).toContain('sr-toaster__icon');
  expect(template).toContain('sr-toaster__text-wrap');
  expect(template).toContain('sr-toaster__title');
  expect(template).toContain('sr-toaster__description');
  expect(template).toContain('sr-toaster__close');
});

// ---------------------------------------------------------------------------
// Event handler bindings
// ---------------------------------------------------------------------------

it('contains close handler binding with bindtap', () => {
  expect(template).toContain('bindtap="handleCloseTap"');
});

it('passes item id via data-id for close handler', () => {
  expect(template).toContain('data-id="{{item.id}}"');
});

// ---------------------------------------------------------------------------
// Props defaults
// ---------------------------------------------------------------------------

it('defaults max to 1', () => {
  expect(toasterMiniProps.max.value).toBe(1);
});

it('defaults className to empty string', () => {
  expect(toasterMiniProps.className.value).toBe('');
});

it('defaults classNames to empty object', () => {
  expect(toasterMiniProps.classNames.value).toEqual({});
});

it('defaults style to empty string', () => {
  expect(toasterMiniProps.style.value).toBe('');
});

it('has correct property types', () => {
  expect(toasterMiniProps.max.type).toBe(Number);
  expect(toasterMiniProps.className.type).toBe(String);
  expect(toasterMiniProps.classNames.type).toBe(Object);
  expect(toasterMiniProps.style.type).toBe(String);
});

// ---------------------------------------------------------------------------
// Component definition structure
// ---------------------------------------------------------------------------

it('captures UIComponent definition', () => {
  expect(definition).toBeTruthy();
});

it('has multipleSlots option', () => {
  const options = (definition as any)?.options;
  expect(options?.multipleSlots).toBe(true);
});

it('has apply-shared styleIsolation', () => {
  const options = (definition as any)?.options;
  expect(options?.styleIsolation).toBe('apply-shared');
});

it('has lifetimes with attached and detached', () => {
  const lifetimes = (definition as any)?.lifetimes;
  expect(typeof lifetimes?.attached).toBe('function');
  expect(typeof lifetimes?.detached).toBe('function');
});

it('has handleCloseTap method', () => {
  const methods = (definition as any)?.methods;
  expect(typeof methods?.handleCloseTap).toBe('function');
});

it('has $classNames computed', () => {
  const computed = (definition as any)?.computed;
  expect(typeof computed?.$classNames).toBe('function');
});

it('has $renderToasts computed', () => {
  const computed = (definition as any)?.computed;
  expect(typeof computed?.$renderToasts).toBe('function');
});

it('initializes _toasts as empty array', () => {
  const data = (definition as any)?.data;
  expect(data?._toasts).toEqual([]);
});

// ---------------------------------------------------------------------------
// Computed value structure
// ---------------------------------------------------------------------------

it('$classNames returns base and stack classes', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$classNames({
    className: '',
    classNames: {},
  });

  expect(result).toHaveProperty('base');
  expect(result).toHaveProperty('stack');
  expect(typeof result.base).toBe('string');
  expect(typeof result.stack).toBe('string');
});

it('$classNames applies custom className', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$classNames({
    className: 'my-custom-class',
    classNames: {},
  });

  expect(result.base).toContain('my-custom-class');
});

it('$renderToasts returns items with classes object', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$renderToasts({
    classNames: {},
    max: 5,
    _toasts: [
      {
        id: 'test-1',
        title: 'Test',
        description: '',
        tone: 'dark',
        icon: '',
        duration: 1800,
        shouldAutoDismiss: true,
        isClosable: false,
        state: 'enter',
        createdAt: Date.now(),
      },
    ],
  });

  expect(result).toHaveLength(1);
  expect(result[0].classes).toBeTruthy();
  expect(result[0].classes).toHaveProperty('layer');
  expect(result[0].classes).toHaveProperty('toast');
  expect(result[0].classes).toHaveProperty('icon');
  expect(result[0].classes).toHaveProperty('_iIcon');
  expect(result[0].classes).toHaveProperty('textWrap');
  expect(result[0].classes).toHaveProperty('title');
  expect(result[0].classes).toHaveProperty('description');
  expect(result[0].classes).toHaveProperty('closeButton');
  expect(result[0].classes).toHaveProperty('_iClose');
  expect(result[0].classes.icon).toContain('text-3xl');
  expect(result[0].classes.closeButton).toContain('h-10');
  expect(result[0].classes.closeButton).toContain('w-10');
  expect(result[0].layerStyle).toContain('z-index: 1');
});

it('$renderToasts respects max prop', () => {
  const computed = (definition as any)?.computed;
  const toasts = [
    { id: '1', title: 'A', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, isClosable: false, state: 'enter', createdAt: 1 },
    { id: '2', title: 'B', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, isClosable: false, state: 'enter', createdAt: 2 },
    { id: '3', title: 'C', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, isClosable: false, state: 'enter', createdAt: 3 },
  ];

  const result = computed?.$renderToasts({
    classNames: {},
    max: 2,
    _toasts: toasts,
  });

  expect(result).toHaveLength(2);
  expect(result[0].title).toBe('B');
  expect(result[1].title).toBe('C');
  expect(result[0].layerStyle).toContain('z-index: 1');
  expect(result[1].layerStyle).toContain('z-index: 2');
});

it('$renderToasts shows all when max is invalid', () => {
  const computed = (definition as any)?.computed;
  const toasts = [
    { id: '1', title: 'A', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, isClosable: false, state: 'enter', createdAt: 1 },
    { id: '2', title: 'B', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, isClosable: false, state: 'enter', createdAt: 2 },
  ];

  const result = computed?.$renderToasts({
    classNames: {},
    max: -1,
    _toasts: toasts,
  });

  expect(result).toHaveLength(2);
});
