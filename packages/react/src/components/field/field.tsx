import * as React from 'react';
import type { FieldReactProps } from './props';
import { useField } from './use';

export type FieldProps = FieldReactProps;

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (props, ref) => {
    const {
      style,
      label,
      isRequired,
      description,
      errorMessage,
      startContent,
      endContent,
      clearButton,
      hasHelper,
      controlId,
      showOutsideLabel,
      showInsideLabel,
      showClearButton,
      classes,
      controlContent,
      rootProps,
      controlClassName,
      controlProps,
      handleClearClick,
    } = useField(props);

    const {
      className: _controlClassName,
      children: _controlChildren,
      ...restControlProps
    } = controlProps ?? {};

    const labelContent = label ? (
      <label htmlFor={controlId} className={classes.label}>
        {label}
        {isRequired ? <span className={classes.requiredMark}>*</span> : null}
      </label>
    ) : null;

    const clearContent = showClearButton ? (
      <button
        type="button"
        className={classes.clearButton}
        onClick={handleClearClick}
        aria-label="clear"
      >
        {clearButton ?? <span className={classes._iClear} />}
      </button>
    ) : null;

    const helperContent = hasHelper ? (
      <div className={classes.helperWrapper}>
        {errorMessage ? (
          <div className={classes.errorMessage}>{errorMessage}</div>
        ) : (
          <div className={classes.description}>{description}</div>
        )}
      </div>
    ) : null;

    return (
      <div ref={ref} {...rootProps} style={style}>
        {showOutsideLabel ? labelContent : null}

        <div className={classes.outsideWrapper}>
          <div className={classes.controlWrapper}>
            {showInsideLabel ? labelContent : null}

            <div className={controlClassName} {...restControlProps}>
              {startContent ? (
                <div className={classes.startContent}>{startContent}</div>
              ) : null}

              {controlContent}

              {clearContent}

              {endContent ? (
                <div className={classes.endContent}>{endContent}</div>
              ) : null}
            </div>
          </div>

          {helperContent}
        </div>
      </div>
    );
  },
);

Field.displayName = 'Srcube.Field';
