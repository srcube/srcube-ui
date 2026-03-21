import type { CollapseMiniClassNames, CollapseVariants } from '@srcube-ui/styles/components/collapse/style';

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
  tone: { type: null, value: 'default' },
  variant: { type: null, value: 'default' },
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
