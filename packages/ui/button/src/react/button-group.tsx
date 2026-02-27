import * as React from 'react';
import type { ButtonGroupVariants, ButtonVariants } from '../style';
import { buttonGroup } from '../style';
import type { ButtonGroupReactProps, ButtonReactProps } from './props';

type ButtonGroupContextValue = Pick<
  ButtonVariants,
  'color' | 'variant' | 'size' | 'radius' | 'isBlock' | 'isDisabled'
> &
  Pick<ButtonGroupVariants, 'orientation'>;

const ButtonGroupContext = React.createContext<
  ButtonGroupContextValue | undefined
>(undefined);

export function useButtonGroupContext() {
  return React.useContext(ButtonGroupContext);
}

export const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  ButtonGroupReactProps
>((props, ref) => {
  const {
    color = 'primary',
    variant = 'solid',
    size = 'md',
    radius = 'md',
    isBlock = false,
    isDisabled = false,
    orientation = 'x',
    className,
    children,
    ...rest
  } = props;

  const classes = React.useMemo(
    () =>
      buttonGroup({
        isBlock,
        orientation,
        className,
      }),
    [isBlock, orientation, className],
  );

  const context = React.useMemo(
    () => ({
      color,
      variant,
      size,
      radius,
      isBlock,
      isDisabled,
      orientation,
    }),
    [color, variant, size, radius, isBlock, isDisabled, orientation],
  );

  const total = React.Children.count(children);

  return (
    <ButtonGroupContext.Provider value={context}>
      <div ref={ref} className={classes} {...rest}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<ButtonReactProps>(child)) return child;
          if (typeof child.type === 'string') return child;

          let position: ButtonVariants['groupPosition'] = 'none';

          if (total > 1) {
            if (index === 0) position = 'first';
            else if (index === total - 1) position = 'last';
            else position = 'middle';
          }

          return React.cloneElement(child, { groupPosition: position });
        })}
      </div>
    </ButtonGroupContext.Provider>
  );
});

ButtonGroup.displayName = 'Srcube.ButtonGroup';
