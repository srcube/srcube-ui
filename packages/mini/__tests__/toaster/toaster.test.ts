import { expect, it, vi, beforeAll } from 'vitest';
// @ts-expect-error -- raw wxml import for template assertions
import template from '../../src/components/toaster/index.wxml?raw';
import { toasterMiniProps } from '../../src/components/toaster/props';

let definition: Record<string, unknown> | undefined;

vi.doMock('miniprogram-computed', () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../../src/components/toaster/index');
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

it('conditionally shows close layer via wx:if on $activeClose', () => {
  expect(template).toContain('wx:if="{{$activeClose}}"');
});

it('binds $classNames.closeLayer on close layer element', () => {
  expect(template).toContain('{{$classNames.closeLayer}}');
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
  expect(template).toContain('sr-toaster__close-layer');
  expect(template).toContain('sr-toaster__close');
});

// ---------------------------------------------------------------------------
// Event handler bindings
// ---------------------------------------------------------------------------

it('contains close handler binding with bindtap', () => {
  expect(template).toContain('bindtap="handleCloseTap"');
});

it('passes close id via $activeClose.id for close handler', () => {
  expect(template).toContain('data-id="{{$activeClose.id}}"');
});

// ---------------------------------------------------------------------------
// Props defaults
// ---------------------------------------------------------------------------

it('does not expose max prop', () => {
  expect('max' in toasterMiniProps).toBe(false);
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

it('has $activeClose computed', () => {
  const computed = (definition as any)?.computed;
  expect(typeof computed?.$activeClose).toBe('function');
});

it('initializes _toasts as empty array', () => {
  const data = (definition as any)?.data;
  expect(data?._toasts).toEqual([]);
});

// ---------------------------------------------------------------------------
// Computed value structure
// ---------------------------------------------------------------------------

it('$classNames returns base, stack and closeLayer classes', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$classNames({
    className: '',
    classNames: {},
  });

  expect(result).toHaveProperty('base');
  expect(result).toHaveProperty('stack');
  expect(result).toHaveProperty('closeLayer');
  expect(typeof result.base).toBe('string');
  expect(typeof result.stack).toBe('string');
  expect(typeof result.closeLayer).toBe('string');
  expect(result.closeLayer).toContain('pointer-events-none');
  expect(result.closeLayer).toContain('z-10');
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
    _toasts: [
      {
        id: 'test-1',
        title: 'Test',
        description: '',
        tone: 'dark',
        icon: '',
        duration: 1800,
        shouldAutoDismiss: true,
        showClose: false,
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
  expect(result[0].classes.icon).toContain('text-3xl');
  expect(result[0].layerStyle).toContain('translateY(0px)');
  expect(result[0].layerStyle).toContain('z-index: 1');
});

it('$renderToasts keeps only latest 3 layers', () => {
  const computed = (definition as any)?.computed;
  const toasts = [
    { id: '1', title: 'A', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, showClose: false, state: 'enter', createdAt: 1 },
    { id: '2', title: 'B', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, showClose: false, state: 'enter', createdAt: 2 },
    { id: '3', title: 'C', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, showClose: false, state: 'enter', createdAt: 3 },
    { id: '4', title: 'D', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: true, showClose: false, state: 'enter', createdAt: 4 },
  ];

  const result = computed?.$renderToasts({
    classNames: {},
    _toasts: toasts,
  });

  expect(result).toHaveLength(3);
  expect(result[0].title).toBe('B');
  expect(result[1].title).toBe('C');
  expect(result[2].title).toBe('D');
  expect(result[0].layerStyle).toContain('translateY(20px)');
  expect(result[1].layerStyle).toContain('translateY(10px)');
  expect(result[2].layerStyle).toContain('translateY(0px)');
  expect(result[0].layerStyle).toContain('z-index: 1');
  expect(result[1].layerStyle).toContain('z-index: 2');
  expect(result[2].layerStyle).toContain('z-index: 3');
});

it('$renderToasts exposes showClose for only the top-most closable toast', () => {
  const computed = (definition as any)?.computed;
  const toasts = [
    { id: '1', title: 'A', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: false, showClose: true, state: 'enter', createdAt: 1 },
    { id: '2', title: 'B', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: false, showClose: true, state: 'enter', createdAt: 2 },
    { id: '3', title: 'C', description: '', tone: 'dark', icon: '', duration: 1800, shouldAutoDismiss: false, showClose: true, state: 'enter', createdAt: 3 },
  ];

  const result = computed?.$renderToasts({
    classNames: {},
    _toasts: toasts,
  });

  expect(result).toHaveLength(3);
  expect(result[0].showClose).toBe(false);
  expect(result[1].showClose).toBe(false);
  expect(result[2].showClose).toBe(true);
});

it('$activeClose returns null when latest toast does not show close button', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$activeClose({
    classNames: {},
    _toasts: [
      {
        id: 'top-1',
        title: 'Top',
        description: '',
        tone: 'dark',
        icon: '',
        duration: 1800,
        shouldAutoDismiss: false,
        showClose: false,
        state: 'enter',
        createdAt: 1,
      },
    ],
  });

  expect(result).toBeNull();
});

it('$activeClose returns close button config for latest toast', () => {
  const computed = (definition as any)?.computed;
  const result = computed?.$activeClose({
    classNames: {},
    _toasts: [
      {
        id: 'top-1',
        title: 'Top',
        description: '',
        tone: 'dark',
        icon: '',
        duration: 1800,
        shouldAutoDismiss: false,
        showClose: true,
        state: 'enter',
        createdAt: 1,
      },
    ],
  });

  expect(result).toBeTruthy();
  expect(result.id).toBe('top-1');
  expect(result.closeButtonClass).toContain('h-10');
  expect(result.closeButtonClass).toContain('w-10');
  expect(result.closeIconClass).toContain('icon-close');
});
