import * as React from 'react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { fieldStyle } from '../style';
import type { FieldLabelPlacement, FieldReactProps } from './props';

function resolveLabelPlacement(
  value?: FieldLabelPlacement,
): FieldLabelPlacement {
  if (value === 'inside' || value === 'outside-left') {
    return value;
  }

  return 'outside';
}

function mergeClassName(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function normalizeValue(value?: string | number): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

export type UseFieldProps = FieldReactProps;

export function useField(props: UseFieldProps) {
  const {
    id,
    label,
    labelPlacement,
    value,
    defaultValue,
    placeholder,
    description,
    errorMessage,
    startContent,
    endContent,
    clearButton,
    isClearable,
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
    isLoading,
    color,
    variant,
    size,
    radius,
    className,
    classNames,
    controlProps,
    children,
    onValueChange,
    onClear,
    onTap,
    onClick,
    ...rest
  } = props;

  const reactId = useId();
  const controlId = useMemo(
    () => id ?? `sr-field-${reactId.replaceAll(':', '')}`,
    [id, reactId],
  );

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState<string>(() =>
    normalizeValue(defaultValue),
  );
  const resolvedValue = isControlled ? normalizeValue(value) : innerValue;
  const hasValue = resolvedValue.length > 0;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setInnerValue((prev) => {
      if (prev.length > 0) {
        return prev;
      }

      return normalizeValue(defaultValue);
    });
  }, [defaultValue, isControlled]);

  const resolvedLabelPlacement = resolveLabelPlacement(labelPlacement);
  const showOutsideLabel =
    resolvedLabelPlacement === 'outside' ||
    resolvedLabelPlacement === 'outside-left';
  const showInsideLabel = resolvedLabelPlacement === 'inside';
  const hasHelper = Boolean(errorMessage || description);
  const showClearButton = Boolean(
    isClearable && !isDisabled && !isReadOnly && hasValue,
  );

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInnerValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const slots = useMemo(
    () =>
      fieldStyle({
        color,
        variant,
        size,
        radius,
        labelPlacement: resolvedLabelPlacement,
        isDisabled,
        isReadOnly,
        isInvalid,
        isLoading,
        isClearable: showClearButton,
      }),
    [
      color,
      variant,
      size,
      radius,
      resolvedLabelPlacement,
      isDisabled,
      isReadOnly,
      isInvalid,
      isLoading,
      showClearButton,
    ],
  );

  const classes = useMemo(
    () => ({
      base: slots.base({ class: [classNames?.base, className] }),
      outsideWrapper: slots.outsideWrapper({
        class: classNames?.outsideWrapper,
      }),
      controlWrapper: slots.controlWrapper({
        class: classNames?.controlWrapper,
      }),
      label: slots.label({ class: classNames?.label }),
      requiredMark: slots.requiredMark({ class: classNames?.requiredMark }),
      control: slots.control({ class: classNames?.control }),
      input: slots.input({ class: classNames?.input }),
      helperWrapper: slots.helperWrapper({ class: classNames?.helperWrapper }),
      description: slots.description({ class: classNames?.description }),
      errorMessage: slots.errorMessage({ class: classNames?.errorMessage }),
      startContent: slots.startContent({ class: classNames?.startContent }),
      endContent: slots.endContent({ class: classNames?.endContent }),
      clearButton: slots.clearButton({ class: classNames?.clearButton }),
      _iClear: slots._iClear(),
    }),
    [className, classNames, slots],
  );

  const controlClassName = useMemo(
    () => mergeClassName(classes.control, controlProps?.className),
    [classes.control, controlProps?.className],
  );

  const handleRootClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      onTap?.(event);
    },
    [onClick, onTap],
  );

  const handleClearClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!showClearButton) {
        return;
      }

      handleValueChange('');
      onClear?.();
    },
    [handleValueChange, onClear, showClearButton],
  );

  const rootProps = useMemo(() => {
    return {
      className: classes.base,
      onClick: handleRootClick,
      'aria-disabled': isDisabled || undefined,
      'aria-invalid': isInvalid || undefined,
      ...rest,
    } satisfies React.HTMLAttributes<HTMLDivElement>;
  }, [classes.base, handleRootClick, isDisabled, isInvalid, rest]);

  const fallbackControl = useMemo(() => {
    return React.createElement(
      'div',
      { id: controlId, className: classes.input },
      resolvedValue || placeholder || null,
    );
  }, [classes.input, controlId, placeholder, resolvedValue]);

  const controlContent = useMemo(() => {
    if (typeof children === 'function') {
      return children({
        id: controlId,
        className: classes.input,
        value: resolvedValue,
        onValueChange: handleValueChange,
        isDisabled: Boolean(isDisabled),
        isReadOnly: Boolean(isReadOnly),
        isInvalid: Boolean(isInvalid),
      });
    }

    if (children != null) {
      return children;
    }

    return fallbackControl;
  }, [
    children,
    classes.input,
    controlId,
    fallbackControl,
    handleValueChange,
    isDisabled,
    isInvalid,
    isReadOnly,
    resolvedValue,
  ]);

  return {
    controlId,
    label,
    isRequired: Boolean(isRequired),
    description,
    errorMessage,
    startContent,
    endContent,
    clearButton,
    hasHelper,
    showOutsideLabel,
    showInsideLabel,
    showClearButton,
    classes,
    controlContent,
    rootProps,
    controlClassName,
    controlProps,
    handleClearClick,
  };
}

export type UseFieldReturn = ReturnType<typeof useField>;
