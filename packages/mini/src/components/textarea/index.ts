import { UIComponent } from '../../shared/ui-component';
import { textareaStyle } from '@srcube-ui/styles/components/textarea/style';
import { textareaMiniProps } from './props';

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

function resolveMaxCountLabel(maxLength: unknown): string {
  const resolved = Number(maxLength);
  if (!Number.isFinite(resolved) || resolved < 0) {
    return '♾️';
  }

  return String(Math.floor(resolved));
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    textareaMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

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
      const slots = textareaStyle({
        tone: data.tone ?? undefined,
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
        isAutoHeight: data.isAutoHeight,
      });
      const classNames = (data.classNames ?? {}) as Record<string, string>;
      const isOutsideLeftLabel = data.labelPlacement === 'outside-left';

      return {
        ...classNames,
        base: mergeClassName(
          classNames.base,
          isOutsideLeftLabel ? 'items-start' : undefined,
        ),
        label: mergeClassName(classNames.label, 'h-[1.5em] leading-[1.5em]'),
        controlWrapper: mergeClassName(classNames.controlWrapper, 'py-2'),
        control: mergeClassName(
          classNames.control,
          slots.control(),
          'h-auto min-h-0 items-start',
        ),
        input: mergeClassName(
          classNames.input,
          'items-start py-0.5 overflow-visible whitespace-normal text-clip',
        ),
        startContent: mergeClassName(
          classNames.startContent,
          'self-start h-[1.5em] leading-[1.5em]',
        ),
        endContent: mergeClassName(
          classNames.endContent,
          slots.endContent(),
        ),
        clearButton: mergeClassName(
          classNames.clearButton,
          slots.clearButton(),
        ),
      };
    },

    $textareaClassName(data) {
      const slots = textareaStyle({
        tone: data.tone ?? undefined,
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
        isAutoHeight: data.isAutoHeight,
      });

      return slots.textarea({ class: data.textareaClassName });
    },

    $textareaStyle(data) {
      if (data.isAutoHeight) {
        return '';
      }

      const rows = Number(data.rows) > 0 ? Number(data.rows) : 3;
      return `min-height: ${rows * 1.5}em;`;
    },

    $hasFieldEndContent(data) {
      return Boolean(data.hasEndContent || data.showCount);
    },

    $countText(data) {
      const value = resolveCurrentValue(data);
      const maxCount = resolveMaxCountLabel(data.maxLength);
      return `${value.length}/${maxCount}`;
    },

    $countClassName(data) {
      const slots = textareaStyle({
        tone: data.tone ?? undefined,
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
        isAutoHeight: data.isAutoHeight,
      });

      return slots.count();
    },

    $endMetaClassName(data) {
      const slots = textareaStyle({
        tone: data.tone ?? undefined,
        size: data.size ?? undefined,
        isDisabled: data.isDisabled,
        isAutoHeight: data.isAutoHeight,
      });

      return slots.endMeta();
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

export { textareaStyle } from '@srcube-ui/styles/components/textarea/style';
export type { TextareaMiniProps } from './props';
export { textareaMiniProps } from './props';
