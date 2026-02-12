import * as React from 'react';
import type { InputOtpReactProps } from './props';
import { useInputOtp } from './use';

export type InputOtpProps = InputOtpReactProps;

export const InputOtp = React.forwardRef<HTMLDivElement, InputOtpProps>(
  (props, ref) => {
    const { style, ...rest } = props;

    const {
      inputRef,
      classes,
      boxes,
      isPassword,
      getRootProps,
      getHiddenInputProps,
    } = useInputOtp(rest);

    return (
      <div ref={ref} {...getRootProps()} style={style}>
        <input ref={inputRef} {...getHiddenInputProps()} />
        {boxes.map((box, index) => (
          <div key={index} className={classes.box}>
            {box.char ? (
              isPassword ? (
                <span className={classes.dot} />
              ) : (
                <span>{box.char}</span>
              )
            ) : box.showCursor ? (
              <span className={classes.cursor} />
            ) : null}
          </div>
        ))}
      </div>
    );
  },
);

InputOtp.displayName = 'Srcube.InputOtp';
