import { UIComponent } from '@srcube-ui/mini';
import { inputOtpStyle } from '../style';
import { inputOtpMiniProps } from './props';

function resolveLength(length: number | undefined): number {
  const parsed = Number(length ?? 4);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 4;
  }

  return Math.floor(parsed);
}

function normalizeValue(value: unknown, length: number): string {
  return String(value ?? '').slice(0, length);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    inputOtpMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    inputValue: '',
    isFocused: false,
    focus: false,
  },

  observers: {
    value(value) {
      if (value == null) {
        return;
      }

      const next = normalizeValue(value, resolveLength(this.data.length));
      if (next === this.data.inputValue) {
        return;
      }

      this.setData({ inputValue: next });
    },

    length(length) {
      if (this.data.value != null) {
        return;
      }

      const next = normalizeValue(this.data.inputValue, resolveLength(length));
      if (next === this.data.inputValue) {
        return;
      }

      this.setData({ inputValue: next });
    },
  },

  lifetimes: {
    attached() {
      const maxLength = resolveLength(this.data.length);
      const initialValue =
        this.data.value == null
          ? normalizeValue(this.data.defaultValue, maxLength)
          : normalizeValue(this.data.value, maxLength);

      this.setData({ inputValue: initialValue });
    },
  },

  computed: {
    $length(data) {
      return resolveLength(data.length);
    },

    $value(data) {
      return normalizeValue(
        data.value == null ? data.inputValue : data.value,
        resolveLength(data.length),
      );
    },

    $isDisabled(data) {
      return Boolean(data.isDisabled || data.isReadOnly);
    },

    $classNames(data) {
      const slots = inputOtpStyle({
        color: data.color ?? undefined,
        variant: data.variant ?? undefined,
        size: data.size ?? undefined,
        radius: data.radius ?? undefined,
        isDisabled: data.isDisabled,
        isReadOnly: data.isReadOnly,
        isPassword: data.isPassword,
      });

      const className = data.className ?? '';
      const custom = (data.classNames ?? {}) as Record<string, string>;

      return {
        base: slots.base({ class: [custom.base, className] }),
        hiddenInput: slots.hiddenInput({ class: custom.hiddenInput }),
        box: slots.box({ class: custom.box }),
        cursor: slots.cursor({ class: custom.cursor }),
        dot: slots.dot({ class: custom.dot }),
      };
    },

    $boxes(data) {
      const length = resolveLength(data.length);
      const value = normalizeValue(
        data.value == null ? data.inputValue : data.value,
        length,
      );
      const chars = value.split('').slice(0, length);
      const activeIndex = Math.min(chars.length, Math.max(length - 1, 0));

      return Array.from({ length }, (_, index) => ({
        char: chars[index] ?? '',
        showCursor: data.isFocused && index === activeIndex && !chars[index],
      }));
    },
  },

  methods: {
    handleWrapperTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      this.setData({ focus: true });
    },

    handleInput(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
      const maxLength = resolveLength(this.data.length);
      const rawValue = e.detail.value ?? '';
      const nextValue = normalizeValue(rawValue, maxLength);
      const previousValue = normalizeValue(
        this.data.value == null ? this.data.inputValue : this.data.value,
        maxLength,
      );

      if (this.data.value == null && nextValue !== this.data.inputValue) {
        this.setData({ inputValue: nextValue });
      }

      this.triggerEvent('change', e.detail ?? e);
      this.triggerEvent('valuechange', { value: nextValue });

      if (
        nextValue.length === maxLength &&
        previousValue.length < maxLength
      ) {
        this.triggerEvent('complete', { value: nextValue });
      }
    },

    handleFocus() {
      this.setData({ isFocused: true });
    },

    handleBlur() {
      this.setData({ isFocused: false, focus: false });
    },
  },
});

export { inputOtpStyle } from '../style';
export type { InputOtpMiniProps } from './props';
export { inputOtpMiniProps } from './props';
