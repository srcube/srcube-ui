import { beforeAll, expect, it, vi } from 'vitest';

let definition: Record<string, unknown> | undefined;

type MiniCtx = {
  data: Record<string, unknown>;
  setData: (patch: Record<string, unknown>) => void;
  triggerEvent: (...args: unknown[]) => void;
};

vi.doMock('miniprogram-computed', () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../../src/components/textarea/index');
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
      value: 'note',
    },
  });

  expect(ctx.data._innerValue).toBe('note');
  expect(ctx.triggerEvent).toHaveBeenCalledWith('valuechange', {
    value: 'note',
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

it('renders count label with infinity when maxLength is -1', () => {
  const computed = definition?.computed as Record<
    string,
    (data: Record<string, unknown>) => unknown
  >;

  const text = computed.$countText({
    value: 'hello',
    _innerValue: '',
    maxLength: -1,
  });

  expect(text).toBe('5/♾️');
});

it('enables end slot when showCount is true', () => {
  const computed = definition?.computed as Record<
    string,
    (data: Record<string, unknown>) => unknown
  >;

  const showEnd = computed.$hasFieldEndContent({
    hasEndContent: false,
    showCount: true,
  });

  expect(showEnd).toBe(true);
});
