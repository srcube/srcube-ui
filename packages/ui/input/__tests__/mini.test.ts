import { beforeAll, expect, it, vi } from 'vitest';

let definition: Record<string, unknown> | undefined;

type MiniCtx = {
  data: Record<string, unknown>;
  setData: (patch: Record<string, unknown>) => void;
  triggerEvent: (...args: unknown[]) => void;
};

vi.doMock('@srcube-ui/runtime/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function createCtx(data: Record<string, unknown> = {}): MiniCtx {
  return {
    data: {
      value: null,
      defaultValue: '',
      _innerValue: '',
      ...data,
    },
    setData(patch) {
      this.data = {
        ...this.data,
        ...patch,
      };
    },
    triggerEvent: vi.fn(),
  };
}

it('updates inner value and emits valuechange on input', () => {
  const methods = definition?.methods as Record<
    string,
    (...args: unknown[]) => void
  >;
  const ctx = createCtx();

  methods.handleInput.call(ctx, {
    detail: {
      value: '123',
    },
  });

  expect(ctx.data._innerValue).toBe('123');
  expect(ctx.triggerEvent).toHaveBeenCalledWith('valuechange', {
    value: '123',
  });
});

it('forwards clear event detail from field', () => {
  const methods = definition?.methods as Record<
    string,
    (...args: unknown[]) => void
  >;
  const ctx = createCtx();

  methods.handleFieldClear.call(ctx, {
    detail: {
      value: '',
    },
  });

  expect(ctx.triggerEvent).toHaveBeenCalledWith('clear', {
    value: '',
  });
});
