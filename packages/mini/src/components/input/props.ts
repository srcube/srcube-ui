import type {
  FieldClassNames,
  FieldVariants,
} from '@srcube-ui/styles/components/field/style';

export type InputMiniLabelPlacement = 'outside' | 'outside-left' | 'inside';

export type InputMiniProps = FieldVariants & {
  id?: string;
  label?: string;
  labelPlacement?: InputMiniLabelPlacement;
  value?: string | number | null;
  defaultValue?: string | number;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  hasStartContent?: boolean;
  hasEndContent?: boolean;
  hasClearContent?: boolean;
  className?: string;
  classNames?: Partial<FieldClassNames>;
  style?: string;
  inputType?: string;
  inputClassName?: string;
  maxLength?: number;
  confirmType?: string;
  isPassword?: boolean;
  isConfirmHold?: boolean;
  isAlwaysEmbed?: boolean;
};

export const inputMiniProps = {
  id: { type: String, value: '' },
  color: { type: null, value: null },
  tone: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  label: { type: String, value: '' },
  labelPlacement: { type: String, value: 'outside' },
  value: { type: null, value: null },
  defaultValue: { type: null, value: '' },
  placeholder: { type: String, value: '' },
  description: { type: String, value: '' },
  errorMessage: { type: String, value: '' },
  isClearable: { type: Boolean, value: false },
  isDisabled: { type: Boolean, value: false },
  isReadOnly: { type: Boolean, value: false },
  isInvalid: { type: Boolean, value: false },
  isRequired: { type: Boolean, value: false },
  isLoading: { type: Boolean, value: false },
  hasStartContent: { type: Boolean, value: false },
  hasEndContent: { type: Boolean, value: false },
  hasClearContent: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  inputType: { type: String, value: 'text' },
  inputClassName: { type: String, value: '' },
  maxLength: { type: Number, value: 140 },
  confirmType: { type: String, value: 'done' },
  isPassword: { type: Boolean, value: false },
  isConfirmHold: { type: Boolean, value: false },
  isAlwaysEmbed: { type: Boolean, value: false },
} as const;
