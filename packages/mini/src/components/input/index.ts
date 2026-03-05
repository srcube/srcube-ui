import { inputStyle } from '@srcube-ui/styles/components/input/style';
import { UIComponent } from '../../shared/ui-component';
import { inputMiniProps } from './props';

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function mergeClassName(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function resolveCurrentValue(data: { value?: unknown; _innerValue?: string }) {
  return data.value === null || data.value === undefined
    ? normalizeValue(data._innerValue)
    : normalizeValue(data.value);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    inputMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: '',
  },

  observers: {
    value(nextValue) {
      if (nextValue === null || nextValue === undefined) {
        return;
      }

      const normalized = normalizeValue(nextValue);
      if (normalized === this.data._innerValue) {
        return;
      }

      this.setData({
        _innerValue: normalized,
      });
    },

    defaultValue(nextValue) {
      if (this.data.value !== null && this.data.value !== undefined) {
        return;
      }

      const normalized = normalizeValue(nextValue);
      if (normalized === this.data._innerValue) {
        return;
      }

      this.setData({
        _innerValue: normalized,
      });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerValue:
          this.data.value === null || this.data.value === undefined
            ? normalizeValue(this.data.defaultValue)
            : normalizeValue(this.data.value),
      });
    },
  },

  computed: {
    $resolvedValue(data) {
      return resolveCurrentValue(data);
    },

    $fieldClassNames(data) {
      const slots = inputStyle({
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
      });
      const classNames = (data.classNames ?? {}) as Record<string, string>;

      return {
        ...classNames,
        control: mergeClassName(classNames.control, slots.control()),
      };
    },

    $inputClassName(data) {
      const slots = inputStyle({
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
      });

      return slots.input({ class: data.inputClassName });
    },
  },

  methods: {
    handleInput(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
      const nextValue = normalizeValue(e.detail?.value);
      if (this.data.value === null || this.data.value === undefined) {
        this.setData({
          _innerValue: nextValue,
        });
      }

      this.triggerEvent('valuechange', {
        value: nextValue,
      });
      this.triggerEvent('input', {
        ...(e.detail ?? {}),
        value: nextValue,
      });
    },

    handleFieldValueChange(
      e: WechatMiniprogram.CustomEvent<{ value?: string }>,
    ) {
      const nextValue = normalizeValue(e.detail?.value);
      if (this.data.value === null || this.data.value === undefined) {
        this.setData({
          _innerValue: nextValue,
        });
      }

      this.triggerEvent('valuechange', {
        value: nextValue,
      });
    },

    handleFieldClear(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
      this.triggerEvent('clear', {
        ...(e.detail ?? {}),
        value: '',
      });
    },

    handleFieldTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handleFocus(e: WechatMiniprogram.CustomEvent<Record<string, unknown>>) {
      this.triggerEvent('focus', e.detail ?? {});
    },

    handleBlur(e: WechatMiniprogram.CustomEvent<Record<string, unknown>>) {
      this.triggerEvent('blur', e.detail ?? {});
    },

    handleConfirm(e: WechatMiniprogram.CustomEvent<Record<string, unknown>>) {
      this.triggerEvent('confirm', e.detail ?? {});
    },
  },
});

export { inputStyle } from '@srcube-ui/styles/components/input/style';
export type { InputMiniProps } from './props';
export { inputMiniProps } from './props';
