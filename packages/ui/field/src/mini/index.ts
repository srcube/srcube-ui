import { UIComponent } from '@srcube-ui/mini';
import { fieldStyle } from '../style';
import { fieldMiniProps } from './props';

function resolveLabelPlacement(value?: string | null) {
  if (value === 'inside' || value === 'outside-left') {
    return value;
  }

  return 'outside';
}

function createControlId() {
  return `sr-field-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
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
    fieldMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _controlId: '',
    _innerValue: '',
  },

  observers: {
    id(nextId) {
      if (!nextId) {
        return;
      }

      if (nextId === this.data._controlId) {
        return;
      }

      this.setData({
        _controlId: nextId,
      });
    },

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
        _controlId: this.data.id || createControlId(),
        _innerValue:
          this.data.value === null || this.data.value === undefined
            ? normalizeValue(this.data.defaultValue)
            : normalizeValue(this.data.value),
      });
    },
  },

  computed: {
    $controlId(data) {
      return data.id || data._controlId || createControlId();
    },

    $labelPlacement(data) {
      return resolveLabelPlacement(data.labelPlacement);
    },

    $showOutsideLabel(data) {
      const placement = resolveLabelPlacement(data.labelPlacement);
      return (
        Boolean(data.label) &&
        (placement === 'outside' || placement === 'outside-left')
      );
    },

    $showInsideLabel(data) {
      return (
        Boolean(data.label) &&
        resolveLabelPlacement(data.labelPlacement) === 'inside'
      );
    },

    $hasHelper(data) {
      return Boolean(data.errorMessage || data.description);
    },

    $resolvedValue(data) {
      return resolveCurrentValue(data);
    },

    $showClearButton(data) {
      return Boolean(
        data.isClearable &&
          !data.isDisabled &&
          !data.isReadOnly &&
          resolveCurrentValue(data),
      );
    },

    $displayValue(data) {
      return resolveCurrentValue(data) || data.placeholder || '';
    },

    $showFallbackControl(data) {
      return Boolean(resolveCurrentValue(data) || data.placeholder);
    },

    $classNames(data) {
      const slots = fieldStyle({
        color: data.color ?? undefined,
        variant: data.variant ?? undefined,
        size: data.size ?? undefined,
        radius: data.radius ?? undefined,
        labelPlacement: resolveLabelPlacement(data.labelPlacement),
        isDisabled: data.isDisabled,
        isReadOnly: data.isReadOnly,
        isInvalid: data.isInvalid,
        isLoading: data.isLoading,
        isClearable: Boolean(
          data.isClearable && !data.isDisabled && !data.isReadOnly,
        ),
      });

      const className = data.className ?? '';
      const custom = (data.classNames ?? {}) as Record<string, string>;

      return {
        base: slots.base({ class: [custom.base, className] }),
        outsideWrapper: slots.outsideWrapper({ class: custom.outsideWrapper }),
        controlWrapper: slots.controlWrapper({ class: custom.controlWrapper }),
        label: slots.label({ class: custom.label }),
        requiredMark: slots.requiredMark({ class: custom.requiredMark }),
        control: slots.control({ class: custom.control }),
        input: slots.input({ class: custom.input }),
        helperWrapper: slots.helperWrapper({ class: custom.helperWrapper }),
        description: slots.description({ class: custom.description }),
        errorMessage: slots.errorMessage({ class: custom.errorMessage }),
        startContent: slots.startContent({ class: custom.startContent }),
        endContent: slots.endContent({ class: custom.endContent }),
        clearButton: slots.clearButton({ class: custom.clearButton }),
        _iClear: slots._iClear(),
      };
    },
  },

  methods: {
    handleBaseTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handleClearTap() {
      if (
        this.data.isDisabled ||
        this.data.isReadOnly ||
        !this.data.isClearable
      ) {
        return;
      }

      const currentValue = resolveCurrentValue(this.data);
      if (!currentValue) {
        return;
      }

      const finish = () => {
        this.triggerEvent('valuechange', {
          value: '',
        });
        this.triggerEvent('clear', {
          value: '',
        });
      };

      if (this.data.value === null || this.data.value === undefined) {
        this.setData(
          {
            _innerValue: '',
          },
          finish,
        );
        return;
      }

      finish();
    },
  },
});

export { fieldStyle } from '../style';
export type { FieldMiniProps } from './props';
export { fieldMiniProps } from './props';
