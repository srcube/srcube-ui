import type { InputOtpClassNames, InputOtpVariants } from '@srcube-ui/styles/components/input-otp/style';

export type InputOtpMiniProps = InputOtpVariants & {
  length?: number;
  value?: string;
  defaultValue?: string;
  keyboardType?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isPassword?: boolean;
  className?: string;
  classNames?: Partial<InputOtpClassNames>;
  style?: string;
};

export const inputOtpMiniProps = {
  color: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  length: { type: Number, value: 4 },
  value: { type: null, value: null },
  defaultValue: { type: String, value: '' },
  keyboardType: { type: String, value: 'number' },
  isDisabled: { type: Boolean, value: false },
  isReadOnly: { type: Boolean, value: false },
  isPassword: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
