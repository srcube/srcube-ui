import { UIComponent } from '../../shared/ui-component';
import { stepperStyle } from '@srcube-ui/styles/components/stepper/style';
import type { StepperMiniProps } from './props';
import { stepperMiniProps } from './props';

function toFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeBounds(min: unknown, max: unknown) {
  const minNumber = toFiniteNumber(min);
  const maxNumber = toFiniteNumber(max);

  if (minNumber === null || maxNumber === null || minNumber <= maxNumber) {
    return {
      min: minNumber,
      max: maxNumber,
    };
  }

  return {
    min: maxNumber,
    max: minNumber,
  };
}

function resolveStep(value: unknown) {
  const numberValue = toFiniteNumber(value);
  if (numberValue === null || numberValue <= 0) {
    return 1;
  }

  return numberValue;
}

function getPrecisionFromNumber(value: number) {
  const valueText = String(value);
  if (!valueText.includes('.')) {
    return 0;
  }

  return valueText.split('.')[1]?.length ?? 0;
}

function resolvePrecision(value: unknown, step: number) {
  const numberValue = toFiniteNumber(value);
  if (numberValue !== null && numberValue >= 0) {
    return Math.floor(numberValue);
  }

  return getPrecisionFromNumber(step);
}

function roundByPrecision(value: number, precision: number) {
  if (precision <= 0) {
    return Math.round(value);
  }

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clampValue(value: number, min: number | null, max: number | null) {
  if (min !== null && value < min) {
    return min;
  }

  if (max !== null && value > max) {
    return max;
  }

  return value;
}

function alignToStep(value: number, step: number, min: number | null) {
  const base = min ?? 0;
  return base + Math.round((value - base) / step) * step;
}

function formatValue(value: number, precision: number) {
  if (precision <= 0) {
    return String(Math.round(value));
  }

  return value.toFixed(precision);
}

function resolveFallbackValue(min: number | null) {
  return min ?? 0;
}

function resolveColor(value?: string | null) {
  if (
    value === 'primary' ||
    value === 'secondary' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  ) {
    return value;
  }

  return 'default';
}

function resolveVariant(value?: string | null) {
  if (
    value === 'default' ||
    value === 'outline' ||
    value === 'twotone' ||
    value === 'underline'
  ) {
    return value;
  }

  return 'default';
}

function resolveSize(value?: string | null) {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveRadius(value?: string | null) {
  if (
    value === 'none' ||
    value === 'sm' ||
    value === 'lg' ||
    value === 'full'
  ) {
    return value;
  }

  return 'md';
}

type StepperMiniData = StepperMiniProps & {
  _innerValue: number;
  _inputValue: string;
};

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    stepperMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: 0,
    _inputValue: '0',
  } satisfies StepperMiniData,

  observers: {
    value() {
      this.syncFromProps();
    },
    defaultValue() {
      this.syncFromProps();
    },
    min() {
      this.syncFromProps();
    },
    max() {
      this.syncFromProps();
    },
    step() {
      this.syncFromProps();
    },
    precision() {
      this.syncFromProps();
    },
  },

  lifetimes: {
    attached() {
      this.syncFromProps();
    },
  },

  computed: {
    $isDisabled(data: StepperMiniData) {
      return Boolean(data.isDisabled);
    },
    $isReadOnly(data: StepperMiniData) {
      return Boolean(data.isReadOnly);
    },
    $resolvedSize(data: StepperMiniData) {
      return resolveSize(data.size ?? undefined);
    },
    $resolvedColor(data: StepperMiniData) {
      return resolveColor(data.color ?? undefined);
    },
    $resolvedVariant(data: StepperMiniData) {
      return resolveVariant(data.variant ?? undefined);
    },
    $baseClassName(data: StepperMiniData) {
      const slots = stepperStyle({
        variant: resolveVariant(data.variant ?? undefined),
        color: resolveColor(data.color ?? undefined),
        size: resolveSize(data.size ?? undefined),
        radius: resolveRadius(data.radius ?? undefined),
        isDisabled: Boolean(data.isDisabled),
        isReadOnly: Boolean(data.isReadOnly),
      });
      return slots.base({ class: [data.className, data.classNames?.base] });
    },
    $resolvedValue(data: StepperMiniData) {
      const { min, max } = normalizeBounds(data.min, data.max);
      const step = resolveStep(data.step);
      const precision = resolvePrecision(data.precision, step);
      const fallback = resolveFallbackValue(min);

      const sourceValue =
        data.value !== null && data.value !== undefined
          ? data.value
          : data._innerValue;
      const candidate = toFiniteNumber(sourceValue) ?? fallback;
      const snapped = alignToStep(candidate, step, min);
      const clamped = clampValue(snapped, min, max);
      return roundByPrecision(clamped, precision);
    },
    $canDecrement(data: StepperMiniData) {
      if (data.isDisabled || data.isReadOnly) {
        return false;
      }

      const { min } = normalizeBounds(data.min, data.max);
      const current =
        data.value !== null && data.value !== undefined
          ? Number(data.value)
          : Number(data._innerValue);

      if (min === null) {
        return true;
      }

      return Number.isFinite(current) && current > min;
    },
    $canIncrement(data: StepperMiniData) {
      if (data.isDisabled || data.isReadOnly) {
        return false;
      }

      const { max } = normalizeBounds(data.min, data.max);
      const current =
        data.value !== null && data.value !== undefined
          ? Number(data.value)
          : Number(data._innerValue);

      if (max === null) {
        return true;
      }

      return Number.isFinite(current) && current < max;
    },
    $decrementButtonClassName(data: StepperMiniData) {
      const slots = stepperStyle({
        variant: resolveVariant(data.variant ?? undefined),
        color: resolveColor(data.color ?? undefined),
        size: resolveSize(data.size ?? undefined),
        radius: resolveRadius(data.radius ?? undefined),
        isDisabled: Boolean(data.isDisabled),
        isReadOnly: Boolean(data.isReadOnly),
      });
      return slots.decrementButton({ class: data.classNames?.decrementButton });
    },
    $incrementButtonClassName(data: StepperMiniData) {
      const slots = stepperStyle({
        variant: resolveVariant(data.variant ?? undefined),
        color: resolveColor(data.color ?? undefined),
        size: resolveSize(data.size ?? undefined),
        radius: resolveRadius(data.radius ?? undefined),
        isDisabled: Boolean(data.isDisabled),
        isReadOnly: Boolean(data.isReadOnly),
      });
      return slots.incrementButton({ class: data.classNames?.incrementButton });
    },
    $valueWrapClassName(data: StepperMiniData) {
      const slots = stepperStyle({
        variant: resolveVariant(data.variant ?? undefined),
        color: resolveColor(data.color ?? undefined),
        size: resolveSize(data.size ?? undefined),
        radius: resolveRadius(data.radius ?? undefined),
        isDisabled: Boolean(data.isDisabled),
        isReadOnly: Boolean(data.isReadOnly),
      });
      return slots.valueWrap({ class: data.classNames?.valueWrap });
    },
    $inputClassName(data: StepperMiniData) {
      const slots = stepperStyle({
        variant: resolveVariant(data.variant ?? undefined),
        color: resolveColor(data.color ?? undefined),
        size: resolveSize(data.size ?? undefined),
        radius: resolveRadius(data.radius ?? undefined),
        isDisabled: Boolean(data.isDisabled),
        isReadOnly: Boolean(data.isReadOnly),
      });
      return slots.input({ class: data.classNames?.input });
    },
  },

  methods: {
    resolveCurrentValue() {
      const { min, max } = normalizeBounds(this.data.min, this.data.max);
      const step = resolveStep(this.data.step);
      const precision = resolvePrecision(this.data.precision, step);
      const fallback = resolveFallbackValue(min);

      const sourceValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      const candidate = toFiniteNumber(sourceValue) ?? fallback;
      const snapped = alignToStep(candidate, step, min);
      const clamped = clampValue(snapped, min, max);

      return {
        value: roundByPrecision(clamped, precision),
        min,
        max,
        step,
        precision,
      };
    },

    syncFromProps() {
      const next = this.resolveCurrentValue();
      const nextDisplayValue = formatValue(next.value, next.precision);
      const nextData: Partial<StepperMiniData> = {};

      if (this.data._inputValue !== nextDisplayValue) {
        nextData._inputValue = nextDisplayValue;
      }

      if (
        (this.data.value === null || this.data.value === undefined) &&
        this.data._innerValue !== next.value
      ) {
        nextData._innerValue = next.value;
      }

      if (Object.keys(nextData).length > 0) {
        this.setData(nextData);
      }
    },

    commitValue(candidate: number, snapToStep: boolean, shouldEmit: boolean) {
      const current = this.resolveCurrentValue();
      const stepped = snapToStep
        ? alignToStep(candidate, current.step, current.min)
        : candidate;
      const clamped = clampValue(stepped, current.min, current.max);
      const nextValue = roundByPrecision(clamped, current.precision);
      const nextDisplayValue = formatValue(nextValue, current.precision);

      const nextData: Partial<StepperMiniData> = {
        _inputValue: nextDisplayValue,
      };

      if (this.data.value === null || this.data.value === undefined) {
        nextData._innerValue = nextValue;
      }

      this.setData(nextData, () => {
        if (shouldEmit && nextValue !== current.value) {
          this.triggerEvent('change', {
            value: nextValue,
          });
        }
      });
    },

    handleFieldTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handleDecreaseTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const current = this.resolveCurrentValue();
      if (current.min !== null && current.value <= current.min) {
        return;
      }

      this.commitValue(current.value - current.step, true, true);
    },

    handleIncreaseTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const current = this.resolveCurrentValue();
      if (current.max !== null && current.value >= current.max) {
        return;
      }

      this.commitValue(current.value + current.step, true, true);
    },

    handleInput(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const nextRawValue = String(e.detail?.value ?? '');
      this.setData({ _inputValue: nextRawValue });

      const parsedValue = Number(nextRawValue);
      if (!Number.isFinite(parsedValue)) {
        return;
      }

      this.commitValue(parsedValue, false, true);
    },

    handleInputBlur(e: WechatMiniprogram.CustomEvent<{ value?: string }>) {
      const rawValue = String(e.detail?.value ?? this.data._inputValue ?? '');
      const parsedValue = Number(rawValue);
      if (!Number.isFinite(parsedValue)) {
        this.syncFromProps();
        return;
      }

      this.commitValue(parsedValue, true, true);
    },
  },
});

export { stepperStyle } from '@srcube-ui/styles/components/stepper/style';
export type { StepperMiniProps } from './props';
export { stepperMiniProps } from './props';
