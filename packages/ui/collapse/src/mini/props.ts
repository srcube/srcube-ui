import type { CollapseMiniClassNames, CollapseVariants } from '../style';

export type CollapseMiniProps = CollapseVariants & {
  title?: string;
  content?: string;
  value?: boolean | null;
  defaultValue?: boolean;
  isDisabled?: boolean;
  hasIndicator?: boolean;
  className?: string;
  classNames?: Partial<CollapseMiniClassNames>;
  style?: string;
};

export const collapseMiniProps = {
  variant: { type: null, value: 'outline' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'md' },
  title: { type: String, value: '' },
  content: { type: String, value: '' },
  value: { type: null, value: null },
  defaultValue: { type: Boolean, value: false },
  isDisabled: { type: Boolean, value: false },
  hasIndicator: { type: Boolean, value: true },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
