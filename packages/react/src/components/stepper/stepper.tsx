import { Button } from '../button';
import { Field } from '../field';
import * as React from 'react';
import { stepperStyle } from '@srcube-ui/styles/components/stepper';
import type { StepperReactProps } from './props';

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

function mergeClassName(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperReactProps>(
  (props, ref) => {
    const {
      id,
      label,
      labelPlacement,
      description,
      errorMessage,
      value,
      defaultValue,
      min,
      max,
      step,
      precision,
      color,
      variant,
      size,
      radius,
      isDisabled = false,
      isReadOnly = false,
      isInvalid = false,
      isRequired,
      isLoading,
      className,
      classNames,
      controlProps,
      style,
      decrementLabel = 'Decrease',
      incrementLabel = 'Increase',
      inputProps,
      onValueChange,
      onTap,
      ...rest
    } = props;

    const { min: minValue, max: maxValue } = React.useMemo(
      () => normalizeBounds(min, max),
      [max, min],
    );
    const stepValue = React.useMemo(() => resolveStep(step), [step]);
    const precisionValue = React.useMemo(
      () => resolvePrecision(precision, stepValue),
      [precision, stepValue],
    );

    const normalizeValue = React.useCallback(
      (candidate: unknown, snapToStep: boolean) => {
        const fallback = resolveFallbackValue(minValue);
        const finiteCandidate = toFiniteNumber(candidate);
        const nextValue = finiteCandidate ?? fallback;
        const stepped = snapToStep
          ? alignToStep(nextValue, stepValue, minValue)
          : nextValue;
        const clamped = clampValue(stepped, minValue, maxValue);
        return roundByPrecision(clamped, precisionValue);
      },
      [maxValue, minValue, precisionValue, stepValue],
    );

    const isControlled = value !== undefined;

    const [innerValue, setInnerValue] = React.useState(() =>
      normalizeValue(defaultValue, true),
    );

    const resolvedValue = React.useMemo(() => {
      if (value === undefined || value === null) {
        return normalizeValue(innerValue, true);
      }

      return normalizeValue(value, true);
    }, [innerValue, normalizeValue, value]);

    const [inputValue, setInputValue] = React.useState(() =>
      formatValue(resolvedValue, precisionValue),
    );

    React.useEffect(() => {
      setInputValue(formatValue(resolvedValue, precisionValue));
    }, [precisionValue, resolvedValue]);

    const commitValue = React.useCallback(
      (candidate: number, snapToStep: boolean) => {
        const nextValue = normalizeValue(candidate, snapToStep);
        if (!isControlled) {
          setInnerValue(nextValue);
        }
        setInputValue(formatValue(nextValue, precisionValue));
        if (nextValue !== resolvedValue) {
          onValueChange?.(nextValue);
        }
      },
      [
        isControlled,
        normalizeValue,
        onValueChange,
        precisionValue,
        resolvedValue,
      ],
    );

    const canDecrement =
      !isDisabled &&
      !isReadOnly &&
      (minValue === null || resolvedValue > minValue);
    const canIncrement =
      !isDisabled &&
      !isReadOnly &&
      (maxValue === null || resolvedValue < maxValue);

    const slots = stepperStyle({
      color,
      variant,
      size,
      radius,
      isDisabled,
      isReadOnly,
    });
    const baseClassName = slots.base({ class: [classNames?.base, className] });

    const handleDecrease = React.useCallback(() => {
      if (!canDecrement) {
        return;
      }

      commitValue(resolvedValue - stepValue, true);
    }, [canDecrement, commitValue, resolvedValue, stepValue]);

    const handleIncrease = React.useCallback(() => {
      if (!canIncrement) {
        return;
      }

      commitValue(resolvedValue + stepValue, true);
    }, [canIncrement, commitValue, resolvedValue, stepValue]);

    const handleInputChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextRawValue = event.target.value;
        setInputValue(nextRawValue);
        inputProps?.onChange?.(event);

        const parsedValue = Number(nextRawValue);
        if (!Number.isFinite(parsedValue)) {
          return;
        }

        const nextValue = normalizeValue(parsedValue, false);
        if (!isControlled) {
          setInnerValue(nextValue);
        }
        if (nextValue !== resolvedValue) {
          onValueChange?.(nextValue);
        }
      },
      [inputProps, isControlled, normalizeValue, onValueChange, resolvedValue],
    );

    const handleInputBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        const parsedValue = Number(event.target.value);
        if (!Number.isFinite(parsedValue)) {
          setInputValue(formatValue(resolvedValue, precisionValue));
          inputProps?.onBlur?.(event);
          return;
        }

        commitValue(parsedValue, true);
        inputProps?.onBlur?.(event);
      },
      [commitValue, inputProps, precisionValue, resolvedValue],
    );

    const startContent = (
      <Button
        color={color}
        variant="text"
        size={size}
        radius="none"
        isDisabled={!canDecrement}
        className={slots.decrementButton({ class: classNames?.decrementButton })}
        onTap={handleDecrease}
        aria-label={decrementLabel}
      >
        -
      </Button>
    );

    const endContent = (
      <Button
        color={color}
        variant="text"
        size={size}
        radius="none"
        isDisabled={!canIncrement}
        className={slots.incrementButton({ class: classNames?.incrementButton })}
        onTap={handleIncrease}
        aria-label={incrementLabel}
      >
        +
      </Button>
    );

    return (
      <Field
        {...rest}
        ref={ref}
        id={id}
        label={label}
        labelPlacement={labelPlacement}
        description={description}
        errorMessage={errorMessage}
        startContent={startContent}
        endContent={endContent}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
        isRequired={isRequired}
        isLoading={isLoading}
        color={color}
        variant={variant}
        size={size}
        radius={radius}
        className={baseClassName}
        controlProps={controlProps}
        style={style}
        value={inputValue}
        onTap={onTap}
      >
        {({ id: fieldId, className: fieldInputClass, isInvalid: fieldInvalid }) => (
          <div className={slots.valueWrap({ class: classNames?.valueWrap })}>
            <input
              {...inputProps}
              type="text"
              inputMode="decimal"
              id={fieldId}
              value={inputValue}
              className={mergeClassName(
                fieldInputClass,
                slots.input({ class: [classNames?.input, inputProps?.className] }),
              )}
              disabled={isDisabled}
              readOnly={isReadOnly}
              aria-invalid={fieldInvalid || undefined}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </div>
        )}
      </Field>
    );
  },
);

Stepper.displayName = 'Srcube.Stepper';
