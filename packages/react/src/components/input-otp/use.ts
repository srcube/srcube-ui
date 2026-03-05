import type * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { inputOtpStyle } from '@srcube-ui/styles/components/input-otp';
import type { InputOtpReactProps } from './props';

function resolveLength(length?: number): number {
  const parsed = Number(length ?? 4);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 4;
  }

  return Math.floor(parsed);
}

function normalizeValue(value: string | undefined, length: number): string {
  return (value ?? '').slice(0, length);
}

export type UseInputOtpProps = InputOtpReactProps;

export function useInputOtp(props: UseInputOtpProps) {
  const {
    length,
    value,
    defaultValue,
    keyboardType = 'number',
    color,
    variant,
    size,
    radius,
    isDisabled,
    isReadOnly,
    isPassword,
    className,
    classNames,
    onClick,
    onChange,
    onValueChange,
    onComplete,
    ...rest
  } = props;

  const resolvedLength = resolveLength(length);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() =>
    normalizeValue(defaultValue, resolvedLength),
  );

  const isControlled = value != null;
  const inputValue = normalizeValue(
    isControlled ? value : uncontrolledValue,
    resolvedLength,
  );

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setUncontrolledValue((prev) => normalizeValue(prev, resolvedLength));
  }, [isControlled, resolvedLength]);

  const setInputValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const classes = useMemo(() => {
    const slots = inputOtpStyle({
      color,
      variant,
      size,
      radius,
      isDisabled,
      isReadOnly,
      isPassword,
    });

    return {
      base: slots.base({ class: [classNames?.base, className] }),
      hiddenInput: slots.hiddenInput({ class: classNames?.hiddenInput }),
      box: slots.box({ class: classNames?.box }),
      cursor: slots.cursor({ class: classNames?.cursor }),
      dot: slots.dot({ class: classNames?.dot }),
    };
  }, [
    color,
    variant,
    size,
    radius,
    isDisabled,
    isReadOnly,
    isPassword,
    classNames,
    className,
  ]);

  const handleWrapperClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (isDisabled || isReadOnly) {
        return;
      }

      inputRef.current?.focus();
    },
    [onClick, isDisabled, isReadOnly],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value ?? '';
      const next = normalizeValue(raw, resolvedLength);
      const previous = inputValue;

      if (raw !== next) {
        event.target.value = next;
      }

      setInputValue(next);
      onChange?.(event);

      if (next.length === resolvedLength && previous.length < resolvedLength) {
        onComplete?.(next);
      }
    },
    [inputValue, onChange, onComplete, resolvedLength, setInputValue],
  );

  const inputMode =
    keyboardType === 'number' || keyboardType === 'digit' ? 'numeric' : undefined;
  const inputType: React.HTMLInputTypeAttribute =
    isPassword
      ? 'password'
      : keyboardType === 'digit'
        ? 'text'
        : keyboardType;

  const boxes = useMemo(() => {
    const chars = inputValue.split('').slice(0, resolvedLength);
    const activeIndex = Math.min(chars.length, Math.max(resolvedLength - 1, 0));

    return Array.from({ length: resolvedLength }, (_, index) => ({
      char: chars[index] ?? '',
      showCursor: isFocused && index === activeIndex && !chars[index],
    }));
  }, [inputValue, resolvedLength, isFocused]);

  const getRootProps = useCallback((): React.HTMLAttributes<HTMLDivElement> => {
    return {
      className: classes.base,
      onClick: handleWrapperClick,
      ...rest,
    };
  }, [classes.base, handleWrapperClick, rest]);

  const getHiddenInputProps = useCallback(
    (): React.InputHTMLAttributes<HTMLInputElement> => {
      return {
        className: classes.hiddenInput,
        value: inputValue,
        maxLength: resolvedLength,
        type: inputType,
        inputMode,
        autoComplete: 'one-time-code',
        autoCapitalize: 'off',
        disabled: isDisabled,
        readOnly: isReadOnly,
        onChange: handleInputChange,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      };
    },
    [
      classes.hiddenInput,
      handleInputChange,
      inputMode,
      inputType,
      inputValue,
      isDisabled,
      isReadOnly,
      resolvedLength,
    ],
  );

  return {
    inputRef,
    classes,
    boxes,
    isPassword: Boolean(isPassword),
    getRootProps,
    getHiddenInputProps,
  };
}

export type UseInputOtpReturn = ReturnType<typeof useInputOtp>;
