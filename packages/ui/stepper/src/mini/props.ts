import type { StepperMiniClassNames, StepperVariants } from '../style';

export type StepperMiniProps = StepperVariants & {
  id?: string;
  label?: string;
  labelPlacement?: 'outside' | 'outside-left' | 'inside';
  description?: string;
  errorMessage?: string;
  value?: number | null;
  defaultValue?: number;
  min?: number | null;
  max?: number | null;
  step?: number;
  precision?: number;
  isInvalid?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
  classNames?: Partial<StepperMiniClassNames>;
  style?: string;
};

export const stepperMiniProps = {
  id: {
    type: String,
    value: '',
  },
  label: {
    type: String,
    value: '',
  },
  labelPlacement: {
    type: String,
    value: 'outside',
  },
  description: {
    type: String,
    value: '',
  },
  errorMessage: {
    type: String,
    value: '',
  },
  value: {
    type: null,
    value: null,
  },
  defaultValue: {
    type: Number,
    value: 0,
  },
  min: {
    type: null,
    value: null,
  },
  max: {
    type: null,
    value: null,
  },
  step: {
    type: Number,
    value: 1,
  },
  precision: {
    type: Number,
    value: -1,
  },
  isDisabled: {
    type: Boolean,
    value: false,
  },
  isInvalid: {
    type: Boolean,
    value: false,
  },
  isRequired: {
    type: Boolean,
    value: false,
  },
  isLoading: {
    type: Boolean,
    value: false,
  },
  isReadOnly: {
    type: Boolean,
    value: false,
  },
  variant: {
    type: null,
    value: 'default',
  },
  color: {
    type: null,
    value: 'default',
  },
  size: {
    type: null,
    value: 'md',
  },
  radius: {
    type: null,
    value: 'md',
  },
  className: {
    type: String,
    value: '',
  },
  classNames: {
    type: Object,
    value: {},
  },
  style: {
    type: String,
    value: '',
  },
} as const;
