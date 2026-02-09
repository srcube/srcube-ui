import { composeTwRenderProps } from '@srcube-ui/react';
import * as React from 'react';
import { RadioGroup as AriaRadioGroup } from 'react-aria-components';
import { radioGroup } from '../style';
import type { RadioGroupReactProps } from './props';

type RadioGroupContextValue = {
  color?: NonNullable<RadioGroupReactProps['color']>;
  size?: NonNullable<RadioGroupReactProps['size']>;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export function useRadioGroupContext() {
  return React.useContext(RadioGroupContext);
}

export const RadioGroup: React.ForwardRefExoticComponent<
  RadioGroupReactProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, RadioGroupReactProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    orientation = 'y',
    isBlock = false,
    color,
    size,
    isDisabled = false,
    isReadOnly = false,
    className,
    children,
    ...rest
  } = props;

  const resolvedOrientation = orientation === 'x' ? 'horizontal' : 'vertical';

  const baseClassName = composeTwRenderProps(
    className,
    radioGroup({ orientation, isBlock }),
  );

  const contextValue = React.useMemo<RadioGroupContextValue>(
    () => ({
      color,
      size,
      isDisabled,
      isReadOnly,
    }),
    [color, size, isDisabled, isReadOnly],
  );

  const handleChange = React.useCallback(
    (next: string) => {
      onValueChange?.(next);
    },
    [onValueChange],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <AriaRadioGroup
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? undefined}
        orientation={resolvedOrientation}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        className={baseClassName}
        onChange={handleChange}
        {...rest}
      >
        {children}
      </AriaRadioGroup>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'Srcube.RadioGroup';
